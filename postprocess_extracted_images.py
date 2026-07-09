import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

REQUIRED_PACKAGES = ["opencv-python", "Pillow"]
for package in REQUIRED_PACKAGES:
    try:
        if package == "opencv-python":
            import cv2
        elif package == "Pillow":
            from PIL import Image, ImageOps
    except ImportError:
        print(f"Installing missing dependency: {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

import cv2
import numpy as np
from PIL import Image, ImageOps

DEFAULT_INPUT_DIR = Path(
    r"c:\YPF - El Puente\ypf-el-puente\public\assets\ypf imagenes\extraidas"
)
DEFAULT_OUTPUT_DIR = Path(
    r"c:\YPF - El Puente\ypf-el-puente\public\assets\ypf imagenes\productos_individuales"
)
DEFAULT_DUPLICATES_DIR = Path(
    r"c:\YPF - El Puente\ypf-el-puente\public\assets\ypf imagenes\_duplicadas"
)

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
COMBO_KEYWORDS = (
    "combo",
    "gaseosa",
    "bebida",
    "coca",
    "pepsi",
    "sprite",
    "fanta",
    "agua",
    "jugo",
    "latte",
    "+",
)


@dataclass(frozen=True)
class ImageRecord:
    path: Path
    sha256: str
    dhash: int
    quality: float


@dataclass(frozen=True)
class CropCandidate:
    bbox: tuple[int, int, int, int]
    area: int


def iter_images(folder: Path, include_complete: bool) -> Iterable[Path]:
    for path in sorted(folder.rglob("*")):
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS:
            if any(part.startswith("_") for part in path.relative_to(folder).parts[:-1]):
                continue
            if not include_complete and "_completo" in path.stem.lower():
                continue
            yield path


def file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def perceptual_dhash(path: Path, size: int = 16) -> int:
    with Image.open(path) as img:
        img = ImageOps.exif_transpose(img).convert("L").resize((size + 1, size), Image.Resampling.LANCZOS)
    pixels = np.asarray(img)
    diff = pixels[:, 1:] > pixels[:, :-1]
    value = 0
    for bit in diff.flatten():
        value = (value << 1) | int(bit)
    return value


def hamming_distance(a: int, b: int) -> int:
    return (a ^ b).bit_count()


def quality_score(path: Path) -> float:
    image = read_cv_image(path)
    if image is None:
        return 0.0
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    height, width = gray.shape
    megapixels = (width * height) / 1_000_000
    return sharpness + megapixels * 25


def read_cv_image(path: Path) -> np.ndarray | None:
    try:
        data = np.fromfile(str(path), dtype=np.uint8)
        if data.size == 0:
            return None
        return cv2.imdecode(data, cv2.IMREAD_COLOR)
    except Exception:
        return None


def build_records(paths: list[Path]) -> list[ImageRecord]:
    records: list[ImageRecord] = []
    for path in paths:
        try:
            records.append(
                ImageRecord(
                    path=path,
                    sha256=file_sha256(path),
                    dhash=perceptual_dhash(path),
                    quality=quality_score(path),
                )
            )
        except Exception as exc:
            print(f"Skipping unreadable image: {path} ({exc})")
    return records


def choose_best(records: list[ImageRecord]) -> ImageRecord:
    return max(records, key=lambda r: (r.quality, r.path.stat().st_size))


def group_duplicates(
    records: list[ImageRecord],
    hamming_threshold: int,
) -> tuple[list[ImageRecord], list[tuple[ImageRecord, ImageRecord, int]]]:
    exact_groups: dict[str, list[ImageRecord]] = {}
    for record in records:
        exact_groups.setdefault(record.sha256, []).append(record)

    exact_unique = [choose_best(group) for group in exact_groups.values()]
    exact_duplicates: list[tuple[ImageRecord, ImageRecord, int]] = []
    for group in exact_groups.values():
        keeper = choose_best(group)
        for item in group:
            if item.path != keeper.path:
                exact_duplicates.append((item, keeper, 0))

    keepers: list[ImageRecord] = []
    near_duplicates: list[tuple[ImageRecord, ImageRecord, int]] = []

    for record in sorted(exact_unique, key=lambda r: r.quality, reverse=True):
        matched_keeper: ImageRecord | None = None
        matched_distance = 0
        for keeper in keepers:
            distance = hamming_distance(record.dhash, keeper.dhash)
            if distance <= hamming_threshold:
                matched_keeper = keeper
                matched_distance = distance
                break
        if matched_keeper:
            near_duplicates.append((record, matched_keeper, matched_distance))
        else:
            keepers.append(record)

    return keepers, exact_duplicates + near_duplicates


def is_combo_or_drink(path: Path) -> bool:
    name = path.stem.lower()
    return any(keyword in name for keyword in COMBO_KEYWORDS)


def product_code_from_name(path: Path) -> str:
    first = path.stem.split("_", 1)[0]
    return first if first.isdigit() else "GENERIC"


def slugify(value: str, max_length: int = 80) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9áéíóúñü]+", "-", value, flags=re.IGNORECASE)
    value = value.strip("-")
    return value[:max_length].strip("-") or "image"


