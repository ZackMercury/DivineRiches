
const arrayIntersections = (array1: any[], array2: any[]) => {
  const intersections = array1.filter(item => array2.includes(item));
  return intersections;
}

export default arrayIntersections;