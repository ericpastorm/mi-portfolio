#!/usr/bin/env python3
"""Generate the minimal Eric Pastor Open Graph image from local assets."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
WALLPAPER = ROOT / "public/aero/hero-field.png"
UNBOUNDED = ROOT / "scripts/fonts/Unbounded-Variable.ttf"
WIDTH, HEIGHT = 1200, 630
SCALE = 2
CANVAS_SIZE = (WIDTH * SCALE, HEIGHT * SCALE)
HEADING = "Hello, I'm Eric"


def scaled(value: float) -> int:
    return round(value * SCALE)


def unbounded_bold(size: int) -> ImageFont.FreeTypeFont:
    if not UNBOUNDED.exists():
        raise FileNotFoundError(
            "Missing scripts/fonts/Unbounded-Variable.ttf. "
            "The bundled generation font is licensed under scripts/fonts/OFL.txt."
        )
    typeface = ImageFont.truetype(str(UNBOUNDED), scaled(size))
    typeface.set_variation_by_name("Bold")
    return typeface


def fit_heading(max_width: int) -> ImageFont.FreeTypeFont:
    for size in range(98, 59, -2):
        typeface = unbounded_bold(size)
        bounds = typeface.getbbox(HEADING)
        if bounds[2] - bounds[0] <= scaled(max_width):
            return typeface
    return unbounded_bold(60)


def subtle_vignette(image: Image.Image) -> None:
    mask = Image.new("L", CANVAS_SIZE, 52)
    draw = ImageDraw.Draw(mask)
    draw.ellipse(
        (-scaled(110), -scaled(65), CANVAS_SIZE[0] + scaled(110), CANVAS_SIZE[1] + scaled(105)),
        fill=0,
    )
    mask = mask.filter(ImageFilter.GaussianBlur(scaled(82)))
    shade = Image.new("RGBA", CANVAS_SIZE, (0, 16, 47, 0))
    shade.putalpha(mask)
    image.alpha_composite(shade)


def localized_contrast(image: Image.Image, center: tuple[int, int], text_size: tuple[int, int]) -> None:
    """Add a soft optical falloff behind the type without drawing a visible panel."""
    halo = Image.new("L", CANVAS_SIZE, 0)
    draw = ImageDraw.Draw(halo)
    width = text_size[0] + scaled(150)
    height = text_size[1] + scaled(105)
    draw.ellipse(
        (
            center[0] - width // 2,
            center[1] - height // 2,
            center[0] + width // 2,
            center[1] + height // 2,
        ),
        fill=76,
    )
    halo = halo.filter(ImageFilter.GaussianBlur(scaled(56)))
    shade = Image.new("RGBA", CANVAS_SIZE, (1, 21, 63, 0))
    shade.putalpha(halo)
    image.alpha_composite(shade)


def chrome_gradient(size: tuple[int, int], top: int, bottom: int) -> Image.Image:
    stops = [
        (0.00, (249, 253, 255, 255)),
        (0.18, (214, 246, 255, 255)),
        (0.38, (75, 195, 255, 255)),
        (0.54, (38, 82, 184, 255)),
        (0.69, (111, 139, 244, 255)),
        (0.86, (171, 232, 255, 255)),
        (1.00, (239, 251, 255, 255)),
    ]
    gradient = Image.new("RGBA", size)
    draw = ImageDraw.Draw(gradient)
    for y in range(size[1]):
        position = max(0, min(1, (y - top) / max(1, bottom - top)))
        left, right = stops[0], stops[-1]
        for index in range(len(stops) - 1):
            if stops[index][0] <= position <= stops[index + 1][0]:
                left, right = stops[index], stops[index + 1]
                break
        amount = (position - left[0]) / max(0.001, right[0] - left[0])
        color = tuple(round(left[1][channel] * (1 - amount) + right[1][channel] * amount) for channel in range(4))
        draw.line((0, y, size[0], y), fill=color)
    return gradient


def draw_heading(image: Image.Image) -> None:
    typeface = fit_heading(max_width=990)
    bounds = typeface.getbbox(HEADING)
    text_width = bounds[2] - bounds[0]
    text_height = bounds[3] - bounds[1]
    center = (CANVAS_SIZE[0] // 2, CANVAS_SIZE[1] // 2 - scaled(4))
    x = center[0] - text_width // 2 - bounds[0]
    y = center[1] - text_height // 2 - bounds[1]

    localized_contrast(image, center, (text_width, text_height))

    fill_mask = Image.new("L", CANVAS_SIZE, 0)
    ImageDraw.Draw(fill_mask).text((x, y), HEADING, font=typeface, fill=255)

    dark_edge = Image.new("L", CANVAS_SIZE, 0)
    ImageDraw.Draw(dark_edge).text(
        (x, y), HEADING, font=typeface, fill=255, stroke_width=scaled(3), stroke_fill=255
    )
    dark_ring = ImageChops.subtract(dark_edge, fill_mask)

    light_edge = Image.new("L", CANVAS_SIZE, 0)
    ImageDraw.Draw(light_edge).text(
        (x, y), HEADING, font=typeface, fill=255, stroke_width=scaled(1.25), stroke_fill=255
    )
    light_ring = ImageChops.subtract(light_edge, fill_mask)

    shadow_mask = dark_edge.filter(ImageFilter.GaussianBlur(scaled(7)))
    shadow = Image.new("RGBA", CANVAS_SIZE, (0, 9, 41, 0))
    shadow.putalpha(shadow_mask.point(lambda value: value * 115 // 255))
    image.alpha_composite(shadow, (scaled(2), scaled(6)))

    dark_outline = Image.new("RGBA", CANVAS_SIZE, (6, 31, 94, 0))
    dark_outline.putalpha(dark_ring.point(lambda value: value * 190 // 255))
    image.alpha_composite(dark_outline)

    pale_outline = Image.new("RGBA", CANVAS_SIZE, (215, 248, 255, 0))
    pale_outline.putalpha(light_ring.point(lambda value: value * 235 // 255))
    image.alpha_composite(pale_outline)

    text_gradient = chrome_gradient(
        CANVAS_SIZE,
        top=y + bounds[1],
        bottom=y + bounds[3],
    )
    text_gradient.putalpha(fill_mask)
    image.alpha_composite(text_gradient)

    # A restrained upper specular pass sharpens the chrome without adding graphics.
    highlight = Image.new("RGBA", CANVAS_SIZE, (255, 255, 255, 0))
    highlight_mask = Image.new("L", CANVAS_SIZE, 0)
    highlight_draw = ImageDraw.Draw(highlight_mask)
    highlight_draw.rectangle(
        (x, y + bounds[1], x + text_width, y + bounds[1] + max(1, text_height // 5)),
        fill=62,
    )
    highlight.putalpha(ImageChops.multiply(fill_mask, highlight_mask))
    image.alpha_composite(highlight)


def generate(output: Path) -> None:
    wallpaper = Image.open(WALLPAPER).convert("RGB")
    wallpaper = ImageOps.fit(
        wallpaper,
        CANVAS_SIZE,
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.18),
    )
    wallpaper = ImageEnhance.Color(wallpaper).enhance(1.035)
    wallpaper = ImageEnhance.Contrast(wallpaper).enhance(1.025)
    canvas = wallpaper.convert("RGBA")

    subtle_vignette(canvas)
    draw_heading(canvas)

    final = canvas.convert("RGB").resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    final = ImageEnhance.Sharpness(final).enhance(1.04)
    output.parent.mkdir(parents=True, exist_ok=True)
    final.save(output, format="PNG", optimize=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT / "app/opengraph-image.png")
    generate(parser.parse_args().output)
