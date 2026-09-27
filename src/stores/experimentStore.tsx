import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ExperimentState, MeasurementRecord, Side, AppMode } from '../types/experiment';

export const initialState: ExperimentState = {
  settings: {
    wavelength: 589.3, // nm (Sodium reference)
    radiusOfCurvature: 1.0, // meters
    lampOn: false,
    mode: 'learn',
    simulateBacklash: false,
  },
  instrument: {
    microscopePosition: 25.0, // mm 
    trueMicroscopePosition: 25.0,
    lastDirection: null,
    focus: 0.5,
    condenserPosition: 0.5,
  },
  measurements: [],
  results: {
    slope: null,
    calculatedWavelength: null,
    percentageDifference: null,
    isSubmitted: false,
  }
};

export type Action =
  | { type: 'SET_LAMP'; payload: boolean }
  | { type: 'SET_CONDENSER'; payload: number }
  | { type: 'SET_WAVELENGTH'; payload: number }
  | { type: 'SET_RADIUS'; payload: number }
  | { type: 'SET_MICROSCOPE_POSITION'; payload: number }
  | { type: 'SET_FOCUS'; payload: number }
  | { type: 'RECORD_MEASUREMENT'; payload: { ringNumber: number; side: Side; reading: number } }
  | { type: 'REMOVE_MEASUREMENT'; payload: { ringNumber: number; side: Side } }
  | { type: 'SET_MODE'; payload: AppMode }
  | { type: 'TOGGLE_BACKLASH' }
  | { type: 'SUBMIT_EXAM' }
  | { type: 'RESET_EXPERIMENT' }
  | { type: 'UPDATE_RESULTS'; payload: Partial<ExperimentState['results']> }
  | { type: 'SYNC_STATE'; payload: Partial<ExperimentState> };

export function experimentReducer(state: ExperimentState, action: Action): ExperimentState {
  switch (action.type) {
    case 'SET_LAMP':
      return { ...state, settings: { ...state.settings, lampOn: action.payload } };
    case 'SET_CONDENSER':
      return { ...state, instrument: { ...state.instrument, condenserPosition: action.payload } };
    case 'SET_WAVELENGTH':
      return { ...state, settings: { ...state.settings, wavelength: action.payload } };
    case 'SET_RADIUS':
      return { ...state, settings: { ...state.settings, radiusOfCurvature: action.payload } };
    case 'TOGGLE_BACKLASH':
      return { ...state, settings: { ...state.settings, simulateBacklash: !state.settings.simulateBacklash } };
    case 'SET_MICROSCOPE_POSITION': {
      const newPos = action.payload;
      const oldPos = state.instrument.microscopePosition;
      const delta = newPos - oldPos;
      if (delta === 0) return state;

      const direction = delta > 0 ? 'right' : 'left';
      let newTruePos = state.instrument.trueMicroscopePosition;
      const lastDir = state.instrument.lastDirection;

      // Simulate mechanical backlash: if direction changes, the first 0.05mm of movement doesn't move the actual microscope
      if (state.settings.simulateBacklash && lastDir && lastDir !== direction) {
        const backlashAmount = 0.05;
        if (Math.abs(delta) > backlashAmount) {
           newTruePos += (delta > 0 ? delta - backlashAmount : delta + backlashAmount);
        }
      } else {
        newTruePos += delta;
      }

      return { 
        ...state, 
        instrument: { 
          ...state.instrument, 
          microscopePosition: newPos,
          trueMicroscopePosition: newTruePos,
          lastDirection: direction
        } 
      };
    }
    case 'SET_FOCUS':
      return { ...state, instrument: { ...state.instrument, focus: action.payload } };
    case 'RECORD_MEASUREMENT': {
      // Remove existing measurement for this ring/side if it exists, then add new
      const filtered = state.measurements.filter(
        m => !(m.ringNumber === action.payload.ringNumber && m.side === action.payload.side)
      );
      const newMeasurement: MeasurementRecord = {
        id: `${action.payload.ringNumber}-${action.payload.side}-${Date.now()}`,
        ringNumber: action.payload.ringNumber,
        side: action.payload.side,
        scaleReading: action.payload.reading,
        timestamp: Date.now()
      };
      return { ...state, measurements: [...filtered, newMeasurement] };
    }
    case 'REMOVE_MEASUREMENT': {
      return {
        ...state,
        measurements: state.measurements.filter(
          m => !(m.ringNumber === action.payload.ringNumber && m.side === action.payload.side)
        )
      };
    }
    case 'SET_MODE':
      return { 
        ...state, 
        settings: { ...state.settings, mode: action.payload },
        results: { ...state.results, isSubmitted: false }
      };
    case 'SUBMIT_EXAM':
      return { ...state, results: { ...state.results, isSubmitted: true } };
    case 'RESET_EXPERIMENT':
      return {
        ...initialState,
        // Preserve mode on reset
        settings: { ...initialState.settings, mode: state.settings.mode } 
      };
    case 'UPDATE_RESULTS':
      return { ...state, results: { ...state.results, ...action.payload } };
    case 'SYNC_STATE':
      return { 
        ...state, 
        instrument: action.payload.instrument || state.instrument,
        measurements: action.payload.measurements || state.measurements,
        settings: { ...state.settings, ...action.payload.settings }
      };
    default:
      return state;
  }
}

interface ExperimentContextProps {
  state: ExperimentState;
  dispatch: React.Dispatch<Action>;
}

const ExperimentContext = createContext<ExperimentContextProps | undefined>(undefined);

export function ExperimentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(experimentReducer, initialState);
  return (
    <ExperimentContext.Provider value={{ state, dispatch }}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  const context = useContext(ExperimentContext);
  if (context === undefined) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return context;
}
