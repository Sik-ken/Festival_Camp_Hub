import json

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import (
    ActivityEvent,
    AdminAction,
    Challenge,
    Funnel,
    Photo,
    PushSubscription,
    Role,
    User,
    UserBadge,
    UserChallenge,
    UserRole,
)
from app.security import hash_pin
from app.services.backup import run_backup
from app.services.leveling import level_for_points

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _log_action(db: Session, admin: User, action_type: str, target_type: str, target_id: int, before=None, after=None):
    db.add(
        AdminAction(
            admin_user_id=admin.id,
            action_type=action_type,
            target_type=target_type,
            target_id=target_id,
            before_json=json.dumps(before) if before is not None else None,
            after_json=json.dumps(after) if after is not None else None,
        )
    )


def _user_roles_map(db: Session) -> dict[int, list[str]]:
    rows = db.execute(
        select(UserRole.user_id, Role.name).join(Role, Role.id == UserRole.role_id)
    ).all()
    roles_by_user: dict[int, list[str]] = {}
    for user_id, role_name in rows:
        roles_by_user.setdefault(user_id, []).append(role_name)
    return roles_by_user


@router.get("/users")
def list_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    users = db.execute(select(User).order_by(User.created_at.desc())).scalars().all()
    roles_by_user = _user_roles_map(db)
    return [
        {
            "id": u.id,
            "festival_id": u.festival_id,
            "nickname": u.nickname,
            "hometown": u.hometown,
            "points": u.points,
            "level_name": u.level_name,
            "is_active": bool(u.is_active),
            "roles": roles_by_user.get(u.id, []),
            "created_at": u.created_at,
        }
        for u in users
    ]


class RoleAssignment(BaseModel):
    role_name: str


