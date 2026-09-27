

interface ScaleDisplayProps {
  position: number;
}

export function ScaleDisplay({ position }: ScaleDisplayProps) {
  // Main scale reads to 0.5 mm or 1 mm usually, but let's simulate a standard 0.1 mm least count on main scale, 
  // and 100 divisions on vernier = 0.001 mm? 
  // The spec says "Use the specified 0.01 mm movement increment".
  // So Main scale least count = 0.5 mm, Vernier has 50 divisions = 0.01 mm.
  // Wait, let's keep it simple: Main scale = 0.1 mm increments. Vernier = 10 divisions = 0.01 mm.
  const mainScale = Math.floor(position * 10) / 10;
  let vernierDivisions = Math.round((position - mainScale) * 100);
  
  // Handle floating point rounding issues
  if (vernierDivisions >= 10) {
    vernierDivisions = 0;
  }

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 font-mono text-sm w-full">
      <div className="flex justify-between items-center mb-1">
         <span className="text-slate-400">Main Scale (0.1mm)</span>
         <span className="text-slate-200">{mainScale.toFixed(1)} mm</span>
      </div>
      <div className="flex justify-between items-center mb-2">
         <span className="text-slate-400">Vernier Scale (div)</span>
         <span className="text-slate-200">{vernierDivisions}</span>
      </div>
      <div className="flex justify-between items-center border-t border-slate-700 pt-2">
         <span className="text-slate-400 uppercase text-xs tracking-wider">Total Reading</span>
         <span className="text-emerald-400 font-bold text-lg">{position.toFixed(2)} mm</span>
      </div>
    </div>
  );
}
