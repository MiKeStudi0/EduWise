"""
Seed script: Insert seo_metadata and modules from modules_with_seo.json

Usage:
    python seed_modules.py
    python seed_modules.py --json path/to/modules_with_seo.json
    python seed_modules.py --truncate   # clears existing rows before inserting

Requirements:
    pip install sqlalchemy

Make sure DATABASE_URL is set in your environment or edit the DEFAULT_DB_URL below.
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────
DEFAULT_DB_URL = os.getenv("DATABASE_URL")
if not DEFAULT_DB_URL:
    sys.exit("❌  DATABASE_URL not set. Add it to your .env file.")
DEFAULT_JSON   = str(Path(__file__).parent.parent / "json" / "frontend" / "html" / "modules.json")
# ─────────────────────────────────────────────────────────────────────────────


def now_utc():
    return datetime.now(timezone.utc)


def load_json(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def truncate_tables(session: Session):
    """Delete all rows (preserves structure). Order matters for FK constraints."""
    print("  Truncating modules …")
    session.execute(text("DELETE FROM modules"))
    print("  Truncating seo_metadata …")
    session.execute(text("DELETE FROM seo_metadata"))
    session.commit()
    print("  Done.\n")


def insert_seo_metadata(session: Session, records: list[dict]) -> dict[int, int]:
    """
    Insert seo_metadata rows.
    Returns a mapping of json_id → db_id so modules can reference them.
    """
    id_map: dict[int, int] = {}

    for rec in records:
        json_id = rec["id"]  # keep for mapping; not inserted if using SERIAL pk

        params = {
            "meta_title":        rec.get("meta_title"),
            "meta_description":  rec.get("meta_description"),
            "keywords":          json.dumps(rec.get("keywords")) if rec.get("keywords") else None,
            "canonical_url":     rec.get("canonical_url"),
            "robots":            rec.get("robots"),
            "og_title":          rec.get("og_title"),
            "og_description":    rec.get("og_description"),
            "og_type":           rec.get("og_type"),
            "og_url":            rec.get("og_url"),
            "og_site_name":      rec.get("og_site_name"),
            "og_image_url":      rec.get("og_image_url"),
            "og_image_width":    rec.get("og_image_width"),
            "og_image_height":   rec.get("og_image_height"),
            "og_image_alt":      rec.get("og_image_alt"),
            "twitter_card":      rec.get("twitter_card"),
            "twitter_title":     rec.get("twitter_title"),
            "twitter_description": rec.get("twitter_description"),
            "twitter_image":     rec.get("twitter_image"),
            "created_at":        now_utc(),
            "updated_at":        now_utc(),
        }

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
                    :meta_title, :meta_description, CAST(:keywords AS jsonb),
                    :canonical_url, :robots,
                    :og_title, :og_description, :og_type, :og_url, :og_site_name,
                    :og_image_url, :og_image_width, :og_image_height, :og_image_alt,
                    :twitter_card, :twitter_title, :twitter_description, :twitter_image,
                    :created_at, :updated_at
                )
                RETURNING id
            """),
            params,
        )
        db_id = result.scalar_one()
        id_map[json_id] = db_id
        print(f"  [seo_metadata] json_id={json_id} → db_id={db_id}  ({rec.get('meta_title', '')[:60]})")

    session.commit()
    return id_map


def insert_modules(session: Session, records: list[dict], seo_id_map: dict[int, int]):
    for rec in records:
        json_seo_id = rec.get("seo_id")
        resolved_seo_id = seo_id_map.get(json_seo_id) if json_seo_id else None

        params = {
            "roadmap_id":    rec["roadmap_id"],
            "technology_id": rec["technology_id"],
            "slug":          rec["slug"],
            "title":         rec["title"],
            "description":   rec.get("description"),
            "seo_id":        resolved_seo_id,
            "is_active":     rec.get("is_active", True),
            "order_index":   rec.get("order_index"),
            "created_at":    now_utc(),
            "updated_at":    now_utc(),
        }

        result = session.execute(
            text("""
                INSERT INTO modules (
                    roadmap_id, technology_id, slug, title, description,
                    seo_id, is_active, order_index, created_at, updated_at
                ) VALUES (
                    :roadmap_id, :technology_id, :slug, :title, :description,
                    :seo_id, :is_active, :order_index, :created_at, :updated_at
                )
                RETURNING id
            """),
            params,
        )
        db_id = result.scalar_one()
        print(f"  [module]       id={db_id}  seo_id={resolved_seo_id}  slug={rec['slug']}")

    session.commit()


def main():
    parser = argparse.ArgumentParser(description="Seed seo_metadata and modules tables.")
    parser.add_argument("--json",     default=DEFAULT_JSON, help="Path to JSON file")
    parser.add_argument("--db",       default=DEFAULT_DB_URL, help="SQLAlchemy database URL")
    parser.add_argument("--truncate", action="store_true", help="Delete existing rows before inserting")
    args = parser.parse_args()

    print(f"Loading JSON from: {args.json}")
    data = load_json(args.json)

    seo_records    = data.get("seo_metadata", [])
    module_records = data.get("modules", [])

    print(f"Found {len(seo_records)} seo_metadata records and {len(module_records)} module records.\n")

    engine = create_engine(args.db, echo=False)

    with Session(engine) as session:
        if args.truncate:
            print("── Truncating tables ──────────────────────────────────")
            truncate_tables(session)

        print("── Inserting seo_metadata ─────────────────────────────")
        seo_id_map = insert_seo_metadata(session, seo_records)

        print("\n── Inserting modules ──────────────────────────────────")
        insert_modules(session, module_records, seo_id_map)

    print("\n✅  All records inserted successfully.")


if __name__ == "__main__":
    main()