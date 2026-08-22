from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, String, Text, Float, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class LeadScore(Base):
    __tablename__ = "lead_scores"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    lead_id: Mapped[int] = mapped_column(
        ForeignKey("leads.id", ondelete="CASCADE"),
        nullable=False
    )

    score: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    conversion_probability: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True
    )

    tier: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    reasoning: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    lead = relationship("Lead")