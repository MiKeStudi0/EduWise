"""
seed_modules.py

Seeds the `seo_metadata` and `modules` tables from modules.json.

Usage:
    python seed_modules.py
    python seed_modules.py --json path/to/custom.json
    python seed_modules.py --dry-run
    python seed_modules.py --clear

Requirements:
    pip install sqlalchemy psycopg2-binary python-dotenv

Environment variables (via .env or shell):
    DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/dbname
"""

import argparse
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

# ── Load env ──────────────────────────────────────────────────────────────────
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    sys.exit("❌  DATABASE_URL is not set. Add it to your .env file or environment.")

# ── Resolve JSON path ─────────────────────────────────────────────────────────
DEFAULT_JSON = Path(__file__).parent.parent / "json" / "html.json"


# ── Helpers ───────────────────────────────────────────────────────────────────

def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def roadmap_exists(session: Session, roadmap_id: int) -> bool:
    row = session.execute(
        text("SELECT 1 FROM roadmaps WHERE id = :id"), {"id": roadmap_id}
    ).fetchone()
    return row is not None


def technology_exists(session: Session, technology_id: int) -> bool:
    row = session.execute(
        text("SELECT 1 FROM technologies WHERE id = :id"), {"id": technology_id}
    ).fetchone()
    return row is not None


def slug_exists(session: Session, slug: str) -> bool:
    row = session.execute(
        text("SELECT 1 FROM modules WHERE slug = :slug"), {"slug": slug}
    ).fetchone()
    return row is not None


def insert_seo(session: Session, seo: dict) -> int:
    """Insert a SeoMetadata row and return its new id."""
    result = session.execute(
        text("""
            INSERT INTO seo_metadata (
                meta_title, meta_description, keywords,
                canonical_url, robots,
                og_title, og_description, og_type, og_url, og_site_name,
                og_image_url, og_image_width, og_image_height, og_image_alt,
                twitter_card, twitter_title, twitter_description, twitter_image,
                created_at, updated_at
            ) VALUES (
                :meta_title, :meta_description, :keywords,
                :canonical_url, :robots,
                :og_title, :og_description, :og_type, :og_url, :og_site_name,
                :og_image_url, :og_image_width, :og_image_height, :og_image_alt,
                :twitter_card, :twitter_title, :twitter_description, :twitter_image,
                NOW(), NOW()
            )
            RETURNING id
        """),
        {
            "meta_title":          seo.get("meta_title"),
            "meta_description":    seo.get("meta_description"),
            "keywords":            json.dumps(seo.get("keywords")) if seo.get("keywords") else None,
            "canonical_url":       seo.get("canonical_url"),
            "robots":              seo.get("robots"),
            "og_title":            seo.get("og_title"),
            "og_description":      seo.get("og_description"),
            "og_type":             seo.get("og_type"),
            "og_url":              seo.get("og_url"),
            "og_site_name":        seo.get("og_site_name"),
            "og_image_url":        seo.get("og_image_url"),
            "og_image_width":      seo.get("og_image_width"),
            "og_image_height":     seo.get("og_image_height"),
            "og_image_alt":        seo.get("og_image_alt"),
            "twitter_card":        seo.get("twitter_card"),
            "twitter_title":       seo.get("twitter_title"),
            "twitter_description": seo.get("twitter_description"),
            "twitter_image":       seo.get("twitter_image"),
        },
    )
    return result.fetchone()[0]


def insert_module(session: Session, module: dict, seo_id: int | None) -> int:
    """Insert a Module row and return its new id."""
    result = session.execute(
        text("""
            INSERT INTO modules (
                roadmap_id, technology_id,
                slug, title, description,
                is_active, order_index, seo_id,
                created_at, updated_at
            ) VALUES (
                :roadmap_id, :technology_id,
                :slug, :title, :description,
                :is_active, :order_index, :seo_id,
                NOW(), NOW()
            )
            RETURNING id
        """),
        {
            "roadmap_id":    module["roadmap_id"],
            "technology_id": module["technology_id"],
            "slug":          module["slug"],
            "title":         module["title"],
            "description":   module.get("description"),
            "is_active":     module.get("is_active", True),
            "order_index":   module.get("order", 0),
            "seo_id":        seo_id,
        },
    )
    return result.fetchone()[0]


