/**
 * Color manipulation utilities
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function darkenColor(color: string, amount: number = 0.3): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const darkened = {
    r: Math.max(0, Math.floor(rgb.r * (1 - amount))),
    g: Math.max(0, Math.floor(rgb.g * (1 - amount))),
    b: Math.max(0, Math.floor(rgb.b * (1 - amount))),
  };

  return rgbToHex(darkened.r, darkened.g, darkened.b);
}

export function lightenColor(color: string, amount: number = 0.3): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const lightened = {
    r: Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount)),
    g: Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount)),
    b: Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount)),
  };

  return rgbToHex(lightened.r, lightened.g, lightened.b);
}

export function addAlpha(color: string, alpha: string): string {
  return color + alpha;
}
