import { useMemo } from 'react';
import { useExperiment } from '../../stores/experimentStore';

export function TutorialOverlay() {
  const { state } = useExperiment();

  // Determine the current step automatically based on the experiment state
  const step = useMemo(() => {
    if (!state.settings.lampOn) return 1;
    if (state.instrument.focus < 0.95) return 2;
    
    const hasReading = state.measurements.some(m => m.ringNumber === 16 && m.side === 'left');
    if (!hasReading) return 3;

    // Check if we have 8 readings (left and right for 16, 12, 8, 4)
    if (state.measurements.length < 8) return 4;

    return 5;
  }, [state]);

  // Only show this overlay if in Learn Mode
  if (state.settings.mode !== 'learn') return null;

  const steps = [
    { title: "Step 1: Turn on the Lamp", desc: "Toggle the Sodium Lamp switch in the Controls Panel to illuminate the apparatus." },
    { title: "Step 2: Focus the Microscope", desc: "The interference pattern is currently blurry. Adjust the Focus slider until the rings are sharp." },
    { title: "Step 3: First Measurement", desc: "Move the microscope left until the crosshair aligns with the 16th dark ring. Then, select Ring 16 (Left) in the Data Table and click Record." },
    { title: "Step 4: Collect Data", desc: "Continue measuring the required rings (16, 12, 8, 4) on both the left and right sides of the center point." },
    { title: "Step 5: View Results", desc: "Great job! All required data is collected. Check the Graph & Results tab to see the calculated wavelength and error margin." }
  ];

  const currentStepInfo = steps[step - 1];

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-slate-800 border border-blue-500/50 rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="bg-blue-900/40 px-4 py-2 flex justify-between items-center border-b border-blue-500/30">
        <h3 className="font-bold text-blue-400 text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          Learn Mode Guide
        </h3>
        <span className="text-xs bg-slate-900 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30">Step {step} of 5</span>
      </div>
      <div className="p-4">
        <p className="text-slate-200 font-semibold text-sm mb-2">{currentStepInfo.title}</p>
        <p className="text-slate-400 text-sm leading-relaxed">{currentStepInfo.desc}</p>
        
        {/* Progress indicators */}
        <div className="flex gap-1 mt-4">
          {[1,2,3,4,5].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s < step ? 'bg-blue-500' : s === step ? 'bg-blue-400' : 'bg-slate-700'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
