"""
seed_technologies.py

Seeds the `seo_metadata` and `technologies` tables from frontend.json.

Usage:
    python seed_technologies.py
    python seed_technologies.py --json path/to/custom.json
    python seed_technologies.py --dry-run
    python seed_technologies.py --clear

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
DEFAULT_JSON = Path(__file__).resolve().parent.parent / "json" / "frontend.json"


# ── Helpers ───────────────────────────────────────────────────────────────────

def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


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


def insert_technology(session: Session, tech: dict, seo_id: int | None) -> int:
    """Insert a Technology row and return its new id."""
    result = session.execute(
        text("""
            INSERT INTO technologies (
                roadmap_id, slug, slug_icon, title, description,
                is_active, order_index, seo_id,
                created_at, updated_at
            ) VALUES (
                :roadmap_id, :slug, :slug_icon, :title, :description,
                :is_active, :order_index, :seo_id,
                NOW(), NOW()
            )
            RETURNING id
        """),
        {
            "roadmap_id": tech["roadmap_id"],
            "slug":       tech["slug"],
            "slug_icon":  tech.get("slug_icon"),
            "title":      tech["title"],
            "description": tech.get("description"),
            "is_active":  tech.get("is_active", True),
            "order_index": tech.get("order", 0),
            "seo_id":     seo_id,
        },
    )
    return result.fetchone()[0]


def slug_exists(session: Session, slug: str) -> bool:
    row = session.execute(
        text("SELECT 1 FROM technologies WHERE slug = :slug"), {"slug": slug}
    ).fetchone()
    return row is not None


def clear_tables(session: Session) -> None:
    print("🗑️  Clearing technologies and related seo_metadata rows …")
    session.execute(text("""
        DELETE FROM seo_metadata
        WHERE id IN (SELECT seo_id FROM technologies WHERE seo_id IS NOT NULL)
    """))
    session.execute(text("DELETE FROM technologies"))
    print("   Done.\n")


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Seed technologies into the database.")
    parser.add_argument("--json",    default=str(DEFAULT_JSON), help="Path to technologies JSON file")
    parser.add_argument("--dry-run", action="store_true",       help="Parse and validate without writing to DB")
    parser.add_argument("--clear",   action="store_true",       help="Delete all technologies before seeding")
    args = parser.parse_args()

    json_path = Path(args.json)
    if not json_path.exists():
        sys.exit(f"❌  JSON file not found: {json_path}")

    data = load_json(json_path)
    technologies: list[dict] = data.get("technologies", [])

    if not technologies:
        sys.exit("❌  No technologies found in the JSON file.")

    print(f"📋  Found {len(technologies)} technologies in {json_path.name}\n")

    if args.dry_run:
        print("🔍  Dry-run mode — no database writes.\n")
        for i, tech in enumerate(technologies, 1):
            seo = tech.get("seo", {})
            print(f"  [{i:02d}] {tech['title']} (slug: {tech['slug']})")
            print(f"        SEO title : {seo.get('meta_title', '—')}")
            print(f"        Keywords  : {', '.join(seo.get('keywords', []))}")
        print("\n✅  Dry-run complete.")
        return

    engine = create_engine(DATABASE_URL, echo=False)

    inserted = 0
    skipped  = 0

    with Session(engine) as session:
        if args.clear:
            clear_tables(session)
            session.commit()

        for tech in technologies:
            slug = tech["slug"]

            if slug_exists(session, slug):
                print(f"  ⏭️  Skipping  '{tech['title']}' — slug '{slug}' already exists.")
                skipped += 1
                continue

            # 1. Insert SEO metadata first
            seo    = tech.get("seo")
            seo_id = insert_seo(session, seo) if seo else None

            # 2. Insert technology with the new seo_id
            tech_id = insert_technology(session, tech, seo_id)

            print(f"  ✅  Inserted  '{tech['title']}' → id={tech_id}, seo_id={seo_id}")
            inserted += 1

        session.commit()

    print(f"\n🎉  Done! Inserted: {inserted}  |  Skipped: {skipped}")


if __name__ == "__main__":
    main()