def clamp_bbox(
    bbox: tuple[int, int, int, int],
    width: int,
    height: int,
    pad_ratio: float = 0.08,
) -> tuple[int, int, int, int]:
    x, y, w, h = bbox
    pad = int(max(w, h) * pad_ratio)
    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(width, x + w + pad)
    y2 = min(height, y + h + pad)
    return x1, y1, x2 - x1, y2 - y1


def boxes_intersect_or_touch(
    a: tuple[int, int, int, int],
    b: tuple[int, int, int, int],
    margin: int,
) -> bool:
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    return not (
        ax + aw + margin < bx
        or bx + bw + margin < ax
        or ay + ah + margin < by
        or by + bh + margin < ay
    )


def merge_boxes(boxes: list[tuple[int, int, int, int]], margin: int) -> list[tuple[int, int, int, int]]:
    merged = boxes[:]
    changed = True
    while changed:
        changed = False
        result: list[tuple[int, int, int, int]] = []
        while merged:
            current = merged.pop(0)
            current_changed = True
            while current_changed:
                current_changed = False
                remaining: list[tuple[int, int, int, int]] = []
                for other in merged:
                    if boxes_intersect_or_touch(current, other, margin):
                        x1 = min(current[0], other[0])
                        y1 = min(current[1], other[1])
                        x2 = max(current[0] + current[2], other[0] + other[2])
                        y2 = max(current[1] + current[3], other[1] + other[3])
                        current = (x1, y1, x2 - x1, y2 - y1)
                        current_changed = True
                        changed = True
                    else:
                        remaining.append(other)
                merged = remaining
            result.append(current)
        merged = result
    return merged


