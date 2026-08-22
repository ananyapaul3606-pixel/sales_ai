"""add lead ai fields

Revision ID: b7a2b8526add
Revises: 66830283ca6b
Create Date: 2026-08-14 01:53:50.050062

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7a2b8526add'
down_revision: Union[str, Sequence[str], None] = '66830283ca6b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "leads",
        sa.Column("notes", sa.Text(), nullable=True)
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
            server_default=sa.func.now()
        )
    )

    op.add_column(
        "leads",
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now()
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

    # Existing leads need an owner.
    # Use your existing user's ID here.
    op.execute(
        "UPDATE leads SET owner_id = 2 WHERE owner_id IS NULL"
    )

    op.alter_column(
        "leads",
        "owner_id",
        nullable=False
    )

    op.create_foreign_key(
        "fk_leads_owner_id_users",
        "leads",
        "users",
        ["owner_id"],
        ["id"]
    )

    op.drop_column("leads", "industry")