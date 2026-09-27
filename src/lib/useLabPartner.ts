import { useEffect, useState } from 'react';
import { useExperiment } from '../stores/experimentStore';
import { supabase } from './supabase';

export function useLabPartner() {
  const { state, dispatch } = useExperiment();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [partnerCount, setPartnerCount] = useState(0);

  const isPartnerMode = state.settings.mode === 'partner';

  useEffect(() => {
    if (!supabase || !isPartnerMode || !sessionId) return;

    const channel = supabase.channel(`lab-session-${sessionId}`, {
      config: { presence: { key: isHost ? 'host' : 'guest' } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setPartnerCount(Object.keys(state).length - 1); // Exclude self
      })
      .on('broadcast', { event: 'sync-state' }, ({ payload }) => {
        if (!isHost) {
          dispatch({ type: 'SYNC_STATE', payload });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({});
        }
      });

    // If host, sync state periodically or on change
    let syncInterval: any;
    if (isHost) {
      syncInterval = setInterval(() => {
        channel.send({
          type: 'broadcast',
          event: 'sync-state',
          payload: {
            instrument: state.instrument,
            measurements: state.measurements,
            settings: { ...state.settings, mode: 'partner' } // Don't let guests change mode
          }
        });
      }, 500); // Sync every 500ms
    }

    return () => {
      if (syncInterval) clearInterval(syncInterval);
      supabase?.removeChannel(channel);
    };
  }, [isPartnerMode, sessionId, isHost, state, dispatch]);

  const createSession = () => {
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionId(newId);
    setIsHost(true);
  };

  const joinSession = (id: string) => {
    setSessionId(id.toUpperCase());
    setIsHost(false);
  };

  const leaveSession = () => {
    setSessionId(null);
    setIsHost(false);
    dispatch({ type: 'SET_MODE', payload: 'practice' });
  };

  return { sessionId, isHost, partnerCount, createSession, joinSession, leaveSession };
}
