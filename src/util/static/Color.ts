import clamp from "../math/clamp";


export default abstract class Color {
  private static numberToHex (x: number): string {
    return x.toString(16).padStart(2, '0');
  }

  public static hsvToHex (h: number, s: number, v: number) {
    const f = (n: number, k = (n + h * 6) % 6) =>
        v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

    const r = Math.round(f(5) * 255);
    const g = Math.round(f(3) * 255);
    const b = Math.round(f(1) * 255);

    return `#${Color.numberToHex(r)}${Color.numberToHex(g)}${Color.numberToHex(b)}`;
  }

  public static hexToRGB (hex: string) {
    const num = hex.replace('#', '').match(/.{2}/g);
    return num!.map(str => parseInt(str, 16) / 255);
  }

  public static rgbToHex (rgb: number[] ) {
    return '#' + rgb.map(component => Color.numberToHex(Math.round(component * 255))).join('');
  }

  public static hexToHsv (hex: string): { h: number, s: number, v: number } {
    hex = hex.replace(/^#/, '');

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    const r1 = r / 255;
    const g1 = g / 255;
    const b1 = b / 255;

    const max = Math.max(r1, g1, b1);
    const min = Math.min(r1, g1, b1);
    const delta = max - min;

    let h = 0, s: number, v: number;
    
    v = max;

    s = max === 0 ? 0 : delta / max;

    if (delta === 0) {
      h = 0;
    } else {
      switch (max) {
        case r1:
          h = ((g1 - b1) / delta + (g1 < b1 ? 6 : 0)) / 6;
          break;
        case g1:
          h = ((b1 - r1) / delta + 2) / 6;
          break;
        case b1:
          h = ((r1 - g1) / delta + 4) / 6;
          break;
      }
    }

    return { h, s, v };
  }

  public static scale (color: string, value: number) {
    const rgb = Color.hexToRGB(color);
    
    return Color.rgbToHex(rgb.map(comp => clamp(comp * value, 0, 1)));
  }

  public static lightness(color: string) {
    const rgb = this.hexToRGB(color);
    return (Math.max(...rgb) + Math.min(...rgb)) / 2;
  }
}