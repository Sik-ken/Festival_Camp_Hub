from sqlalchemy import select
from sqlalchemy.sql.elements import ColumnElement

from app.models import Role, User, UserRole


def non_admin_ids() -> ColumnElement:
    admin_ids = select(UserRole.user_id).join(Role, Role.id == UserRole.role_id).where(
        Role.name == "admin"
    )
    return User.id.notin_(admin_ids)
