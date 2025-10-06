import { createContext, useContext, useState, ReactNode } from 'react';

interface SessionContextType {
  shouldRecordSession: boolean;
  setShouldRecordSession: (value: boolean) => void;
  currentPatientId: string | null;
  setCurrentPatientId: (id: string | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [shouldRecordSession, setShouldRecordSession] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);

  return (
    <SessionContext.Provider
      value={{
        shouldRecordSession,
        setShouldRecordSession,
        currentPatientId,
        setCurrentPatientId,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
