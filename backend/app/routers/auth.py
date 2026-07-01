from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import ActivityEvent, Role, User, UserRole
from app.schemas import LoginRequest, TokenResponse, UserMe
from app.security import create_access_token, hash_pin, verify_pin
from app.services.images import save_upload

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _user_roles(db: Session, user: User) -> list[str]:
    rows = db.execute(
        select(Role.name).join(UserRole, UserRole.role_id == Role.id).where(
            UserRole.user_id == user.id
        )
    ).all()
    return [r[0] for r in rows]


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    festival_id: str = Form(...),
    pin: str = Form(...),
    nickname: str = Form(...),
    hometown: str = Form(...),
    first_name: str | None = Form(None),
    camp_name: str | None = Form(None),
    crush: str | None = Form(None),
    favorite_act: str | None = Form(None),
    favorite_color: str | None = Form(None),
    profile_photo: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if len(pin) < 4:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "PIN zu kurz")

    existing = db.execute(
        select(User).where(
            (User.festival_id == festival_id) | (User.nickname == nickname)
        )
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Festival-ID oder Spitzname bereits vergeben")

    _, processed_path, _ = await save_upload(profile_photo, "profile")

    user = User(
        festival_id=festival_id,
        pin_hash=hash_pin(pin),
        nickname=nickname,
        hometown=hometown,
        first_name=first_name,
        camp_name=camp_name,
        crush=crush,
        favorite_act=favorite_act,
        favorite_color=favorite_color,
        profile_photo_path=str(processed_path),
    )
    db.add(user)
    db.flush()

    user_role = db.execute(select(Role).where(Role.name == "user")).scalar_one()
    db.add(UserRole(user_id=user.id, role_id=user_role.id))
    db.add(
        ActivityEvent(
            event_type="user_registered",
            user_id=user.id,
            message=f"{user.nickname} ist dem Camp beigetreten",
        )
    )
    db.commit()

    token = create_access_token(user.id, ["user"])
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.execute(
        select(User).where(User.festival_id == payload.festival_id)
    ).scalar_one_or_none()
    if user is None or not verify_pin(payload.pin, user.pin_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Festival-ID oder PIN falsch")

    from datetime import datetime

    user.last_login_at = datetime.utcnow()
    db.commit()

    roles = _user_roles(db, user)
    token = create_access_token(user.id, roles)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserMe)
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return UserMe(
        id=user.id,
        nickname=user.nickname,
        hometown=user.hometown,
        first_name=user.first_name,
        camp_name=user.camp_name,
        crush=user.crush,
        favorite_act=user.favorite_act,
        favorite_color=user.favorite_color,
        profile_photo_path=user.profile_photo_path,
        points=user.points,
        level_name=user.level_name,
        created_at=user.created_at,
        festival_id=user.festival_id,
        roles=_user_roles(db, user),
        last_login_at=user.last_login_at,
    )
