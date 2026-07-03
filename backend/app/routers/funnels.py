from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_funnel_watcher
from app.models import ActivityEvent, Funnel, User
from app.services.leveling import FUNNEL_BADGE_THRESHOLDS
from app.services.push import broadcast_push
from app.services.rankings import non_admin_ids

router = APIRouter(prefix="/api/funnels", tags=["funnels"])


class FunnelCreate(BaseModel):
    user_id: int
    note: str | None = None


class FunnelCorrect(BaseModel):
    count: int


@router.post("", status_code=status.HTTP_201_CREATED)
def add_funnel(
    payload: FunnelCreate,
    background_tasks: BackgroundTasks,
    watcher: User = Depends(require_funnel_watcher),
    db: Session = Depends(get_db),
):
    target = db.get(User, payload.user_id)
    if target is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nutzer nicht gefunden")

    entry = Funnel(
        user_id=target.id,
        count=1,
        note=payload.note,
        created_by_user_id=watcher.id,
    )
    db.add(entry)
    db.add(
        ActivityEvent(
            event_type="funnel_added",
            user_id=target.id,
            message=f"{target.nickname} hat einen Trichter getrunken",
        )
    )
    db.commit()

    background_tasks.add_task(
        broadcast_push,
        title="Trichter! 🍺",
        body=f"{target.nickname} hat einen Trichter getrunken",
        url="/funnels",
        exclude_user_id=target.id,
    )

    total = db.execute(
        select(func.coalesce(func.sum(Funnel.count), 0)).where(Funnel.user_id == target.id)
    ).scalar_one()
    return {"user_id": target.id, "total_funnels": total}


@router.patch("/{funnel_id}")
def correct_funnel(
    funnel_id: int,
    payload: FunnelCorrect,
    watcher: User = Depends(require_funnel_watcher),
    db: Session = Depends(get_db),
):
    entry = db.get(Funnel, funnel_id)
    if entry is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Eintrag nicht gefunden")
    entry.count = payload.count
    entry.corrected_at = datetime.utcnow()
    db.commit()
    return {"id": entry.id, "count": entry.count}


@router.get("/user/{user_id}")
def list_user_funnels(
    user_id: int,
    watcher: User = Depends(require_funnel_watcher),
    db: Session = Depends(get_db),
):
    entries = db.execute(
        select(Funnel).where(Funnel.user_id == user_id).order_by(Funnel.created_at.desc())
    ).scalars().all()
    return [
        {
            "id": e.id,
            "count": e.count,
            "note": e.note,
            "created_at": e.created_at,
            "corrected_at": e.corrected_at,
        }
        for e in entries
    ]


@router.delete("/{funnel_id}")
def delete_funnel(
    funnel_id: int,
    watcher: User = Depends(require_funnel_watcher),
    db: Session = Depends(get_db),
):
    entry = db.get(Funnel, funnel_id)
    if entry is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Eintrag nicht gefunden")
    user_id = entry.user_id
    db.delete(entry)
    db.commit()

    total = db.execute(
        select(func.coalesce(func.sum(Funnel.count), 0)).where(Funnel.user_id == user_id)
    ).scalar_one()
    return {"user_id": user_id, "total_funnels": total}


@router.get("/leaderboard")
def funnel_leaderboard(db: Session = Depends(get_db)):
    rows = db.execute(
        select(User.id, User.nickname, func.coalesce(func.sum(Funnel.count), 0).label("total"))
        .join(Funnel, Funnel.user_id == User.id)
        .where(non_admin_ids())
        .group_by(User.id)
        .order_by(func.sum(Funnel.count).desc(), User.nickname)
    ).all()
    result = []
    for rank, (user_id, nickname, total) in enumerate(rows, start=1):
        badge = None
        for threshold, name in FUNNEL_BADGE_THRESHOLDS:
            if total >= threshold:
                badge = name
        result.append(
            {"rank": rank, "user_id": user_id, "nickname": nickname, "funnels": total, "badge": badge}
        )
    return result
