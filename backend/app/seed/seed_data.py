from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Badge, Challenge, Role, Setting, User, UserRole
from app.security import hash_pin
from app.seed.challenges_data import build_challenges
from app.services.leveling import FUNNEL_BADGE_THRESHOLDS, LEVEL_THRESHOLDS

ROLES = ["guest", "user", "funnel_watcher", "admin"]

DEFAULT_SETTINGS = {
    "camp_name": settings.camp_name,
    "public_frame_path": str(settings.default_camp_badge_path),
    "slideshow_interval_ms": str(settings.slideshow_interval_ms),
}


def seed_roles(db: Session) -> None:
    existing = {r.name for r in db.execute(select(Role)).scalars()}
    for name in ROLES:
        if name not in existing:
            db.add(Role(name=name, description=f"Rolle {name}"))
    db.commit()


def seed_badges(db: Session) -> None:
    existing = {b.name for b in db.execute(select(Badge)).scalars()}
    for threshold, name in LEVEL_THRESHOLDS:
        if name not in existing:
            db.add(Badge(name=name, icon="helmet", points_threshold=threshold))
    for threshold, name in FUNNEL_BADGE_THRESHOLDS:
        if name not in existing:
            db.add(Badge(name=name, icon="funnel", points_threshold=None))
    db.commit()


def seed_settings(db: Session) -> None:
    existing = {s.key for s in db.execute(select(Setting)).scalars()}
    for key, value in DEFAULT_SETTINGS.items():
        if key not in existing:
            db.add(Setting(key=key, value=value))
    db.commit()


def seed_challenges(db: Session) -> None:
    if db.execute(select(Challenge.id).limit(1)).first() is not None:
        return
    for entry in build_challenges():
        db.add(Challenge(**entry))
    db.commit()


def seed_admin_user(db: Session) -> None:
    existing = db.execute(
        select(User).where(User.festival_id == settings.admin_bootstrap_festival_id)
    ).scalar_one_or_none()
    if existing is not None:
        return

    admin = User(
        festival_id=settings.admin_bootstrap_festival_id,
        pin_hash=hash_pin(settings.admin_bootstrap_pin),
        nickname="Admin",
        hometown="Camp Helmpflicht",
        profile_photo_path="",
        level_name=LEVEL_THRESHOLDS[0][1],
    )
    db.add(admin)
    db.flush()

    admin_role = db.execute(select(Role).where(Role.name == "admin")).scalar_one()
    db.add(UserRole(user_id=admin.id, role_id=admin_role.id))
    db.commit()


def run_all_seeds(db: Session) -> None:
    seed_roles(db)
    seed_badges(db)
    seed_settings(db)
    seed_challenges(db)
    seed_admin_user(db)
