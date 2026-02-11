import argparse
from alembic.config import Config
from alembic import command
from alembic.script import ScriptDirectory
import os

ALEMBIC_CFG_PATH = "alembic.ini"


def main(argv=None):
    args, parser = get_cli(argv)
    try:
        if args.command == "migrate":
            migrate()
        elif args.command == "downgrade":
            downgrade(args.rev)
        elif args.command == "current":
            current()
        elif args.command == "history":
            history()
        elif args.command == "reset":
            reset()
        elif args.command == "migration":
            create_migration(args.message)
        else:
            parser.print_help()
    except Exception as e:
        print(f"[ERROR] {e}")
        exit(1)


def migrate():
    """
    Upgrade the database schema to the latest version using Alembic.
    This function loads the Alembic configuration from the specified path and upgrades the database to the latest version.
    No parameters are needed.
    No return value.
    """
    alembic_cfg = Config(ALEMBIC_CFG_PATH)
    command.upgrade(alembic_cfg, "head")


def downgrade(rev: str):
    """
    Downgrade the database schema revision to the specified revision.
    @param rev - The revision to downgrade to.
    """
    alembic_cfg = Config(ALEMBIC_CFG_PATH)
    command.downgrade(alembic_cfg, rev)


def current():
    """
    Load the Alembic configuration from the specified path and run the current command to bring the database up to date with the current revision.
    This function does not return any value.
    """
    alembic_cfg = Config(ALEMBIC_CFG_PATH)
    command.current(alembic_cfg)


def history():
    """
    Display the history of migrations using Alembic.
    This function loads the Alembic configuration from the specified path and then
    prints the migration history.
    No parameters are needed.
    No return value.
    """
    alembic_cfg = Config(ALEMBIC_CFG_PATH)
    command.history(alembic_cfg)


def reset():
    """
    Reset the database to the base revision using Alembic.
    @return None
    """
    alembic_cfg = Config(ALEMBIC_CFG_PATH)
    script = ScriptDirectory.from_config(alembic_cfg)

    revisions = list(script.walk_revisions(base="base", head="head"))
    revisions.reverse()

    if not revisions:
        print("There are no revisions to reset")
        return

    command.downgrade(alembic_cfg, "base")


def create_migration(message: str):
    """
    Create a migration script for the database using Alembic.
    @param message - A message describing the migration
    @raises ValueError if message is empty
    @return None
    """
    if not message:
        raise ValueError("Devi fornire un messaggio per la migration")

    alembic_cfg = Config(ALEMBIC_CFG_PATH)

    script_location = alembic_cfg.get_main_option("script_location")
    if script_location is None:
        return
    versions_dir = os.path.join(script_location, "versions")
    os.makedirs(versions_dir, exist_ok=True)

    command.revision(alembic_cfg, message=message, autogenerate=True)



def get_cli(argv=None):
    """
    Create a command-line interface (CLI) for managing Alembic migrations of the database.
    @param argv - Optional command-line arguments
    @return args - Parsed command-line arguments
    @return parser - Argument parser for the CLI
    """
    parser = argparse.ArgumentParser(
        description="Alembic manager - gestisci migrazioni del DB"
    )
    subparsers = parser.add_subparsers(
        dest="command", required=True, help="Comandi disponibili"
    )

    migrate_parser = subparsers.add_parser(
        "migrate", help="Applica tutte le migrazioni fino all'ultima"
    )
    downgrade_parser = subparsers.add_parser(
        "downgrade", help="Torna indietro a una revisione specifica"
    )
    downgrade_parser.add_argument(
        "rev", type=str, help="ID della revisione a cui tornare"
    )
    current_parser = subparsers.add_parser(
        "current", help="Mostra la revisione corrente del DB"
    )
    history_parser = subparsers.add_parser(
        "history", help="Mostra la cronologia delle revisioni"
    )
    reset_parser = subparsers.add_parser(
        "reset", help="Reset completo del DB (drop + migrate)"
    )
    create_parser = subparsers.add_parser(
        "migration", help="Crea una nuova migration Alembic"
    )
    create_parser.add_argument(
        "message",
        type=str,
        help="Nome descrittivo della migration (es: add_user_table)",
    )

    args = parser.parse_args(argv)
    return args, parser


if __name__ == "__main__":
    main()
