from sqlalchemy import inspect
from app.db.database import engine

inspector = inspect(engine)

columns = inspector.get_columns("leads")

print("\nLEADS TABLE COLUMNS:\n")

for column in columns:
    print(
        f"{column['name']} | "
        f"{column['type']} | "
        f"nullable={column['nullable']}"
    )