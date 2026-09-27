import { describe, it, expect } from 'vitest';
import {
  calculateIdealRingRadius,
  calculateIdealRingDiameter,
  calculateDiameterFromReadings,
  calculateSquaredDiameter,
  calculateWavelengthFromTwoRings,
  calculateWavelengthFromSlope,
  calculatePercentageDifference,
  calculateLinearFitSlope
} from './calculations';

describe('Newton\'s Rings Physics Calculations', () => {
  const lambda = 589.3; // nm
  const R = 1.0; // meters

  it('calculates ideal ring radius correctly', () => {
    // r_n = sqrt(16 * 589.3e-9 * 1.0) * 1000 = 3.0707 mm
    const r16 = calculateIdealRingRadius(16, lambda, R);
    expect(r16).toBeCloseTo(3.0707, 3);
  });

  it('calculates ideal ring diameter correctly', () => {
    const d16 = calculateIdealRingDiameter(16, lambda, R);
    expect(d16).toBeCloseTo(6.1414, 3);
  });

  it('calculates diameter from left and right readings', () => {
    expect(calculateDiameterFromReadings(21.929, 28.071)).toBeCloseTo(6.142, 3);
    // handles incomplete inputs
    expect(calculateDiameterFromReadings(null, 28.071)).toBeNull();
    expect(calculateDiameterFromReadings(21.929, null)).toBeNull();
  });

  it('calculates squared diameter', () => {
    expect(calculateSquaredDiameter(6.0)).toBeCloseTo(36.0, 3);
    expect(calculateSquaredDiameter(null)).toBeNull();
  });

  it('calculates wavelength from two rings (e.g., 16th and 8th)', () => {
    // p = 8
    const d16 = calculateIdealRingDiameter(16, lambda, R);
    const d8 = calculateIdealRingDiameter(8, lambda, R);
    
    const dSq16 = calculateSquaredDiameter(d16) as number;
    const dSq8 = calculateSquaredDiameter(d8) as number;

    const calculatedLambda = calculateWavelengthFromTwoRings(dSq8, dSq16, 8, R);
    expect(calculatedLambda).toBeCloseTo(lambda, 3);
  });

  it('calculates wavelength from graph slope', () => {
    // m = 4 * lambda_meters * R
    const lambdaM = lambda * 1e-9;
    const slopeM2 = 4 * lambdaM * R;
    const slopeMm2 = slopeM2 * 1e6; // convert slope from m² to mm²

    const calculatedLambda = calculateWavelengthFromSlope(slopeMm2, R);
    expect(calculatedLambda).toBeCloseTo(lambda, 3);
  });

  it('calculates linear fit slope correctly', () => {
    const points = [
      { x: 4, y: 10 },
      { x: 8, y: 20 },
      { x: 12, y: 30 },
      { x: 16, y: 40 }
    ];
    // Ideal line y = 2.5x
    const slope = calculateLinearFitSlope(points);
    expect(slope as number).toBeCloseTo(2.5, 3);
  });

  it('calculates percentage difference', () => {
    expect(calculatePercentageDifference(589.3, 589.3)).toBeCloseTo(0, 3);
    expect(calculatePercentageDifference(600, 589.3)).toBeCloseTo(1.8157, 3);
  });
});
