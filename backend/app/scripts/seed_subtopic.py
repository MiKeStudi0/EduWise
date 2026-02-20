"""
seed_subtopics.py

Seeds the `seo_metadata` and `sub_topics` tables from subtopics.json.

Seeding order (respect FK chain):
    roadmaps → technologies → modules → topics → sub_topics

Usage:
    python seed_subtopics.py
    python seed_subtopics.py --json path/to/subtopics.json
    python seed_subtopics.py --dry-run
    python seed_subtopics.py --clear

Requirements:
    pip install sqlalchemy psycopg2-binary python-dotenv

Environment (.env or shell):
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

# ── Env ───────────────────────────────────────────────────────────────────────
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    sys.exit("❌  DATABASE_URL not set. Add it to your .env file.")

DEFAULT_JSON = Path(__file__).parent.parent / "json" / "sub_topic.json"

# JSON columns that need serialisation before INSERT
JSON_COLUMNS = [
    "examples", "images",
    "when_to_use", "when_to_avoid",
    "problems", "mental_models",
    "common_mistakes", "bonus_tips", "related_topics",
]


# ── Helpers ───────────────────────────────────────────────────────────────────

def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def row_exists(session: Session, table: str, column: str, value) -> bool:
    row = session.execute(
        text(f"SELECT 1 FROM {table} WHERE {column} = :{column}"),
        {column: value},
    ).fetchone()
    return row is not None


def insert_seo(session: Session, seo: dict) -> int:
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
            "keywords":            json.dumps(seo["keywords"]) if seo.get("keywords") else None,
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


def insert_subtopic(session: Session, st: dict, seo_id: int | None) -> int:
    json_values = {
        col: json.dumps(st[col]) if st.get(col) is not None else None
        for col in JSON_COLUMNS
    }

    result = session.execute(
        text("""
            INSERT INTO sub_topics (
                roadmap_id, technology_id, module_id, topic_id,
                slug, title, description,
                is_active, order_index, seo_id,
                examples, image_banner_url, images, video_url,
                when_to_use, when_to_avoid, problems,
                mental_models, common_mistakes, bonus_tips, related_topics,
                created_at, updated_at
            ) VALUES (
                :roadmap_id, :technology_id, :module_id, :topic_id,
                :slug, :title, :description,
                :is_active, :order_index, :seo_id,
                :examples, :image_banner_url, :images, :video_url,
                :when_to_use, :when_to_avoid, :problems,
                :mental_models, :common_mistakes, :bonus_tips, :related_topics,
                NOW(), NOW()
            )
            RETURNING id
        """),
        {
            "roadmap_id":       st["roadmap_id"],
            "technology_id":    st["technology_id"],
            "module_id":        st["module_id"],
            "topic_id":         st["topic_id"],
            "slug":             st["slug"],
            "title":            st["title"],
            "description":      st.get("description"),
            "is_active":        st.get("is_active", True),
            "order_index":      st.get("order", 0),
            "seo_id":           seo_id,
            "image_banner_url": st.get("image_banner_url"),
            "video_url":        st.get("video_url"),
            **json_values,
        },
    )
    return result.fetchone()[0]


def clear_tables(session: Session) -> None:
    print("🗑️  Clearing sub_topics and related seo_metadata rows …")
    session.execute(text("""
        DELETE FROM seo_metadata
        WHERE id IN (SELECT seo_id FROM sub_topics WHERE seo_id IS NOT NULL)
    """))
    session.execute(text("DELETE FROM sub_topics"))
    print("   Done.\n")


def validate_fk(session: Session, subtopics: list[dict]) -> None:
    print("🔎  Validating foreign keys …")
    missing = {}

    for fk_table, fk_field in [
        ("roadmaps",    "roadmap_id"),
        ("technologies","technology_id"),
        ("modules",     "module_id"),
        ("topics",      "topic_id"),
    ]:
        ids = {st[fk_field] for st in subtopics}
        bad = [i for i in ids if not row_exists(session, fk_table, "id", i)]
        if bad:
            missing[fk_table] = sorted(bad)

    if missing:
        for table, ids in missing.items():
            print(f"   ❌  Missing in '{table}': {ids}")
        sys.exit(
            "\n❌  FK validation failed. "
            "Seed order: roadmaps → technologies → modules → topics → sub_topics"
        )

    print("   ✅  All foreign keys valid.\n")


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Seed sub_topics into the database.")
    parser.add_argument("--json",    default=str(DEFAULT_JSON), help="Path to subtopics.json")
    parser.add_argument("--dry-run", action="store_true",       help="Preview without DB writes")
    parser.add_argument("--clear",   action="store_true",       help="Delete all sub_topics before seeding")
    args = parser.parse_args()

    json_path = Path(args.json)
    if not json_path.exists():
        sys.exit(f"❌  File not found: {json_path}")

    data      = load_json(json_path)
    subtopics = data.get("subtopics", [])
    if not subtopics:
        sys.exit("❌  No subtopics found in the JSON file.")

    print(f"📋  Found {len(subtopics)} subtopics in {json_path.name}\n")

    # ── Dry run ──────────────────────────────────────────────────────────────
    if args.dry_run:
        print("🔍  Dry-run mode — no database writes.\n")
        for i, st in enumerate(subtopics, 1):
            seo = st.get("seo") or {}
            print(
                f"  [{i:03d}] topic_id={st['topic_id']} | "
                f"mod={st['module_id']:02d} | "
                f"order={st.get('order', 0):02d} | "
                f"slug={st['slug']}"
            )
            print(f"         title    : {st['title']}")
            print(f"         seo_title: {seo.get('meta_title', '— (no seo)')}")
        print(f"\n✅  Dry-run complete. {len(subtopics)} subtopics validated.")
        return

    # ── Seed ─────────────────────────────────────────────────────────────────
    engine   = create_engine(DATABASE_URL, echo=False)
    inserted = 0
    skipped  = 0
    errors   = 0

    with Session(engine) as session:
        if args.clear:
            clear_tables(session)
            session.commit()

        validate_fk(session, subtopics)

        for st in subtopics:
            slug = st["slug"]

            if row_exists(session, "sub_topics", "slug", slug):
                print(f"  ⏭️  Skip  '{st['title']}' — slug already exists.")
                skipped += 1
                continue

            try:
                seo    = st.get("seo")
                seo_id = insert_seo(session, seo) if seo else None
                stid   = insert_subtopic(session, st, seo_id)

                print(
                    f"  ✅  [{stid:04d}] "
                    f"topic={st['topic_id']} "
                    f"ord={st.get('order', 0):02d}  "
                    f"'{st['title']}'  "
                    f"seo_id={seo_id}"
                )
                inserted += 1

            except Exception as exc:
                print(f"  ❌  Error on '{st['title']}': {exc}")
                session.rollback()
                errors += 1
                continue

        session.commit()

    print(f"\n🎉  Done!  Inserted: {inserted}  |  Skipped: {skipped}  |  Errors: {errors}")


if __name__ == "__main__":
    main()