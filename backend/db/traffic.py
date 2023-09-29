from typing import List
from typing import Optional
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class Port(Base):
    __tablename__ = "port"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    traffics_from: Mapped[List["Traffic"]] = relationship(
        back_populates="port_from",
        cascade="all, delete-orphan",
        foreign_keys="Traffic.port_from_id"
    )
    traffics_to: Mapped[List["Traffic"]] = relationship(
        back_populates="port_to",
        cascade="all, delete-orphan",
        foreign_keys="Traffic.port_to_id",
    )
    volume: Mapped[int]

    def __repr__(self) -> str:
        return f"Port(id={self.id!r}, name={self.name!r}, volume={self.volume!r})"

class Traffic(Base):
    __tablename__ = "traffic"

    id: Mapped[int] = mapped_column(primary_key=True)
    port_from_id: Mapped[int] = mapped_column(ForeignKey("port.id"))
    port_from: Mapped["Port"] = relationship(
        "Port",
        back_populates="traffics_from",
        foreign_keys=[port_from_id],
    )
    port_to_id: Mapped[int] = mapped_column(ForeignKey("port.id"))
    port_to: Mapped["Port"] = relationship(
        "Port",
        back_populates="traffics_to",
        foreign_keys=[port_to_id],
    )
    proportion: Mapped[float]

    def __repr__(self) -> str:
        return f"Address(id={self.id!r}, port_from={self.port_from.name}, port_to={self.port_to.name}, proportion={self.proportion})"
