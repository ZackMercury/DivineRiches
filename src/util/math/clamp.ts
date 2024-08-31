
const clamp = (val: number, min: number, max: number) => val > max ? max : val < min ? min : val; 

export default clamp;