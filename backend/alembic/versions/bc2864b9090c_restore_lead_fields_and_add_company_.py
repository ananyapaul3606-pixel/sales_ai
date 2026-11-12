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
    # No-op: status, score, score_label, created_at, updated_at, owner_id, notes
    # were added by b7a2b8526add_add_lead_ai_fields, and company_size, funding,
    # technology_stack were added by 80b5fc53adc3_add_lead_company_intelligence_fields.
    pass


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