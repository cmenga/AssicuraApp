import typer
from app.scripts.alembic_manager import main as alembic_main


app = typer.Typer()


@app.command()
def migrate():
    alembic_main(["migrate"])


@app.command()
def downgrade(rev: str):
    alembic_main(["downgrade", rev])


@app.command()
def history():
    alembic_main(["history"])


@app.command()
def current():
    alembic_main(["current"])


@app.command()
def reset():
    alembic_main(["reset"])


@app.command()
def migration(message: str):
    alembic_main(["migration", message])


if __name__ == "__main__":
    app()
