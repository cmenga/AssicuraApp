import typer
from alembic.config import Config
from alembic import command
from os import path
from os import makedirs

ALEMBIC_CFG_PATH = "alembic.ini"

app = typer.Typer()


@app.command()
def migrate():
    alembic_cfg = Config(ALEMBIC_CFG_PATH)
    command.upgrade(alembic_cfg, "head")


@app.command()
def downgrade(rev: str):
    alembic_cfg = Config(ALEMBIC_CFG_PATH)
    command.downgrade(alembic_cfg, rev)


@app.command()
def history():
    alembic_cfg = Config(ALEMBIC_CFG_PATH)
    command.history(alembic_cfg)


@app.command()
def current():
    alembic_cfg = Config(ALEMBIC_CFG_PATH)
    command.current(alembic_cfg)


@app.command()
def migration(message: str):
    if not message:
        raise ValueError("Devi fornire un messaggio per la migration")

    alembic_cfg = Config(ALEMBIC_CFG_PATH)

    script_location = alembic_cfg.get_main_option("script_location")
    if script_location is None:
        return
    versions_dir = path.join(script_location, "versions")
    makedirs(versions_dir, exist_ok=True)

    command.revision(alembic_cfg, message=message, autogenerate=True)


if __name__ == "__main__":
    app()
