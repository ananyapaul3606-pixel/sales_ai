"""add lead company intelligence fields

Revision ID: 80b5fc53adc3
Revises: b7a2b8526add
Create Date: 2026-08-15 15:36:10.192131

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "80b5fc53adc3"
down_revision: Union[str, Sequence[str], None] = "b7a2b8526add"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "leads",
        sa.Column(
            "industry",
            sa.String(length=150),
            nullable=True
        )
    )

    op.add_column(
        "leads",
        sa.Column(
            "company_size",
            sa.String(length=100),
            nullable=True
        )
    )

    op.add_column(
        "leads",
        sa.Column(
            "funding",
            sa.String(length=100),
            nullable=True
        )
    )

    op.add_column(
        "leads",
        sa.Column(
            "technology_stack",
            sa.Text(),
            nullable=True
        )
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("leads", "technology_stack")
    op.drop_column("leads", "funding")
    op.drop_column("leads", "company_size")
    op.drop_column("leads", "industry")