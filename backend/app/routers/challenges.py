from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import ActivityEvent, Challenge, Photo, User, UserChallenge
from app.services.images import save_upload
from app.services.leveling import level_for_points

router = APIRouter(prefix="/api/challenges", tags=["challenges"])


def _serialize(challenge: Challenge, user_points: int, uc: UserChallenge | None) -> dict:
    unlocked = user_points >= challenge.unlock_points
    return {
        "id": challenge.id,
        "title": challenge.title,
        "description": challenge.description,
        "points": challenge.points,
        "unlock_points": challenge.unlock_points,
        "locked": not unlocked,
        "status": uc.status if uc else "assigned",
        "completed_at": uc.completed_at if uc else None,
    }


@router.get("")
def list_challenges(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    challenges = db.execute(
        select(Challenge).order_by(Challenge.sort_order, Challenge.id)
    ).scalars().all()
    user_challenges = {
        uc.challenge_id: uc
        for uc in db.execute(
            select(UserChallenge).where(UserChallenge.user_id == user.id)
        ).scalars()
    }
    return [_serialize(c, user.points, user_challenges.get(c.id)) for c in challenges]


@router.get("/{challenge_id}")
def get_challenge(
    challenge_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    challenge = db.get(Challenge, challenge_id)
    if challenge is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Challenge nicht gefunden")
    uc = db.execute(
        select(UserChallenge).where(
            UserChallenge.user_id == user.id, UserChallenge.challenge_id == challenge_id
        )
    ).scalar_one_or_none()
    return _serialize(challenge, user.points, uc)


@router.post("/{challenge_id}/submit", status_code=status.HTTP_201_CREATED)
async def submit_challenge(
    challenge_id: int,
    photo: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    challenge = db.get(Challenge, challenge_id)
    if challenge is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Challenge nicht gefunden")
    if user.points < challenge.unlock_points:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Challenge noch gesperrt")

    existing = db.execute(
        select(UserChallenge).where(
            UserChallenge.user_id == user.id, UserChallenge.challenge_id == challenge_id
        )
    ).scalar_one_or_none()
    if existing and existing.status == "completed":
        raise HTTPException(status.HTTP_409_CONFLICT, "Challenge bereits abgeschlossen")

    original_path, processed_path, thumbnail_path = await save_upload(photo, "challenge")

    photo_row = Photo(
        user_id=user.id,
        challenge_id=challenge_id,
        upload_type="challenge",
        original_path=str(original_path),
        processed_path=str(processed_path),
        thumbnail_path=str(thumbnail_path),
        public=1,
    )
    db.add(photo_row)
    db.flush()

    now = datetime.utcnow()
    if existing is None:
        existing = UserChallenge(user_id=user.id, challenge_id=challenge_id)
        db.add(existing)
    existing.status = "completed"
    existing.submitted_photo_id = photo_row.id
    existing.submitted_at = now
    existing.completed_at = now

    user.points += challenge.points
    user.level_name = level_for_points(user.points)

    db.add(
        ActivityEvent(
            event_type="challenge_completed",
            user_id=user.id,
            target_id=challenge.id,
            message=f"{user.nickname} hat '{challenge.title}' abgeschlossen (+{challenge.points} Punkte)",
        )
    )
    db.commit()

    return {
        "status": "completed",
        "points": user.points,
        "level_name": user.level_name,
        "photo_id": photo_row.id,
    }
