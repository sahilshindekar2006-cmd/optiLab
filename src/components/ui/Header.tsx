
import { useExperiment } from '../../stores/experimentStore';
import { AppMode } from '../../types/experiment';

export function Header() {
  const { state, dispatch } = useExperiment();

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span className="text-blue-500">OptiLab</span> 360
        </h1>
        <p className="text-xs text-slate-400">Newton's Rings Digital Twin</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Mode</label>
          <select 
            value={state.settings.mode}
            onChange={(e) => dispatch({ type: 'SET_MODE', payload: e.target.value as AppMode })}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded px-3 py-1.5 outline-none cursor-pointer focus:border-blue-500"
          >
            <option value="learn">Learn Mode</option>
            <option value="practice">Practice Mode</option>
            <option value="exam">Exam Mode</option>
          </select>
        </div>
        
        <div className="w-px h-6 bg-slate-700 mx-1"></div>

        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to reset the experiment? All unsaved data will be lost.")) {
              dispatch({ type: 'RESET_EXPERIMENT' });
            }
          }}
          className="bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-300 hover:border-red-800/50 border border-slate-700 text-sm px-4 py-1.5 rounded transition-colors"
        >
          Reset Lab
        </button>
      </div>
    </header>
  );
}
