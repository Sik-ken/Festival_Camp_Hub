from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Photo, User
from app.schemas import UserPublic

router = APIRouter(prefix="/api/friendbook", tags=["friendbook"])


@router.get("", response_model=list[UserPublic])
def list_friendbook(db: Session = Depends(get_db)):
    users = db.execute(
        select(User).where(User.is_active == 1).order_by(User.created_at.desc())
    ).scalars().all()
    return users


@router.get("/{user_id}", response_model=UserPublic)
def get_friendbook_entry(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nutzer nicht gefunden")
    return user


@router.get("/{user_id}/photos")
def get_friendbook_entry_photos(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nutzer nicht gefunden")

    photos = db.execute(
        select(Photo)
        .where(
            Photo.user_id == user_id,
            Photo.upload_type.in_(["photobooth", "challenge"]),
            Photo.public == 1,
            Photo.deleted == 0,
        )
        .order_by(Photo.created_at.desc())
    ).scalars().all()
    return [
        {
            "id": p.id,
            "thumbnail_path": p.thumbnail_path,
            "processed_path": p.processed_path,
            "upload_type": p.upload_type,
            "caption": p.caption,
            "created_at": p.created_at,
        }
        for p in photos
    ]
