from datetime import datetime

from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    festival_id: str = Field(min_length=3, max_length=64)
    pin: str = Field(min_length=4, max_length=32)
    nickname: str = Field(min_length=2, max_length=64)
    hometown: str = Field(min_length=1, max_length=128)
    first_name: str | None = None
    camp_name: str | None = None
    crush: str | None = None
    favorite_act: str | None = None
    favorite_color: str | None = None
    # profile_photo wird als multipart-Feld separat mitgeschickt (siehe routers/auth.py)


class LoginRequest(BaseModel):
    festival_id: str
    pin: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserPublic(BaseModel):
    id: int
    nickname: str
    hometown: str
    first_name: str | None
    camp_name: str | None
    crush: str | None
    favorite_act: str | None
    favorite_color: str | None
    profile_photo_path: str
    points: int
    level_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserMe(UserPublic):
    festival_id: str
    roles: list[str]
    last_login_at: datetime | None
    funnels_total: int
    pending_nomination: bool


class ProfileUpdate(BaseModel):
    nickname: str | None = Field(default=None, min_length=2, max_length=64)
    hometown: str | None = Field(default=None, min_length=1, max_length=128)
    first_name: str | None = None
    camp_name: str | None = None
    crush: str | None = None
    favorite_act: str | None = None
    favorite_color: str | None = None
