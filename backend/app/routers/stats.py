from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Funnel, Photo, User, UserChallenge

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("")
def public_stats(db: Session = Depends(get_db)):
    """Live-Statistiken für die Startseite (PRD 5.9): Teilnehmer, Fotos,
    abgeschlossene Challenges, Trichter gesamt. Bewusst ohne Auth, da laut
    PRD auch Gäste die Startseite mit Statistikbereich sehen."""
    return {
        "participants": db.execute(select(func.count(User.id)).where(User.is_active == 1)).scalar_one(),
        "photos": db.execute(select(func.count(Photo.id)).where(Photo.deleted == 0)).scalar_one(),
        "challenges_completed": db.execute(
            select(func.count(UserChallenge.id)).where(UserChallenge.status == "completed")
        ).scalar_one(),
        "funnels_total": db.execute(select(func.coalesce(func.sum(Funnel.count), 0))).scalar_one(),
    }
