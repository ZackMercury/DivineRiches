const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const lerp = (t: number, a: number, b: number) => a + t * (b - a);

const grad = (hash: number, x: number, y: number): number => {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};

// simple hash function
const noise = (x: number, y: number): number => {
  const h = (x * 374761393 + y * 668265263) ^ 0x5bf03635;
  return (h ^ (h >> 13)) & 255;
};

// implementation of the Perlin noise algorithm
const perlin = (x: number, y: number, scale: number = 0.1, depth: number = 6, persistence: number = 0.5, lacunarity: number = 2.0): number => {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;  // Used for normalizing result to [0, 1]

  for (let i = 0; i < depth; i++) {
    const xScaled = x * scale * frequency;
    const yScaled = y * scale * frequency;

    const X = Math.floor(xScaled) & 255;
    const Y = Math.floor(yScaled) & 255;

    const xf = xScaled - Math.floor(xScaled);
    const yf = yScaled - Math.floor(yScaled);

    const u = fade(xf);
    const v = fade(yf);

    const aa = noise(X, Y);
    const ab = noise(X, Y + 1);
    const ba = noise(X + 1, Y);
    const bb = noise(X + 1, Y + 1);

    const x1 = lerp(u, grad(aa, xf, yf), grad(ba, xf - 1, yf));
    const x2 = lerp(u, grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1));

    total += lerp(v, x1, x2) * amplitude;

    maxValue += amplitude;

    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return total / maxValue;
};

export { lerp };

export default perlin;
