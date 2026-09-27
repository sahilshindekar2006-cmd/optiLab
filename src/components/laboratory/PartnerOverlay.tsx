import { useState } from 'react';
import { useLabPartner } from '../../lib/useLabPartner';
import { useExperiment } from '../../stores/experimentStore';

export function PartnerOverlay() {
  const { state } = useExperiment();
  const { sessionId, isHost, partnerCount, createSession, joinSession, leaveSession } = useLabPartner();
  const [joinInput, setJoinInput] = useState('');

  if (state.settings.mode !== 'partner') return null;

  return (
    <div className="fixed top-20 right-6 w-80 bg-slate-800 border-2 border-indigo-500 rounded-xl shadow-2xl p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-indigo-400">Lab Partner Mode</h3>
      </div>

      {!sessionId ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-300">Collaborate with another student in real-time.</p>
          <button 
            onClick={createSession}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Create New Session (Host)
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-600"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase">Or Join</span>
            <div className="flex-grow border-t border-slate-600"></div>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Session Code" 
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 uppercase"
            />
            <button 
              onClick={() => joinSession(joinInput)}
              disabled={!joinInput}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-center">
            <p className="text-xs text-slate-400 mb-1">Session Code</p>
            <p className="text-2xl font-mono text-indigo-400 font-bold tracking-widest">{sessionId}</p>
          </div>
          
          <div className="flex items-center justify-between bg-slate-800 p-2 rounded">
            <span className="text-sm text-slate-300">Status</span>
            <span className={`text-xs px-2 py-1 rounded-full ${partnerCount > 0 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
              {partnerCount > 0 ? 'Partner Connected' : 'Waiting...'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-800 p-2 rounded">
            <span className="text-sm text-slate-300">Role</span>
            <span className="text-xs text-indigo-300 font-semibold">{isHost ? 'Host (Controlling)' : 'Guest (Viewing)'}</span>
          </div>

          <button 
            onClick={leaveSession}
            className="mt-2 w-full bg-slate-700 hover:bg-red-900/50 hover:text-red-400 text-slate-300 py-2 rounded-lg font-medium transition-colors border border-slate-600 hover:border-red-800/50"
          >
            Leave Session
          </button>
        </div>
      )}
    </div>
  );
}
