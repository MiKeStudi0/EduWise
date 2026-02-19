from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.roadmap import Roadmap
from app.models.seo_metadata import SeoMetadata


SEO_FIELDS = (
    "meta_title",
    "meta_description",
    "keywords",
    "canonical_url",
    "robots",
    "og_title",
    "og_description",
    "og_type",
    "og_url",
    "og_site_name",
    "og_image_url",
    "og_image_width",
    "og_image_height",
    "og_image_alt",
    "twitter_card",
    "twitter_title",
    "twitter_description",
    "twitter_image",
)


def load_roadmap_items(json_path: Path) -> list[dict[str, Any]]:
    with json_path.open("r", encoding="utf-8") as file:
        payload = json.load(file)

    if isinstance(payload, dict) and isinstance(payload.get("roadmap"), list):
        return payload["roadmap"]

    if isinstance(payload, list):
        return payload

    raise ValueError(
        "Invalid roadmap JSON format. Expected {'roadmap': [...]} or [...]."
    )


def apply_seo_data(seo_obj: SeoMetadata, seo_payload: dict[str, Any]) -> None:
    for field in SEO_FIELDS:
        if field in seo_payload:
            setattr(seo_obj, field, seo_payload[field])


def seed_roadmaps_from_json(db: Session, json_path: Path) -> tuple[int, int]:
    roadmap_items = load_roadmap_items(json_path)
    created_count = 0
    updated_count = 0

    for item in roadmap_items:
        slug = item.get("slug")
        title = item.get("title")

        if not slug or not title:
            print(f"Skipping roadmap with missing slug/title: {item}")
            continue

        roadmap = db.query(Roadmap).filter(Roadmap.slug == slug).first()

        if roadmap is None:
            roadmap = Roadmap(slug=slug, title=title)
            db.add(roadmap)
            created_count += 1
        else:
            updated_count += 1

        roadmap.slug_icon = item.get("slug_icon")
        roadmap.title = title
        roadmap.description = item.get("description")
        roadmap.order_index = int(item.get("order_index", item.get("order", 0)) or 0)
        roadmap.is_active = bool(item.get("is_active", True))

        seo_payload = item.get("seo")
        if isinstance(seo_payload, dict):
            if roadmap.seo is None:
                roadmap.seo = SeoMetadata()
            apply_seo_data(roadmap.seo, seo_payload)

    return created_count, updated_count


def run() -> None:
    json_path = Path(__file__).resolve().parents[1] / "json" / "roadmap.json"
    db = SessionLocal()

    try:
        created, updated = seed_roadmaps_from_json(db, json_path)
        db.commit()
        print(
            f"Roadmap seed completed. Created: {created}, Updated: {updated}, Source: {json_path}"
        )
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()
