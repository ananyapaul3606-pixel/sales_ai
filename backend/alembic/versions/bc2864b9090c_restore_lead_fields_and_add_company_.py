"""restore lead fields and add company intelligence

Revision ID: bc2864b9090c
Revises: 80b5fc53adc3
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "bc2864b9090c"
down_revision: Union[str, Sequence[str], None] = "80b5fc53adc3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    # Restore fields required by Lead model

    op.add_column(
        "leads",
        sa.Column(
            "notes",
            sa.Text(),
            nullable=True
        )
    )

    op.add_column(
        "leads",
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
            server_default="NEW"
        )
    )

    op.add_column(
        "leads",
        sa.Column(
            "score",
            sa.Integer(),
            nullable=False,
            server_default="0"
        )
    )

    op.add_column(
        "leads",
        sa.Column(
            "score_label",
            sa.String(length=20),
            nullable=False,
            server_default="COLD"
        )
    )

    op.add_column(
        "leads",
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP")
        )
    )

    op.add_column(
        "leads",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP")
        )
    )

    op.add_column(
        "leads",
        sa.Column(
            "owner_id",
            sa.Integer(),
            nullable=True
        )
    )

    # Company intelligence fields

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

    op.drop_column("leads", "technology_stack")
    op.drop_column("leads", "funding")
    op.drop_column("leads", "company_size")

    op.drop_column("leads", "owner_id")
    op.drop_column("leads", "updated_at")
    op.drop_column("leads", "created_at")
    op.drop_column("leads", "score_label")
    op.drop_column("leads", "score")
    op.drop_column("leads", "status")
    op.drop_column("leads", "notes")