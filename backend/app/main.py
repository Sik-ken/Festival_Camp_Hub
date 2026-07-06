from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import (
    activity,
    admin,
    auth,
    challenges,
    friendbook,
    funnels,
    gallery,
    leaderboards,
    photobooth,
    push,
    stats,
    wall_of_fame,
)
from app.seed.seed_data import run_all_seeds

app = FastAPI(title="Helmpflicht Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _ensure_users_columns() -> None:
    """Kein Alembic vorhanden; bestehende SQLite-DBs (z.B. auf dem Rock) bekommen
    neue Spalten nicht automatisch von create_all. Idempotenter Nachzieh-Schritt."""
    new_columns = {
        "pending_nomination": "INTEGER DEFAULT 0",
        "nominated_by_user_id": "INTEGER",
    }
    with engine.connect() as conn:
        table_exists = conn.execute(
            text("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        ).first()
        if table_exists is None:
            return

        existing = {row[1] for row in conn.execute(text("PRAGMA table_info(users)"))}
        for column, ddl_type in new_columns.items():
            if column not in existing:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {column} {ddl_type}"))
        conn.commit()


@app.on_event("startup")
def on_startup() -> None:
    _ensure_users_columns()
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_all_seeds(db)
    finally:
        db.close()


app.mount("/uploads", StaticFiles(directory=str(settings.uploads_dir)), name="uploads")
app.mount(
    "/thumbnails", StaticFiles(directory=str(settings.thumbnails_dir)), name="thumbnails"
)

app.include_router(activity.router)
app.include_router(auth.router)
app.include_router(friendbook.router)
app.include_router(photobooth.router)
app.include_router(gallery.router)
app.include_router(challenges.router)
app.include_router(funnels.router)
app.include_router(leaderboards.router)
app.include_router(wall_of_fame.router)
app.include_router(stats.router)
app.include_router(admin.router)
app.include_router(push.router)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "camp_name": settings.camp_name}
