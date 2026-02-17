import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import ChakraFigure from '@/components/quantum/ChakraFigure';
import BalanceChakrasHeader from '@/components/balance/BalanceChakrasHeader';
import PersonNameInput from '@/components/balance/PersonNameInput';
import BalanceOptions from '@/components/balance/BalanceOptions';
import ChakraResults from '@/components/balance/ChakraResults';
import DurationControl from '@/components/balance/DurationControl';
import ProgressDisplay from '@/components/balance/ProgressDisplay';
import CompletionMessage from '@/components/balance/CompletionMessage';
import BalanceControls from '@/components/balance/BalanceControls';
import { useBalanceChakras } from '@/hooks/useBalanceChakras';
import { SessionRecordDialog } from '@/components/session/SessionRecordDialog';
import { useSessionRecording } from '@/hooks/useSessionRecording';
import { useSession } from '@/context/SessionContext';
import { useLanguage } from '@/context/LanguageContext';
import { useUsageTracking } from '@/hooks/useUsageTracking';

interface LocationState {
  personName?: string;
  chakraStates?: Array<{
    name: string;
    state: string | null;
  }>;
}

const BalanceChakras = () => {
  const location = useLocation();
  const state = location.state as LocationState || {};
  const { recordSession } = useSessionRecording();
  const { currentPatientId, setCurrentPatientId } = useSession();
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const { trackSessionStart, trackSessionEnd } = useUsageTracking();
  const chakraStartTimeRef = useRef<Date | null>(null);
  
  // Merge repeat session data with location state
  const personNameFromState = state.personName || '';
  const chakraStatesFromState = state.chakraStates || (location.state as any)?.sessionData?.chakraStates;

  const {
    personName,
    setPersonName,
    duration,
    setDuration,
    isPlaying,
    currentChakra,
    progress,
    completed,
    balanceOption,
    setBalanceOption,
    startBalancing,
    stopBalancing,
    navigateToDiagnose,
    currentFrequency
  } = useBalanceChakras(personNameFromState, chakraStatesFromState);
  
  const hasChakraStates = chakraStatesFromState && chakraStatesFromState.some((c: any) => c.state);

  // Handle repeat session data
  useEffect(() => {
    if ((location.state as any)?.repeatSession && (location.state as any)?.sessionData) {
      const sessionData = (location.state as any).sessionData;
      if (sessionData.balanceOption) {
        setBalanceOption(sessionData.balanceOption);
      }
      if (sessionData.duration) {
        setDuration([sessionData.duration]);
      }
    }
  }, []);

  // Handle session recording when completing
  useEffect(() => {
    if (completed && currentPatientId) {
      const sessionData = {
        balanceOption,
        duration: duration[0],
        chakraStates: state.chakraStates || [],
      };
      recordSession(currentPatientId, 'balance_chakras', sessionData);
      setCurrentPatientId(null);
    }
    if (completed && chakraStartTimeRef.current) {
      const actualDuration = Math.floor((new Date().getTime() - chakraStartTimeRef.current.getTime()) / 1000);
      trackSessionEnd({ module: 'balance_chakras', actualDuration, protocolName: balanceOption });
      chakraStartTimeRef.current = null;
    }
  }, [completed, currentPatientId]);

  // CRITICAL: Start balancing IMMEDIATELY on click to preserve user gesture chain
  // for Safari AudioContext. Show session dialog non-blocking afterward.
  const handleStartClick = () => {
    startBalancing();
    chakraStartTimeRef.current = new Date();
    trackSessionStart({
      module: 'balance_chakras',
      protocolName: balanceOption,
      isPreset: true,
      configuredDuration: duration[0],
      metadata: { personName },
    });
    setShowSessionDialog(true);
  };

  const handleSessionConfirm = (patientId: string | null) => {
    setCurrentPatientId(patientId);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 max-w-3xl mx-auto">
            <BalanceChakrasHeader personName={personName} />
            
            <PersonNameInput 
              personName={personName}
              setPersonName={setPersonName}
              isPlaying={isPlaying}
            />
            
            <BalanceOptions 
              balanceOption={balanceOption}
              setBalanceOption={setBalanceOption}
              isPlaying={isPlaying}
            />
            
            {hasChakraStates && balanceOption === 'blocked' && (
              <ChakraResults chakraStates={state.chakraStates || []} />
            )}
            
            <DurationControl 
              duration={duration}
              setDuration={setDuration}
              isPlaying={isPlaying}
            />
            
            <ChakraFigure currentChakra={currentChakra} />
            
            <ProgressDisplay 
              isPlaying={isPlaying}
              currentChakra={currentChakra}
              progress={progress}
              frequency={currentFrequency}
            />
            
            <CompletionMessage completed={completed} />
            
            <BalanceControls 
              isPlaying={isPlaying}
              completed={completed}
              personName={personName}
              onStart={handleStartClick}
              onStop={stopBalancing}
              onNavigate={navigateToDiagnose}
            />
          </Card>

          <SessionRecordDialog
            open={showSessionDialog}
            onOpenChange={setShowSessionDialog}
            onConfirm={handleSessionConfirm}
            sessionType="balance_chakras"
          />
        </motion.div>
      </div>
    </Layout>
  );
};

export default BalanceChakras;