@router.post("/users/{user_id}/roles")
def assign_role(
    user_id: int,
    payload: RoleAssignment,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    target = db.get(User, user_id)
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nutzer nicht gefunden")
    role = db.execute(select(Role).where(Role.name == payload.role_name)).scalar_one_or_none()
    if role is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Unbekannte Rolle")

    existing = db.execute(
        select(UserRole).where(UserRole.user_id == user_id, UserRole.role_id == role.id)
    ).scalar_one_or_none()
    if existing is None:
        db.add(UserRole(user_id=user_id, role_id=role.id))
        _log_action(db, admin, "assign_role", "user", user_id, after={"role": payload.role_name})
        db.commit()
    return {"user_id": user_id, "role": payload.role_name}


@router.delete("/users/{user_id}/roles/{role_name}")
def remove_role(
    user_id: int,
    role_name: str,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if role_name == "user":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Grundrolle 'user' kann nicht entfernt werden")
    role = db.execute(select(Role).where(Role.name == role_name)).scalar_one_or_none()
    if role is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Unbekannte Rolle")
    existing = db.execute(
        select(UserRole).where(UserRole.user_id == user_id, UserRole.role_id == role.id)
    ).scalar_one_or_none()
    if existing:
        db.delete(existing)
        _log_action(db, admin, "remove_role", "user", user_id, before={"role": role_name})
        db.commit()
    return {"user_id": user_id, "removed_role": role_name}


class UserUpdate(BaseModel):
    nickname: str | None = None
    hometown: str | None = None
    first_name: str | None = None
    camp_name: str | None = None
    crush: str | None = None
    favorite_act: str | None = None
    favorite_color: str | None = None
    is_active: bool | None = None


@router.patch("/users/{user_id}")
def update_user(
    user_id: int,
    payload: UserUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    target = db.get(User, user_id)
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nutzer nicht gefunden")

    updates = payload.model_dump(exclude_unset=True)
    before = {field: getattr(target, field) for field in updates}
    for field, value in updates.items():
        setattr(target, field, int(value) if field == "is_active" else value)

    _log_action(db, admin, "update_user", "user", user_id, before=before, after=updates)
    db.commit()
    return {"id": user_id, "updated": True}


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    target = db.get(User, user_id)
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nutzer nicht gefunden")
    if target.is_active:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Nutzer muss zuerst deaktiviert werden, bevor er gelöscht werden kann",
        )

    before = {"festival_id": target.festival_id, "nickname": target.nickname}

    # Fotos, Aktivitäts-Feed und fremde Trichter-Einträge bleiben erhalten
    # (öffentliche Galerie/Wall of Fame), werden aber vom gelöschten Nutzer gelöst.
    db.query(Photo).filter(Photo.user_id == user_id).update({"user_id": None})
    db.query(ActivityEvent).filter(ActivityEvent.user_id == user_id).update({"user_id": None})
    db.query(Funnel).filter(Funnel.created_by_user_id == user_id).update(
        {"created_by_user_id": None}
    )
    db.query(User).filter(User.nominated_by_user_id == user_id).update(
        {"nominated_by_user_id": None}
    )

    # Eigene Datensätze des Nutzers werden vollständig entfernt.
    db.query(PushSubscription).filter(PushSubscription.user_id == user_id).delete()
    db.query(UserRole).filter(UserRole.user_id == user_id).delete()
    db.query(UserBadge).filter(UserBadge.user_id == user_id).delete()
    db.query(UserChallenge).filter(UserChallenge.user_id == user_id).delete()
    db.query(Funnel).filter(Funnel.user_id == user_id).delete()
    db.query(AdminAction).filter(AdminAction.admin_user_id == user_id).delete()

    _log_action(db, admin, "delete_user", "user", user_id, before=before)
    db.delete(target)
    db.commit()
    return {"id": user_id, "deleted": True}


class PinReset(BaseModel):
    new_pin: str = Field(min_length=4, max_length=32)


@router.post("/users/{user_id}/reset-pin")
def reset_pin(
    user_id: int,
    payload: PinReset,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    target = db.get(User, user_id)
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nutzer nicht gefunden")
    target.pin_hash = hash_pin(payload.new_pin)
    _log_action(db, admin, "reset_pin", "user", user_id)
    db.commit()
    return {"id": user_id, "pin_reset": True}


class PointsAdjustment(BaseModel):
    delta: int
    reason: str | None = None


@router.post("/users/{user_id}/adjust-points")
def adjust_points(
    user_id: int,
    payload: PointsAdjustment,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    target = db.get(User, user_id)
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nutzer nicht gefunden")

    before_points = target.points
    target.points = max(0, target.points + payload.delta)
    target.level_name = level_for_points(target.points)

    _log_action(
        db,
        admin,
        "adjust_points",
        "user",
        user_id,
        before={"points": before_points},
        after={"points": target.points, "delta": payload.delta, "reason": payload.reason},
    )
    db.commit()
    return {"id": user_id, "points": target.points, "level_name": target.level_name}


@router.delete("/photos/{photo_id}")
def delete_photo(photo_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    photo = db.get(Photo, photo_id)
    if photo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Foto nicht gefunden")
    photo.deleted = 1
    photo.public = 0
    _log_action(db, admin, "delete_photo", "photo", photo_id, before={"deleted": False}, after={"deleted": True})
    db.commit()
    return {"id": photo_id, "deleted": True}


class ChallengeUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    points: int | None = None
    unlock_points: int | None = None
    is_open: bool | None = None
    sort_order: int | None = None


@router.patch("/challenges/{challenge_id}")
def update_challenge(
    challenge_id: int,
    payload: ChallengeUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    challenge = db.get(Challenge, challenge_id)
    if challenge is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Challenge nicht gefunden")

    before = {
        "title": challenge.title,
        "points": challenge.points,
        "unlock_points": challenge.unlock_points,
        "is_open": bool(challenge.is_open),
    }
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(challenge, field, int(value) if field == "is_open" else value)

    _log_action(db, admin, "update_challenge", "challenge", challenge_id, before=before, after=payload.model_dump(exclude_unset=True))
    db.commit()
    return {"id": challenge_id, "updated": True}


@router.post("/backups")
def trigger_backup(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    path = run_backup()
    _log_action(db, admin, "create_backup", "backup", 0, after={"path": path})
    db.commit()
    return {"backup_path": path}
