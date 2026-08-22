from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class CompanyAnalysis(Base):
    __tablename__ = "company_analyses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    lead_id: Mapped[int] = mapped_column(
        ForeignKey("leads.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    company_overview: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    business_needs: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    pain_points: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    opportunities: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    recommended_approach: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
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

    lead = relationship("Lead")