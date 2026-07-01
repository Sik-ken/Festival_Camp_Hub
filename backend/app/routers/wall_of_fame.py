from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ActivityEvent, Funnel, Photo, User, UserChallenge

router = APIRouter(prefix="/api/wall-of-fame", tags=["wall-of-fame"])


def _top_user_by(db: Session, column, label: str) -> dict | None:
    row = db.execute(
        select(User.nickname, column.label("value"))
        .order_by(column.desc())
        .limit(1)
    ).first()
    if row is None or row.value in (None, 0):
        return None
    return {"label": label, "nickname": row.nickname, "value": row.value}


@router.get("")
def wall_of_fame(db: Session = Depends(get_db)):
    entries = []

    entries.append(_top_user_by(db, User.points, "Meiste Punkte"))
    entries.append(_top_user_by(db, User.points, "Höchstes Level"))

    challenges_row = db.execute(
        select(User.nickname, func.count(UserChallenge.id).label("value"))
        .join(UserChallenge, UserChallenge.user_id == User.id)
        .where(UserChallenge.status == "completed")
        .group_by(User.id)
        .order_by(func.count(UserChallenge.id).desc())
        .limit(1)
    ).first()
    if challenges_row:
        entries.append(
            {"label": "Meiste Challenges", "nickname": challenges_row.nickname, "value": challenges_row.value}
        )

    photos_row = db.execute(
        select(User.nickname, func.count(Photo.id).label("value"))
        .join(Photo, Photo.user_id == User.id)
        .where(Photo.deleted == 0)
        .group_by(User.id)
        .order_by(func.count(Photo.id).desc())
        .limit(1)
    ).first()
    if photos_row:
        entries.append({"label": "Meiste Fotos", "nickname": photos_row.nickname, "value": photos_row.value})

    funnels_row = db.execute(
        select(User.nickname, func.coalesce(func.sum(Funnel.count), 0).label("value"))
        .join(Funnel, Funnel.user_id == User.id)
        .group_by(User.id)
        .order_by(func.sum(Funnel.count).desc())
        .limit(1)
    ).first()
    if funnels_row and funnels_row.value:
        entries.append({"label": "Meiste Trichter", "nickname": funnels_row.nickname, "value": funnels_row.value})

    first_user = db.execute(select(User).order_by(User.created_at).limit(1)).scalar_one_or_none()
    if first_user:
        entries.append({"label": "Erster registrierter Benutzer", "nickname": first_user.nickname, "value": None})

    latest_photo = db.execute(
        select(Photo).where(Photo.deleted == 0).order_by(Photo.created_at.desc()).limit(1)
    ).scalar_one_or_none()
    if latest_photo:
        entries.append(
            {"label": "Letztes Foto", "nickname": None, "value": None, "photo_thumbnail": latest_photo.thumbnail_path}
        )

    active_row = db.execute(
        select(User.nickname, func.count(ActivityEvent.id).label("value"))
        .join(ActivityEvent, ActivityEvent.user_id == User.id)
        .group_by(User.id)
        .order_by(func.count(ActivityEvent.id).desc())
        .limit(1)
    ).first()
    if active_row:
        entries.append({"label": "Aktivster Nutzer", "nickname": active_row.nickname, "value": active_row.value})

    return [e for e in entries if e is not None]
