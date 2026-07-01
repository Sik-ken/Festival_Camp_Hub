from collections.abc import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security import decode_access_token

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Nicht angemeldet")

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Ungültiges oder abgelaufenes Token")

    user = db.get(User, int(payload["sub"]))
    if user is None or not user.is_active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Benutzer nicht gefunden")

    user.role_names = payload.get("roles", [])
    return user


def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User | None:
    """Wie get_current_user, gibt aber None statt eines Fehlers zurück, wenn
    kein/ein ungültiges Token mitgeschickt wurde. Für Endpunkte, die sowohl
    Gästen als auch eingeloggten Nutzern offenstehen (z. B. Fotobox)."""
    if credentials is None:
        return None
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        return None
    user = db.get(User, int(payload["sub"]))
    if user is None or not user.is_active:
        return None
    user.role_names = payload.get("roles", [])
    return user


def require_roles(*allowed_roles: str) -> Callable[[User], User]:
    def checker(user: User = Depends(get_current_user)) -> User:
        if not set(getattr(user, "role_names", [])) & set(allowed_roles):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Keine Berechtigung")
        return user

    return checker


require_admin = require_roles("admin")
require_funnel_watcher = require_roles("admin", "funnel_watcher")
