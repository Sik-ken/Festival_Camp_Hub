from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ActivityEvent

router = APIRouter(prefix="/api/activity", tags=["activity"])


@router.get("/recent")
def recent_activity(
    limit: int = Query(default=3, ge=1, le=20),
    db: Session = Depends(get_db),
):
    events = db.execute(
        select(ActivityEvent).order_by(ActivityEvent.created_at.desc()).limit(limit)
    ).scalars().all()
    return [
        {
            "id": e.id,
            "event_type": e.event_type,
            "message": e.message,
            "created_at": e.created_at,
        }
        for e in events
    ]
