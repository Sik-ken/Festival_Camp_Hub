import random

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Photo

router = APIRouter(prefix="/api/gallery", tags=["gallery"])


def _serialize(photo: Photo) -> dict:
    return {
        "id": photo.id,
        "thumbnail_path": photo.thumbnail_path,
        "processed_path": photo.processed_path,
        "caption": photo.caption,
        "upload_type": photo.upload_type,
        "created_at": photo.created_at,
    }


@router.get("")
def list_gallery(
    limit: int = Query(60, le=200),
    offset: int = 0,
    db: Session = Depends(get_db),
):
    photos = db.execute(
        select(Photo)
        .where(Photo.public == 1, Photo.deleted == 0)
        .order_by(Photo.created_at.desc())
        .limit(limit)
        .offset(offset)
    ).scalars().all()
    return [_serialize(p) for p in photos]


@router.get("/random")
def random_gallery(count: int = Query(20, le=100), db: Session = Depends(get_db)):
    ids = db.execute(
        select(Photo.id).where(Photo.public == 1, Photo.deleted == 0)
    ).scalars().all()
    sample_ids = random.sample(ids, min(count, len(ids))) if ids else []
    if not sample_ids:
        return []
    photos = db.execute(select(Photo).where(Photo.id.in_(sample_ids))).scalars().all()
    return [_serialize(p) for p in photos]