def detect_product_candidates(image_path: Path) -> list[CropCandidate]:
    image = read_cv_image(image_path)
    if image is None:
        return []

    height, width = image.shape[:2]
    min_area = max(3_500, int(width * height * 0.012))
    max_area = int(width * height * 0.9)

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    border = np.concatenate(
        [
            image[: max(1, height // 20), :, :].reshape(-1, 3),
            image[-max(1, height // 20) :, :, :].reshape(-1, 3),
            image[:, : max(1, width // 20), :].reshape(-1, 3),
            image[:, -max(1, width // 20) :, :].reshape(-1, 3),
        ],
        axis=0,
    )
    bg_color = np.median(border, axis=0)
    color_distance = np.linalg.norm(image.astype(np.float32) - bg_color.astype(np.float32), axis=2)
    bg_mask = (color_distance > 34).astype(np.uint8) * 255

    saturation_mask = (hsv[:, :, 1] > 35).astype(np.uint8) * 255
    dark_mask = (gray < 242).astype(np.uint8) * 255
    edges = cv2.Canny(blurred, 45, 135)
    edges = cv2.dilate(edges, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=2)

    mask = cv2.bitwise_or(bg_mask, saturation_mask)
    mask = cv2.bitwise_or(mask, edges)
    mask = cv2.bitwise_or(mask, dark_mask)

    close_size = max(9, min(41, int(min(width, height) * 0.035)))
    if close_size % 2 == 0:
        close_size += 1
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (close_size, close_size))
    kernel_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_close, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel_open, iterations=1)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    boxes: list[tuple[int, int, int, int]] = []
    for contour in contours:
        area = int(cv2.contourArea(contour))
        if area < min_area or area > max_area:
            continue
        x, y, w, h = cv2.boundingRect(contour)
        if w < 55 or h < 55:
            continue
        aspect = w / max(h, 1)
        if aspect < 0.12 or aspect > 7.5:
            continue
        boxes.append(clamp_bbox((x, y, w, h), width, height))

    boxes = merge_boxes(boxes, margin=max(10, int(min(width, height) * 0.025)))
    candidates = [
        CropCandidate(bbox=b, area=b[2] * b[3])
        for b in boxes
        if b[2] * b[3] >= min_area and b[2] * b[3] <= max_area
    ]
    candidates.sort(key=lambda c: (c.bbox[1], c.bbox[0]))
    return candidates


def is_probably_product_image(image_path: Path) -> bool:
    image = read_cv_image(image_path)
    if image is None:
        return False

    height, width = image.shape[:2]
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    mean_gray = float(gray.mean())
    bright_ratio = float((gray > 150).mean())
    saturated_ratio = float((hsv[:, :, 1] > 45).mean())

    edges = cv2.Canny(gray, 50, 150)
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (max(25, width // 8), 1))
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, max(25, height // 8)))
    horizontal_lines = cv2.morphologyEx(edges, cv2.MORPH_OPEN, horizontal_kernel)
    vertical_lines = cv2.morphologyEx(edges, cv2.MORPH_OPEN, vertical_kernel)
    grid_ratio = float(((horizontal_lines > 0) | (vertical_lines > 0)).mean())

    mostly_dark_table = mean_gray < 70 and bright_ratio < 0.16 and grid_ratio > 0.002
    if mostly_dark_table:
        return False

    # Real product crops usually have a visible object: cup, food, packaging,
    # bread, beverage, etc. Menus/pricing boards are mostly dark, flat, and grid-like.
    return mean_gray > 75 or bright_ratio > 0.18 or saturated_ratio > 0.08


def union_bbox(candidates: list[CropCandidate]) -> tuple[int, int, int, int]:
    x1 = min(c.bbox[0] for c in candidates)
    y1 = min(c.bbox[1] for c in candidates)
    x2 = max(c.bbox[0] + c.bbox[2] for c in candidates)
    y2 = max(c.bbox[1] + c.bbox[3] for c in candidates)
    return x1, y1, x2 - x1, y2 - y1


def crop_to_square(
    source: Path,
    bbox: tuple[int, int, int, int],
    output: Path,
    size: int,
    background: tuple[int, int, int] = (248, 248, 246),
) -> None:
    with Image.open(source) as img:
        img = ImageOps.exif_transpose(img).convert("RGB")
        x, y, w, h = bbox
        crop = img.crop((x, y, x + w, y + h))
        crop.thumbnail((int(size * 0.9), int(size * 0.9)), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (size, size), background)
        left = (size - crop.width) // 2
        top = (size - crop.height) // 2
        canvas.paste(crop, (left, top))
        output.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(output, "JPEG", quality=92, optimize=True)


def move_duplicate(path: Path, input_dir: Path, duplicates_dir: Path, dry_run: bool, delete: bool) -> None:
    if dry_run:
        return
    if delete:
        path.unlink()
        return
    relative = path.relative_to(input_dir)
    target = duplicates_dir / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        target = target.with_name(f"{target.stem}_{file_sha256(path)[:8]}{target.suffix}")
    shutil.move(str(path), str(target))


def process_images(args: argparse.Namespace) -> dict:
    input_dir = Path(args.input).resolve()
    output_dir = Path(args.output).resolve()
    duplicates_dir = Path(args.duplicates_dir).resolve()

    if not input_dir.exists():
        raise FileNotFoundError(f"Input folder does not exist: {input_dir}")

    paths = list(iter_images(input_dir, include_complete=args.include_complete))
    if args.limit:
        paths = paths[: args.limit]

    records = build_records(paths)
    keepers, duplicates = group_duplicates(records, args.hash_threshold)

    duplicate_paths = {duplicate.path for duplicate, _, _ in duplicates}
    for duplicate, keeper, distance in duplicates:
        action = "delete" if args.delete_duplicates else "move"
        if not args.quiet:
            print(f"Duplicate ({distance:02d}) -> {action}: {duplicate.path.name} | keeper: {keeper.path.name}")
        if args.move_duplicates or args.delete_duplicates:
            move_duplicate(duplicate.path, input_dir, duplicates_dir, args.dry_run, args.delete_duplicates)

    output_hashes: set[int] = set()
    generated = 0
    skipped_crop_duplicates = 0
    grouped_combo = 0
    per_file: list[dict] = []

    for record in keepers:
        if record.path in duplicate_paths:
            continue

        candidates = detect_product_candidates(record.path)
        combo = is_combo_or_drink(record.path)
        if combo and candidates:
            candidates = [CropCandidate(union_bbox(candidates), sum(c.area for c in candidates))]
            grouped_combo += 1

        if not candidates and not is_probably_product_image(record.path):
            per_file.append(
                {
                    "source": str(record.path),
                    "skipped": "non_product_screen_or_price_table",
                    "combo_or_drink_grouped": combo,
                    "candidates": 0,
                    "outputs": [],
                }
            )
            continue

        if not candidates:
            with Image.open(record.path) as img:
                width, height = img.size
            candidates = [CropCandidate((0, 0, width, height), width * height)]
            if combo:
                grouped_combo += 1

        code = product_code_from_name(record.path)
        source_slug = slugify(record.path.stem)
        file_outputs: list[str] = []

        for index, candidate in enumerate(candidates, start=1):
            target_name = f"{source_slug}_producto-{index:02d}.jpg"
            target_path = output_dir / code / target_name

            if not args.dry_run:
                crop_to_square(record.path, candidate.bbox, target_path, args.square_size)
                crop_hash = perceptual_dhash(target_path)
                if any(hamming_distance(crop_hash, old) <= args.crop_hash_threshold for old in output_hashes):
                    target_path.unlink()
                    skipped_crop_duplicates += 1
                    continue
                output_hashes.add(crop_hash)

            generated += 1
            file_outputs.append(str(target_path))

        per_file.append(
            {
                "source": str(record.path),
                "combo_or_drink_grouped": combo,
                "candidates": len(candidates),
                "outputs": file_outputs,
            }
        )

    report = {
        "input_dir": str(input_dir),
        "output_dir": str(output_dir),
        "duplicates_dir": str(duplicates_dir),
        "input_images": len(paths),
        "readable_images": len(records),
        "unique_images": len(keepers),
        "duplicates_found": len(duplicates),
        "generated_product_images": generated,
        "skipped_duplicate_product_crops": skipped_crop_duplicates,
        "combo_or_drink_images_grouped": grouped_combo,
        "dry_run": args.dry_run,
        "files": per_file,
    }

    if not args.dry_run:
        output_dir.mkdir(parents=True, exist_ok=True)
        report_path = output_dir / "postprocess-report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Report saved: {report_path}")

    return report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Deduplicate extracted YPF images and create normalized individual product crops. "
            "Duplicates are moved to a quarantine folder by default, not deleted."
        )
    )
    parser.add_argument("--input", default=str(DEFAULT_INPUT_DIR), help="Folder with extracted images.")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT_DIR), help="Folder for final product crops.")
    parser.add_argument(
        "--duplicates-dir",
        default=str(DEFAULT_DUPLICATES_DIR),
        help="Folder where duplicate originals are moved.",
    )
    parser.add_argument("--hash-threshold", type=int, default=10, help="Near-duplicate image hash distance.")
    parser.add_argument("--crop-hash-threshold", type=int, default=8, help="Near-duplicate output crop distance.")
    parser.add_argument("--square-size", type=int, default=900, help="Final square image size in pixels.")
    parser.add_argument("--limit", type=int, default=0, help="Process only the first N images; useful for testing.")
    parser.add_argument("--dry-run", action="store_true", help="Analyze without moving or writing images.")
    parser.add_argument("--quiet", action="store_true", help="Do not print every duplicate found.")
    parser.add_argument(
        "--include-complete",
        action="store_true",
        help="Also process *_completo full frames. Default processes only recortes to avoid menus/screens.",
    )
    parser.add_argument(
        "--move-duplicates",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Move duplicate originals to the duplicates folder.",
    )
    parser.add_argument(
        "--delete-duplicates",
        action="store_true",
        help="Permanently delete duplicate originals. Use only after reviewing the quarantine result.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    report = process_images(args)
    print("\n=== Postprocess summary ===")
    print(f"Input images: {report['input_images']}")
    print(f"Unique images: {report['unique_images']}")
    print(f"Duplicates found: {report['duplicates_found']}")
    print(f"Generated product images: {report['generated_product_images']}")
    print(f"Combo/drink grouped images: {report['combo_or_drink_images_grouped']}")
    if report["dry_run"]:
        print("Dry run only: no files were moved or written.")


if __name__ == "__main__":
    main()