def clear_tables(session: Session) -> None:
    print("🗑️  Clearing modules and related seo_metadata rows …")
    session.execute(text("""
        DELETE FROM seo_metadata
        WHERE id IN (SELECT seo_id FROM modules WHERE seo_id IS NOT NULL)
    """))
    session.execute(text("DELETE FROM modules"))
    print("   Done.\n")


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Seed modules into the database.")
    parser.add_argument("--json",    default=str(DEFAULT_JSON), help="Path to modules JSON file")
    parser.add_argument("--dry-run", action="store_true",       help="Parse and validate without writing to DB")
    parser.add_argument("--clear",   action="store_true",       help="Delete all modules before seeding")
    args = parser.parse_args()

    json_path = Path(args.json)
    if not json_path.exists():
        sys.exit(f"❌  JSON file not found: {json_path}")

    data = load_json(json_path)
    modules: list[dict] = data.get("modules", [])

    if not modules:
        sys.exit("❌  No modules found in the JSON file.")

    print(f"📋  Found {len(modules)} modules in {json_path.name}\n")

    if args.dry_run:
        print("🔍  Dry-run mode — no database writes.\n")
        for i, mod in enumerate(modules, 1):
            seo = mod.get("seo") or {}
            print(f"  [{i:02d}] {mod['title']}")
            print(f"        slug         : {mod['slug']}")
            print(f"        roadmap_id   : {mod['roadmap_id']}")
            print(f"        technology_id: {mod['technology_id']}")
            print(f"        order        : {mod.get('order', '—')}")
            print(f"        seo title    : {seo.get('meta_title', '— (no seo)')}")
        print(f"\n✅  Dry-run complete. {len(modules)} modules validated.")
        return

    engine = create_engine(DATABASE_URL, echo=False)

    inserted = 0
    skipped  = 0
    errors   = 0

    with Session(engine) as session:
        if args.clear:
            clear_tables(session)
            session.commit()

        # Pre-validate all foreign keys before inserting anything
        print("🔎  Validating foreign keys …")
        roadmap_ids    = {m["roadmap_id"] for m in modules}
        technology_ids = {m["technology_id"] for m in modules}

        missing_roadmaps = [rid for rid in roadmap_ids if not roadmap_exists(session, rid)]
        missing_techs    = [tid for tid in technology_ids if not technology_exists(session, tid)]

        if missing_roadmaps:
            sys.exit(f"❌  Missing roadmap IDs in DB: {missing_roadmaps}. Seed roadmaps first.")
        if missing_techs:
            sys.exit(f"❌  Missing technology IDs in DB: {missing_techs}. Seed technologies first.")

        print("   All foreign keys valid.\n")

        for mod in modules:
            slug = mod["slug"]

            if slug_exists(session, slug):
                print(f"  ⏭️  Skipping  '{mod['title']}' — slug '{slug}' already exists.")
                skipped += 1
                continue

            try:
                # 1. Insert SEO metadata first (if present)
                seo    = mod.get("seo")
                seo_id = insert_seo(session, seo) if seo else None

                # 2. Insert module with the new seo_id
                mod_id = insert_module(session, mod, seo_id)

                print(f"  ✅  Inserted  [{mod.get('order'):02d}] '{mod['title']}' → id={mod_id}, seo_id={seo_id}")
                inserted += 1

            except Exception as e:
                print(f"  ❌  Error on '{mod['title']}': {e}")
                session.rollback()
                errors += 1
                continue

        session.commit()

    print(f"\n🎉  Done!  Inserted: {inserted}  |  Skipped: {skipped}  |  Errors: {errors}")


if __name__ == "__main__":
    main()