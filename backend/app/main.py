from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import (
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


@app.on_event("startup")
def on_startup() -> None:
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
