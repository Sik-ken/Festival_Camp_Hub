import json

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import (
    AdminAction,
    Challenge,
    Funnel,
    Photo,
    Role,
    User,
    UserChallenge,
    UserRole,
)
from app.services.backup import run_backup

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


@router.get("/stats")
def stats(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return {
        "users": db.execute(select(func.count(User.id))).scalar_one(),
        "photos": db.execute(select(func.count(Photo.id)).where(Photo.deleted == 0)).scalar_one(),
        "challenges_completed": db.execute(
            select(func.count(UserChallenge.id)).where(UserChallenge.status == "completed")
        ).scalar_one(),
        "funnels_total": db.execute(select(func.coalesce(func.sum(Funnel.count), 0))).scalar_one(),
    }


@router.get("/users")
def list_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    users = db.execute(select(User).order_by(User.created_at.desc())).scalars().all()
    return [
        {
            "id": u.id,
            "festival_id": u.festival_id,
            "nickname": u.nickname,
            "points": u.points,
            "level_name": u.level_name,
            "is_active": bool(u.is_active),
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
