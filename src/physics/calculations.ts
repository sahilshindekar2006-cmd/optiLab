export const REFERENCE_WAVELENGTH_NM = 589.3; // Sodium reference wavelength

/**
 * Calculates the ideal radius of the n-th Newton's ring.
 * @param n Ring order
 * @param lambdaNm Wavelength of light in nanometers
 * @param RMeters Radius of curvature in meters
 * @returns Radius in millimeters
 */
export function calculateIdealRingRadius(n: number, lambdaNm: number, RMeters: number): number {
  if (n < 0 || lambdaNm <= 0 || RMeters <= 0) return 0;
  // Convert lambda to meters
  const lambdaM = lambdaNm * 1e-9;
  // r_n = sqrt(n * lambda * R) in meters
  const rMeters = Math.sqrt(n * lambdaM * RMeters);
  // Convert to millimeters
  return rMeters * 1000;
}

/**
 * Calculates the ideal diameter of the n-th Newton's ring.
 * @param n Ring order
 * @param lambdaNm Wavelength of light in nanometers
 * @param RMeters Radius of curvature in meters
 * @returns Diameter in millimeters
 */
export function calculateIdealRingDiameter(n: number, lambdaNm: number, RMeters: number): number {
  return 2 * calculateIdealRingRadius(n, lambdaNm, RMeters);
}

/**
 * Calculates the diameter given a left and right scale reading.
 * Returns null if either reading is missing.
 * @param leftReadingMm Scale reading on the left side in mm
 * @param rightReadingMm Scale reading on the right side in mm
 * @returns Diameter in mm
 */
export function calculateDiameterFromReadings(leftReadingMm: number | null, rightReadingMm: number | null): number | null {
  if (leftReadingMm === null || rightReadingMm === null) return null;
  return Math.abs(rightReadingMm - leftReadingMm);
}

/**
 * Calculates the squared diameter.
 * @param diameterMm Diameter in mm
 * @returns Squared diameter in mm²
 */
export function calculateSquaredDiameter(diameterMm: number | null): number | null {
  if (diameterMm === null) return null;
  return diameterMm * diameterMm;
}

/**
 * Calculates wavelength using two ring measurements separated by p rings.
 * lambda = (D_{n+p}^2 - D_n^2) / (4 * p * R)
 * @param dSqN_mm2 Squared diameter of the inner ring in mm²
 * @param dSqNp_mm2 Squared diameter of the outer ring in mm²
 * @param p Number of ring intervals between the two rings
 * @param RMeters Radius of curvature in meters
 * @returns Wavelength in nanometers
 */
export function calculateWavelengthFromTwoRings(dSqN_mm2: number, dSqNp_mm2: number, p: number, RMeters: number): number {
  if (p <= 0 || RMeters <= 0) return 0;
  
  // Convert squared diameters from mm² to m²
  const dSqN_m2 = dSqN_mm2 * 1e-6;
  const dSqNp_m2 = dSqNp_mm2 * 1e-6;
  
  // lambda in meters
  const lambdaM = (dSqNp_m2 - dSqN_m2) / (4 * p * RMeters);
  
  // Convert to nanometers
  return lambdaM * 1e9;
}

/**
 * Calculates wavelength from the slope of a D² vs n graph.
 * lambda = m / (4 * R)
 * @param slopeMm2 Slope of the linear fit (D² / n) in mm²
 * @param RMeters Radius of curvature in meters
 * @returns Wavelength in nanometers
 */
export function calculateWavelengthFromSlope(slopeMm2: number, RMeters: number): number {
  if (RMeters <= 0) return 0;
  
  // Convert slope from mm² to m²
  const slopeM2 = slopeMm2 * 1e-6;
  
  // lambda in meters
  const lambdaM = slopeM2 / (4 * RMeters);
  
  // Convert to nanometers
  return lambdaM * 1e9;
}

/**
 * Calculates percentage difference between measured and reference wavelength.
 * @param measuredLambdaNm Measured wavelength in nanometers
 * @param referenceLambdaNm Reference wavelength in nanometers (default Sodium: 589.3)
 * @returns Percentage difference (absolute)
 */
export function calculatePercentageDifference(measuredLambdaNm: number, referenceLambdaNm: number = REFERENCE_WAVELENGTH_NM): number {
  if (referenceLambdaNm === 0) return 0;
  return (Math.abs(measuredLambdaNm - referenceLambdaNm) / referenceLambdaNm) * 100;
}

/**
 * Performs a simple linear regression (least squares fit) to find the slope.
 * @param dataPoints Array of points {x, y} where x is ring number and y is D²
 * @returns Slope of the best fit line, or null if insufficient data
 */
export function calculateLinearFitSlope(dataPoints: Array<{x: number, y: number}>): number | null {
  if (dataPoints.length < 2) return null;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  const n = dataPoints.length;

  for (const point of dataPoints) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  }

  const denominator = (n * sumXX - sumX * sumX);
  if (denominator === 0) return null; // Avoid division by zero for vertical line

  return (n * sumXY - sumX * sumY) / denominator;
}
