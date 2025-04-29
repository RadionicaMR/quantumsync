
// Store information about chakra balancing sessions
type ChakraBalanceSession = {
  personName: string;
  timestamp: number;
  balanced: boolean;
};

// Get all chakra balance sessions
export const getChakraBalanceSessions = (): ChakraBalanceSession[] => {
  const sessions = localStorage.getItem('chakraBalanceSessions');
  return sessions ? JSON.parse(sessions) : [];
};

// Add a new chakra balance session
export const addChakraBalanceSession = (personName: string) => {
  const sessions = getChakraBalanceSessions();
  
  // Add new session
  sessions.push({
    personName,
    timestamp: Date.now(),
    balanced: true,
  });
  
  // Save to localStorage
  localStorage.setItem('chakraBalanceSessions', JSON.stringify(sessions));
};

// Check if a person has had their chakras balanced recently
export const hasRecentBalancing = (personName: string): boolean => {
  if (!personName) return false;
  
  const sessions = getChakraBalanceSessions();
  const now = Date.now();
  
  // Check if there's a session for this person in the last 24 hours
  return sessions.some(session => 
    session.personName.toLowerCase() === personName.toLowerCase() && 
    (now - session.timestamp) < 24 * 60 * 60 * 1000
  );
};
