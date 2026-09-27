
import { useExperiment } from '../../stores/experimentStore';

export function ControlsPanel() {
  const { state, dispatch } = useExperiment();

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col">
      <h2 className="font-semibold text-slate-200 mb-4 border-b border-slate-700 pb-3">Apparatus Controls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-400">
        
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">Sodium Lamp</span>
              <button 
                onClick={() => dispatch({ type: 'SET_LAMP', payload: !state.settings.lampOn })}
                className={`w-10 h-5 rounded-full relative transition-colors ${state.settings.lampOn ? 'bg-amber-500' : 'bg-slate-700'}`}
                aria-label="Toggle Sodium Lamp"
              >
                <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-transform ${state.settings.lampOn ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>
            <p className="text-xs text-slate-500">Monochromatic source</p>
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium">Condenser</span>
            <span className="text-xs text-slate-500">{Math.round(state.instrument.condenserPosition * 100)}%</span>
          </div>
          <input 
            type="range" min="0" max="1" step="0.01" 
            value={state.instrument.condenserPosition}
            onChange={(e) => dispatch({ type: 'SET_CONDENSER', payload: parseFloat(e.target.value) })}
            className="w-full mt-2 accent-blue-500"
          />
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium">Position</span>
            <span className="text-xs text-slate-500">{state.instrument.microscopePosition.toFixed(2)} mm</span>
          </div>
          <input 
            type="range" min="15" max="35" step="0.1" 
            value={state.instrument.microscopePosition}
            onChange={(e) => dispatch({ type: 'SET_MICROSCOPE_POSITION', payload: parseFloat(e.target.value) })}
            className="w-full mt-2 accent-blue-500"
          />
          <div className="flex justify-between mt-2">
            <button 
              onClick={() => dispatch({ type: 'SET_MICROSCOPE_POSITION', payload: state.instrument.microscopePosition - 0.01 })}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700"
            >-0.01 (Left)</button>
            <button 
              onClick={() => dispatch({ type: 'SET_MICROSCOPE_POSITION', payload: state.instrument.microscopePosition + 0.01 })}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700"
            >+0.01 (Right)</button>
          </div>
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium">Focus</span>
            <span className="text-xs text-slate-500">{Math.round(state.instrument.focus * 100)}%</span>
          </div>
          <input 
            type="range" min="0" max="1" step="0.01" 
            value={state.instrument.focus}
            onChange={(e) => dispatch({ type: 'SET_FOCUS', payload: parseFloat(e.target.value) })}
            className="w-full mt-2 accent-blue-500"
          />
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium">Wavelength (λ)</span>
            <span className="text-xs text-slate-500">{state.settings.wavelength} nm</span>
          </div>
          <input 
            type="range" min="400" max="700" step="0.1" 
            value={state.settings.wavelength}
            onChange={(e) => dispatch({ type: 'SET_WAVELENGTH', payload: parseFloat(e.target.value) })}
            className="w-full mt-2 accent-blue-500"
          />
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium">Lens Radius (R)</span>
            <span className="text-xs text-slate-500">{state.settings.radiusOfCurvature} m</span>
          </div>
          <input 
            type="range" min="0.5" max="2.0" step="0.05" 
            value={state.settings.radiusOfCurvature}
            onChange={(e) => dispatch({ type: 'SET_RADIUS', payload: parseFloat(e.target.value) })}
            className="w-full mt-2 accent-blue-500"
          />
        </div>

        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium text-red-400">Error Engine</span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-3 text-sm text-slate-300 select-none">
            <input 
              type="checkbox" 
              checked={state.settings.simulateBacklash}
              onChange={() => dispatch({ type: 'TOGGLE_BACKLASH' })}
              className="accent-red-500 w-4 h-4 cursor-pointer"
            />
            Simulate Mechanical Backlash
          </label>
        </div>

      </div>
    </div>
  );
}
