from sqlalchemy.sql.elements import ColumnElement

from app.config import settings
from app.models import User


def non_admin_ids() -> ColumnElement:
    """Excludes only the fixed bootstrap admin account, not every user with the admin role."""
    return User.festival_id != settings.admin_bootstrap_festival_id
