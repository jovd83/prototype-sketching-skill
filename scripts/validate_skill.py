#!/usr/bin/env python3
"""Repository-local validation for prototype-sketching-skill.

Checks that the published skill is structurally sound: required files exist, the
SKILL.md frontmatter is well-formed, the skin assets are present, and the README
badges / CHANGELOG stay in sync with the current version. Run in CI and locally:

    python scripts/validate_skill.py .

Exits 0 when everything passes, 1 (printing FAIL lines) otherwise.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

SKILL_NAME = "prototype-sketching-skill"
VERSION = "1.1.1"

REQUIRED_FILES = [
    "SKILL.md",
    "README.md",
    "CHANGELOG.md",
    "LICENSE",
    "assets/sketch-skin.css",
    "assets/sketch-filters.html",
    "assets/sketch-toggle.js",
    "assets/fonts/README.md",
    "references/styles.md",
    "references/implementation.md",
]


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_frontmatter(content: str) -> tuple[dict[str, str], str | None]:
    if not content.startswith("---\n"):
        return {}, "SKILL.md must start with YAML frontmatter (---)"
    try:
        _, frontmatter, _ = content.split("---\n", 2)
    except ValueError:
        return {}, "SKILL.md frontmatter must be closed with ---"
    values: dict[str, str] = {}
    for line in frontmatter.splitlines():
        if not line.strip() or line[0] in " \t":
            continue
        m = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if m:
            values[m.group(1)] = m.group(2).strip().strip('"')
    return values, None


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    errors: list[str] = []

    # 1. Required files
    for rel in REQUIRED_FILES:
        if not (root / rel).exists():
            errors.append(f"FAIL: missing required file: {rel}")

    # 2. SKILL.md frontmatter
    skill_md_path = root / "SKILL.md"
    if skill_md_path.exists():
        fm, err = parse_frontmatter(read(skill_md_path))
        if err:
            errors.append(f"FAIL: {err}")
        else:
            name = fm.get("name", "")
            description = fm.get("description", "")
            if name != SKILL_NAME:
                errors.append(f"FAIL: SKILL.md frontmatter name must be {SKILL_NAME!r} (got {name!r})")
            if not re.fullmatch(r"[a-z0-9-]{1,64}", name):
                errors.append("FAIL: SKILL.md frontmatter name must be lowercase hyphen-case")
            if not description:
                errors.append("FAIL: SKILL.md frontmatter description is required")
            if len(description) > 1024:
                errors.append("FAIL: SKILL.md frontmatter description must be <= 1024 characters")

    # 3. README badges + version in sync
    readme_path = root / "README.md"
    if readme_path.exists():
        readme = read(readme_path)
        for needle, label in [
            (f"version-{VERSION}-", "version badge matching the current version"),
            ("Buy%20Me%20a%20Coffee", "Buy Me a Coffee badge"),
            ("actions/workflows/validate.yml/badge.svg", "live GitHub Actions validation badge"),
            ("badge/license-MIT", "license badge"),
        ]:
            if needle not in readme:
                errors.append(f"FAIL: README.md is missing the {label}")

    # 4. CHANGELOG has an entry for the current version
    changelog_path = root / "CHANGELOG.md"
    if changelog_path.exists():
        if f"[{VERSION}]" not in read(changelog_path):
            errors.append(f"FAIL: CHANGELOG.md must include a [{VERSION}] release entry")

    # 5. The skin must reference its wobble filters and the activation attribute
    skin_path = root / "assets/sketch-skin.css"
    if skin_path.exists():
        skin = read(skin_path)
        if "--sketch-wobble" not in skin or "[data-sketch]" not in skin:
            errors.append("FAIL: assets/sketch-skin.css missing the [data-sketch] ramp (--sketch-wobble)")

    if errors:
        print("\n".join(errors))
        print(f"\n{len(errors)} problem(s) found.")
        return 1
    print(f"OK: {SKILL_NAME} v{VERSION} validated ({len(REQUIRED_FILES)} required files present).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
