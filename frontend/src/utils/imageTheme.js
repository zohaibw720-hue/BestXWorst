
const FALLBACK_THEME = null;

function clamp(value, min = 0, max = 255) {
  return Math.min(max, Math.max(min, value));
}

function rgbToString({ r, g, b }) {
  return `rgb(${r}, ${g}, ${b})`;
}

function makeColor(r, g, b) {
  return {
    r: clamp(Math.round(r)),
    g: clamp(Math.round(g)),
    b: clamp(Math.round(b)),
  };
}

function mixColors(color, target, amount) {
  return {
    r: Math.round(color.r * (1 - amount) + target.r * amount),
    g: Math.round(color.g * (1 - amount) + target.g * amount),
    b: Math.round(color.b * (1 - amount) + target.b * amount),
  };
}

function createTheme(primary) {
  const dark = mixColors(primary, { r: 25, g: 27, b: 25 }, 0.78);
  const soft = mixColors(primary, { r: 245, g: 243, b: 238 }, 0.88);

  return {
    "--image-theme-color": rgbToString(primary),
    "--image-theme-primary": rgbToString(primary),
    "--image-theme-dark": rgbToString(dark),
    "--image-theme-light": "#F5F3EE",
    "--image-theme-background": "#F5F3EE",
    "--image-theme-surface": "#FFFFFF",
    "--image-theme-text": "#20221F",
    "--image-theme-muted": "#74766F",
    "--image-theme-border": "#E2E0D9",
    "--image-theme-accent": "#E7473F",
    "--image-theme-tint": `rgba(${primary.r}, ${primary.g}, ${primary.b}, 0.08)`,
    "--image-theme-soft": rgbToString(soft),
  };
}

export function getImageTheme(image) {
  if (
    !image ||
    !image.complete ||
    !image.naturalWidth ||
    !image.naturalHeight
  ) {
    return FALLBACK_THEME;
  }

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context) return FALLBACK_THEME;

    canvas.width = 32;
    canvas.height = 32;

    context.drawImage(image, 0, 0, 32, 32);

    const { data } = context.getImageData(0, 0, 32, 32);
    const buckets = new Map();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      if (alpha < 180) continue;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      if (max < 25 || (max > 248 && min > 238)) continue;

      const key = `${Math.round(r / 24)}-${Math.round(g / 24)}-${Math.round(b / 24)}`;

      const bucket = buckets.get(key) || {
        count: 0,
        r: 0,
        g: 0,
        b: 0,
      };

      bucket.count += 1;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;

      buckets.set(key, bucket);
    }

    let dominant = null;

    for (const bucket of buckets.values()) {
      if (!dominant || bucket.count > dominant.count) {
        dominant = bucket;
      }
    }

    if (!dominant || dominant.count < 3) {
      return FALLBACK_THEME;
    }

    const primary = makeColor(
      dominant.r / dominant.count,
      dominant.g / dominant.count,
      dominant.b / dominant.count
    );

    return createTheme(primary);
  } catch {
    // Some remote images do not permit canvas pixel access.
    return FALLBACK_THEME;
  }
}
