const map = (val: number, r1a: number, r1b: number, r2a: number, r2b: number): number => {
  return r2a + (r2b - r2a) * ((val - r1a) / (r1b - r1a));
};

export default map;