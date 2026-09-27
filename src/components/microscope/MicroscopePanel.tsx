
import { ProceduralRings } from './ProceduralRings';
import { ScaleDisplay } from './ScaleDisplay';
import { useExperiment } from '../../stores/experimentStore';

export function MicroscopePanel() {
  const { state } = useExperiment();
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-lg h-full">
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/80">
        <h2 className="font-semibold text-slate-200">Viewfinder</h2>
      </div>
      
      {/* Viewfinder Screen */}
      <div className="aspect-square bg-slate-950 border-b border-slate-700 flex items-center justify-center relative shadow-inner overflow-hidden">
        
        {/* Procedural Physics Pattern */}
        <div className="absolute inset-0">
          <ProceduralRings width={400} height={400} />
        </div>
        
        {/* Crosshair */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Horizontal line */}
          <div className="w-full h-[1px] bg-red-500/80 absolute top-1/2 -translate-y-1/2"></div>
          {/* Vertical line */}
          <div className="h-full w-[1px] bg-red-500/80 absolute left-1/2 -translate-x-1/2"></div>
          {/* Central dot */}
          <div className="w-2 h-2 bg-red-500 rounded-full absolute"></div>
        </div>
      </div>
      
      <div className="p-4 bg-slate-800">
        <ScaleDisplay position={state.instrument.microscopePosition} />
      </div>
    </div>
  );
}
