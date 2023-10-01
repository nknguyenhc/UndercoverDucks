from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from .base import Base

class UserAuth(Base):
    __tablename__ = "user_auth"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30))
    password_hash: Mapped[str]

    def __repr__(self) -> str:
        return f"UserAuth(id={self.id!r}, username={self.username!r}, password_hash={self.password_hash!r})"
