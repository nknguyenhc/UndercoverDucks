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
    port1_similarities: Mapped[List["Similarity"]] = relationship(
        back_populates="port1",
        cascade="all, delete-orphan",
        foreign_keys="Similarity.port1_id",
    )
    port2_similarities: Mapped[List["Similarity"]] = relationship(
        back_populates="port2",
        cascade="all, delete-orphan",
        foreign_keys="Similarity.port2_id",
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

class Similarity(Base):
    __tablename__ = "similarity"

    id: Mapped[int] = mapped_column(primary_key=True)
    port1_id: Mapped[int] = mapped_column(ForeignKey("port.id"))
    port1: Mapped["Port"] = relationship(
        "Port",
        back_populates="port1_similarities",
        foreign_keys=[port1_id],
    )
    port2_id: Mapped[int] = mapped_column(ForeignKey("port.id"))
    port2: Mapped["Port"] = relationship(
        "Port",
        back_populates="port2_similarities",
        foreign_keys=[port2_id],
    )
    value: Mapped[float]

    def __repr__(self) -> str:
        return f"Similarity(id={self.id!r}, port1={self.port_from.name}, port2={self.port_to.name}, value={self.proportion})"

