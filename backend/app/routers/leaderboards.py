from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

router = APIRouter(prefix="/api/leaderboards", tags=["leaderboards"])


@router.get("/points")
def points_leaderboard(limit: int = Query(50, le=200), db: Session = Depends(get_db)):
    users = db.execute(
        select(User)
        .where(User.is_active == 1)
        .order_by(User.points.desc(), User.nickname)
        .limit(limit)
    ).scalars().all()
    return [
        {
            "rank": rank,
            "user_id": u.id,
            "nickname": u.nickname,
            "points": u.points,
            "level_name": u.level_name,
        }
        for rank, u in enumerate(users, start=1)
    ]
