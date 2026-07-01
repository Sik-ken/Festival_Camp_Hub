from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.deps import get_current_user_optional
from app.models import ActivityEvent, Photo, Setting, User
from app.services.images import apply_camp_frame, save_upload

router = APIRouter(prefix="/api/photobooth", tags=["photobooth"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_photobooth_photo(
    photo: UploadFile = File(...),
    caption: str | None = Form(None),
    user: User | None = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    if caption and len(caption) > settings.max_photobooth_text_length:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Text darf maximal {settings.max_photobooth_text_length} Zeichen lang sein",
        )

    original_path, processed_path, thumbnail_path = await save_upload(photo, "photobooth")

    frame_setting = db.execute(
        select(Setting).where(Setting.key == "public_frame_path")
    ).scalar_one_or_none()
    frame_path = Path(frame_setting.value) if frame_setting and frame_setting.value else None
    apply_camp_frame(processed_path, thumbnail_path, frame_path)

    photo_row = Photo(
        user_id=user.id if user else None,
        challenge_id=None,
        upload_type="photobooth",
        original_path=str(original_path),
        processed_path=str(processed_path),
        thumbnail_path=str(thumbnail_path),
        caption=caption,
        public=1,
    )
    db.add(photo_row)
    db.add(
        ActivityEvent(
            event_type="photo_uploaded",
            message="Neues Fotobox-Bild wurde hinzugefügt",
        )
    )
    db.commit()
    db.refresh(photo_row)

    return {
        "id": photo_row.id,
        "thumbnail_path": photo_row.thumbnail_path,
        "processed_path": photo_row.processed_path,
    }
