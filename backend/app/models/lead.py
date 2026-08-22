from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    email: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        index=True
    )

    company: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )

    job_title: Mapped[Optional[str]] = mapped_column(
        String(150),
        nullable=True
    )

    industry: Mapped[Optional[str]] = mapped_column(
        String(150),
        nullable=True
    )

    notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="NEW",
        nullable=False
    )

    score: Mapped[int] = mapped_column(
        default=0,
        nullable=False
    )

    score_label: Mapped[str] = mapped_column(
        String(20),
        default="COLD",
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=True
    )

    company_size: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )

    funding: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )

    technology_stack: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    owner = relationship("User")