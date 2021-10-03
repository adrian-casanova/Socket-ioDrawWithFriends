export function getDistance(xA, yA, xB, yB) {
  const xDiff = xA - xB;
  const yDiff = yA - yB;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
