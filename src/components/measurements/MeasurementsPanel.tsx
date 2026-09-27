import { useState } from 'react';
import { useExperiment } from '../../stores/experimentStore';
import { 
  calculateDiameterFromReadings, 
  calculateSquaredDiameter,
  calculateLinearFitSlope,
  calculateWavelengthFromSlope,
  calculatePercentageDifference,
  REFERENCE_WAVELENGTH_NM
} from '../../physics/calculations';
import { Side } from '../../types/experiment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

export function MeasurementsPanel() {
  const { state, dispatch } = useExperiment();
  const [activeTab, setActiveTab] = useState<'table' | 'graph'>('table');
  
  // Selection state for recording
  const [selectedRing, setSelectedRing] = useState<number>(16);
  const [selectedSide, setSelectedSide] = useState<Side>('left');

  const ringsToMeasure = [16, 12, 8, 4];
  
  const handleRecord = () => {
    dispatch({
      type: 'RECORD_MEASUREMENT',
      payload: {
        ringNumber: selectedRing,
        side: selectedSide,
        reading: state.instrument.microscopePosition
      }
    });
  };

  const handleDelete = (ringNumber: number, side: Side) => {
    dispatch({
      type: 'REMOVE_MEASUREMENT',
      payload: { ringNumber, side }
    });
  };

  const isExam = state.settings.mode === 'exam';
  const isSubmitted = state.results.isSubmitted;

  // Group measurements by ring
  const ringData = ringsToMeasure.map(n => {
    const leftM = state.measurements.find(m => m.ringNumber === n && m.side === 'left');
    const rightM = state.measurements.find(m => m.ringNumber === n && m.side === 'right');
    const leftReading = leftM ? leftM.scaleReading : null;
    const rightReading = rightM ? rightM.scaleReading : null;
    
    const D = calculateDiameterFromReadings(leftReading, rightReading);
    const D2 = calculateSquaredDiameter(D);
    
    return { n, leftReading, rightReading, D, D2 };
  });

  // Calculate results
  const validDataPoints = ringData
    .filter(d => d.D2 !== null)
    .map(d => ({ x: d.n, y: d.D2 as number }));

  let lambdaResult = 0;
  let percentDiff = 0;
  if (validDataPoints.length >= 2) {
    const slope = calculateLinearFitSlope(validDataPoints);
    if (slope !== null) {
      lambdaResult = calculateWavelengthFromSlope(slope, state.settings.radiusOfCurvature);
      percentDiff = calculatePercentageDifference(lambdaResult, REFERENCE_WAVELENGTH_NM);
    }
  }

  const chartData = validDataPoints.map(p => ({ ring: p.x, dSquared: p.y })).sort((a, b) => a.ring - b.ring);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSaveToCloud = async () => {
    if (!supabase) {
      setSaveMessage('Supabase not configured in .env');
      return;
    }
    setIsSaving(true);
    setSaveMessage('');
    try {
      const grade = Math.max(0, 100 - (percentDiff > 5 ? 50 : percentDiff > 2 ? 20 : percentDiff > 1 ? 5 : 0));
      const { error } = await supabase.from('experiments').insert([{
        grade,
        wavelength: lambdaResult,
        error_margin: percentDiff,
        mode: state.settings.mode,
        measurements: state.measurements
      }]);
      if (error) throw error;
      setSaveMessage('Saved successfully!');
    } catch (err: any) {
      setSaveMessage('Failed to save: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 h-full flex flex-col overflow-hidden shadow-lg">
      <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/80 flex items-center justify-between">
        <h2 className="font-semibold text-slate-200">Measurements & Results</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${activeTab === 'table' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            Data Table
          </button>
          <button 
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${activeTab === 'graph' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            Graph & Results
          </button>
        </div>
      </div>
      
      {activeTab === 'table' ? (
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-auto">
          {/* Record Control */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex flex-wrap items-end gap-4 shadow-inner">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Ring Order (n)</label>
              <select 
                value={selectedRing} 
                onChange={e => setSelectedRing(Number(e.target.value))}
                className="bg-slate-800 text-slate-200 border border-slate-600 rounded px-3 py-1.5 text-sm outline-none w-28"
              >
                {ringsToMeasure.map(n => (
                  <option key={n} value={n}>Ring {n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Crosshair Side</label>
              <select 
                value={selectedSide} 
                onChange={e => setSelectedSide(e.target.value as Side)}
                className="bg-slate-800 text-slate-200 border border-slate-600 rounded px-3 py-1.5 text-sm outline-none w-32"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
               <span className="block text-xs text-slate-500 mb-1">Current Scale</span>
               <span className="text-emerald-400 font-mono text-lg font-bold">{state.instrument.microscopePosition.toFixed(2)} mm</span>
            </div>
            <button 
              onClick={handleRecord}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded font-medium transition-colors text-sm shadow-lg shadow-emerald-900/20"
            >
              Record Reading
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs text-slate-400 bg-slate-900 uppercase border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 bg-slate-800/50">Ring (n)</th>
                  <th className="px-4 py-3">Left (mm)</th>
                  <th className="px-4 py-3">Right (mm)</th>
                  {(!isExam || isSubmitted) && (
                    <>
                      <th className="px-4 py-3 bg-blue-900/10">Diameter D</th>
                      <th className="px-4 py-3 bg-amber-900/10">D² (mm²)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {ringData.map(row => (
                  <tr key={row.n} className="border-b border-slate-700/50 hover:bg-slate-750/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200 bg-slate-800/30">{row.n}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {row.leftReading !== null ? row.leftReading.toFixed(2) : <span className="text-slate-600">--</span>}
                      {row.leftReading !== null && (
                        <button onClick={() => handleDelete(row.n, 'left')} className="ml-2 text-red-500/50 hover:text-red-400 inline-block px-1" title="Delete">×</button>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {row.rightReading !== null ? row.rightReading.toFixed(2) : <span className="text-slate-600">--</span>}
                      {row.rightReading !== null && (
                        <button onClick={() => handleDelete(row.n, 'right')} className="ml-2 text-red-500/50 hover:text-red-400 inline-block px-1" title="Delete">×</button>
                      )}
                    </td>
                    {(!isExam || isSubmitted) && (
                      <>
                        <td className="px-4 py-3 font-mono text-xs text-blue-300 bg-blue-900/5">
                          {row.D !== null ? row.D.toFixed(3) : '--'}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-amber-300 bg-amber-900/5">
                          {row.D2 !== null ? row.D2.toFixed(3) : '--'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-5 flex flex-col items-center justify-center bg-slate-900 overflow-auto">
          {isExam && !isSubmitted ? (
            <div className="text-center bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-md shadow-xl">
              <h3 className="text-xl font-bold text-slate-200 mb-4">Exam Mode Active</h3>
              <p className="text-slate-400 mb-6">Intermediate calculations and results are hidden during an exam. Record all left and right measurements for the required rings, then submit to view your final score.</p>
              <button 
                onClick={() => dispatch({ type: 'SUBMIT_EXAM' } as any)}
                disabled={validDataPoints.length < 4}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2 rounded font-medium shadow-lg transition-colors w-full"
              >
                {validDataPoints.length < 4 ? `Need ${4 - validDataPoints.length} more complete rings to submit` : 'Submit Experiment'}
              </button>
            </div>
          ) : isExam && isSubmitted ? (
            <div className="w-full max-w-xl bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl flex flex-col gap-6">
              <div className="bg-slate-900/80 p-5 rounded-lg border border-slate-700 text-center">
                <h3 className="text-2xl font-bold text-slate-100 mb-2">Exam Results</h3>
                <div className="text-5xl font-black my-4 text-emerald-400">
                  {Math.max(0, 100 - (percentDiff > 5 ? 50 : percentDiff > 2 ? 20 : percentDiff > 1 ? 5 : 0))}%
                </div>
                <p className="text-slate-400">Experimental Wavelength: {lambdaResult.toFixed(1)} nm</p>
                <p className="text-slate-400">Target Wavelength: {REFERENCE_WAVELENGTH_NM.toFixed(1)} nm</p>
                <p className={`font-semibold mt-2 ${percentDiff <= 2 ? 'text-emerald-400' : percentDiff <= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                  Error Margin: {percentDiff.toFixed(2)}%
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={handleSaveToCloud}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : '💾 Save to Cloud History'}
                </button>
                {saveMessage && <p className="text-xs text-slate-400">{saveMessage}</p>}
              </div>

              <p className="text-center text-sm text-slate-500">Switch to the Data Table tab to review your calculated measurements.</p>
            </div>
          ) : validDataPoints.length < 2 ? (
            <div className="text-slate-400 max-w-sm text-center">
              <div className="text-4xl mb-4 opacity-50">📉</div>
              <p>Record measurements for at least two complete rings (both left and right sides) to plot the D² vs n graph and calculate the wavelength.</p>
            </div>
          ) : (
            <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-xl flex flex-col gap-6">
              
              <div className="h-64 w-full">
                <h3 className="text-slate-300 text-sm font-medium mb-4 text-center">D² vs Ring Number (n)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="ring" 
                      stroke="#94a3b8" 
                      label={{ value: 'Ring order (n)', position: 'insideBottom', offset: -15, fill: '#94a3b8' }} 
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      label={{ value: 'D² (mm²)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc', borderRadius: '8px' }}
                      formatter={(value: number) => [value.toFixed(3) + ' mm²', 'D²']}
                      labelFormatter={(label) => `Ring n = ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="dSquared" 
                      stroke="#fbbf24" 
                      strokeWidth={3} 
                      dot={{ r: 6, fill: '#fbbf24', stroke: '#1e293b', strokeWidth: 2 }} 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Final Wavelength Result</h3>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-slate-400 text-sm">Slope of graph (m)</span>
                  <span className="text-slate-300 font-mono text-sm">{calculateLinearFitSlope(validDataPoints)?.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-slate-400">Calculated Wavelength (λ = m / 4R)</span>
                  <span className="text-amber-400 font-bold text-xl">{lambdaResult > 0 ? `${lambdaResult.toFixed(1)} nm` : 'Error'}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-700 pt-3 mt-2">
                  <span className="text-slate-400">Error vs Sodium Reference (589.3 nm)</span>
                  <span className={`font-bold text-lg ${percentDiff <= 2 ? 'text-emerald-400' : percentDiff <= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {percentDiff.toFixed(2)}%
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
