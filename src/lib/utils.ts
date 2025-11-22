/**
 * Convert CSS units (vw, vh, px, or number) to pixels
 * @param value - The value to convert (can be a number or string with units)
 * @returns The value in pixels
 */
export function convertToPixels(value: number | string): number {
  if (typeof value === "number") return value;

  if (value.endsWith("vw")) {
    const vw = parseFloat(value);
    return (vw * window.innerWidth) / 100;
  }

  if (value.endsWith("vh")) {
    const vh = parseFloat(value);
    return (vh * window.innerHeight) / 100;
  }

  if (value.endsWith("px")) {
    return parseFloat(value);
  }

  return parseFloat(value) || 0;
}
