import { useState, useEffect } from 'react';
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
  const [pendingStart, setPendingStart] = useState(false);
  
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
  } = useBalanceChakras(state.personName || '', state.chakraStates);
  
  const hasChakraStates = state.chakraStates && state.chakraStates.some(c => c.state);

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
  }, [completed, currentPatientId]);

  const handleStartClick = () => {
    setShowSessionDialog(true);
    setPendingStart(true);
  };

  const handleSessionConfirm = (patientId: string | null) => {
    setCurrentPatientId(patientId);
    if (pendingStart) {
      startBalancing();
      setPendingStart(false);
    }
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
