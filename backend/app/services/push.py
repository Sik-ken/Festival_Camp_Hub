"""Broadcast von Web-Push-Benachrichtigungen an alle registrierten Geräte
(außer dem des Auslösers). Läuft als FastAPI-BackgroundTask nach dem
DB-Commit, damit der Versand die eigentliche Antwort nicht verzögert.

Öffnet bewusst eine eigene DB-Session statt der Request-Session, da
BackgroundTasks erst nach dem Schließen der Request-gebundenen Session
laufen können."""

import json
import logging

from pywebpush import WebPushException, webpush
from sqlalchemy import select

from app.config import settings
from app.database import SessionLocal
from app.models import PushSubscription

logger = logging.getLogger(__name__)


def broadcast_push(title: str, body: str, url: str = "/", exclude_user_id: int | None = None) -> None:
    if not settings.vapid_public_key or not settings.vapid_private_key:
        return

    db = SessionLocal()
    try:
        _broadcast(db, title, body, url, exclude_user_id)
    finally:
        db.close()


def _broadcast(db, title: str, body: str, url: str, exclude_user_id: int | None) -> None:
    subscriptions = db.execute(
        select(PushSubscription).where(PushSubscription.user_id != exclude_user_id)
        if exclude_user_id is not None
        else select(PushSubscription)
    ).scalars().all()

    payload = json.dumps({"title": title, "body": body, "url": url})
    stale_ids: list[int] = []

    for sub in subscriptions:
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {"p256dh": sub.p256dh, "auth": sub.auth},
                },
                data=payload,
                vapid_private_key=settings.vapid_private_key,
                vapid_claims={"sub": f"mailto:{settings.vapid_admin_email}"},
            )
        except WebPushException as exc:
            status_code = exc.response.status_code if exc.response is not None else None
            if status_code in (404, 410):
                stale_ids.append(sub.id)
            else:
                logger.warning("Push an Subscription %s fehlgeschlagen: %s", sub.id, exc)

    if stale_ids:
        db.query(PushSubscription).filter(PushSubscription.id.in_(stale_ids)).delete(
            synchronize_session=False
        )
        db.commit()
