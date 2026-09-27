export type Side = 'left' | 'right';
export type AppMode = 'learn' | 'practice' | 'exam' | 'partner';

export interface ExperimentSettings {
  wavelength: number; // in nm
  radiusOfCurvature: number; // in meters (e.g., 1.0)
  lampOn: boolean;
  mode: AppMode;
  simulateBacklash: boolean;
}

export interface InstrumentState {
  microscopePosition: number; // in mm (Scale reading)
  trueMicroscopePosition: number; // in mm (True physical position)
  lastDirection: 'left' | 'right' | null;
  focus: number; // 0 to 1 (0 = blurred, 1 = perfectly focused)
  condenserPosition: number; // 0 to 1
}

export interface MeasurementRecord {
  id: string; 
  ringNumber: number;
  side: Side;
  scaleReading: number; // in mm
  timestamp: number;
}

export interface CalculatedRingResult {
  ringNumber: number;
  leftReading: number | null;
  rightReading: number | null;
  diameter: number | null;
  squaredDiameter: number | null;
  isComplete: boolean;
}

export interface ExperimentResult {
  slope: number | null; // from the D² vs n graph
  calculatedWavelength: number | null;
  percentageDifference: number | null;
  isSubmitted: boolean;
}

export interface ExperimentState {
  settings: ExperimentSettings;
  instrument: InstrumentState;
  measurements: MeasurementRecord[];
  results: ExperimentResult;
}
