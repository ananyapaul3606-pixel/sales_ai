from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class FollowUp(Base):
    __tablename__ = "follow_ups"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    lead_id: Mapped[int] = mapped_column(
        ForeignKey("leads.id", ondelete="CASCADE"),
        nullable=False
    )

    recommended_action: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    reason: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    scheduled_for: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="PENDING"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    lead = relationship("Lead")