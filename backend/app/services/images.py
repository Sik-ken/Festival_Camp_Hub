import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageOps

from app.config import settings


def _new_filename(suffix: str) -> str:
    return f"{uuid.uuid4().hex}{suffix}"


async def save_upload(file: UploadFile, subdir: str) -> tuple[Path, Path, Path]:
    """Validiert, speichert Original + komprimierte Version + Thumbnail.

    Gibt (original_path, processed_path, thumbnail_path) relativ zu den
    konfigurierten Datenverzeichnissen zurück.
    """
    if file.content_type not in settings.allowed_image_types:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Dateityp {file.content_type} nicht erlaubt",
        )

    raw = await file.read()
    if len(raw) > settings.max_upload_bytes:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Datei zu groß")

    base_name = _new_filename(".jpg")
    upload_subdir = settings.uploads_dir / subdir
    thumb_subdir = settings.thumbnails_dir / subdir
    upload_subdir.mkdir(parents=True, exist_ok=True)
    thumb_subdir.mkdir(parents=True, exist_ok=True)

    original_path = upload_subdir / f"orig_{base_name}"
    processed_path = upload_subdir / base_name
    thumbnail_path = thumb_subdir / base_name

    original_path.write_bytes(raw)

    with Image.open(original_path) as img:
        img = ImageOps.exif_transpose(img)
        img = img.convert("RGB")

        processed = img.copy()
        processed.thumbnail((1920, 1920))
        processed.save(processed_path, "JPEG", quality=85)

        thumb = img.copy()
        thumb.thumbnail((settings.thumbnail_max_size, settings.thumbnail_max_size))
        thumb.save(thumbnail_path, "JPEG", quality=80)

    return (
        original_path.relative_to(settings.data_dir),
        processed_path.relative_to(settings.data_dir),
        thumbnail_path.relative_to(settings.data_dir),
    )


def apply_camp_frame(processed_path: Path, thumbnail_path: Path, badge_path: Path | None) -> None:
    """Setzt das Camp-Logo als Badge in die untere rechte Ecke des Fotobox-Bilds,
    falls unter settings.public_frame_path ein Logo-Asset hinterlegt ist. Nutzt
    eine feste Kantenlänge relativ zur kürzeren Bildseite, damit das Logo bei
    jedem Foto-Seitenverhältnis unverzerrt bleibt (kein Stretch auf Bildgröße).
    Ohne hinterlegtes Asset bleibt das Bild unverändert."""
    if badge_path is None or not badge_path.is_file():
        return

    full_processed = settings.data_dir / processed_path
    full_thumbnail = settings.data_dir / thumbnail_path

    with Image.open(badge_path).convert("RGBA") as badge:
        for target in (full_processed, full_thumbnail):
            with Image.open(target).convert("RGBA") as base:
                badge_width = int(min(base.size) * 0.28)
                ratio = badge_width / badge.width
                badge_height = int(badge.height * ratio)
                resized_badge = badge.resize((badge_width, badge_height), Image.LANCZOS)

                margin = int(min(base.size) * 0.03)
                position = (
                    base.width - badge_width - margin,
                    base.height - badge_height - margin,
                )
                base.paste(resized_badge, position, resized_badge)
                base.convert("RGB").save(target, "JPEG", quality=85)
