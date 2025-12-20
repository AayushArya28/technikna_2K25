from __future__ import annotations

import argparse
from pathlib import Path

from pypdf import PdfReader


def extract_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    parts: list[str] = []
    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        parts.append(f"\n\n--- PAGE {i} ---\n{text}")
    return "\n".join(parts)


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract text from a PDF")
    parser.add_argument("pdf", type=Path)
    parser.add_argument("out", type=Path)
    args = parser.parse_args()

    if not args.pdf.exists():
        raise SystemExit(f"PDF not found: {args.pdf}")

    text = extract_text(args.pdf)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(text, encoding="utf-8")
    print(f"Wrote {len(text)} chars to {args.out}")


if __name__ == "__main__":
    main()
