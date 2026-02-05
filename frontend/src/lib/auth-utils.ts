export interface StoredSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  lastActive: number;
}

const SESSIONS_KEY = 'sf_sessions';
const TOKEN_KEY = 'token';

export const getSessions = (): StoredSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveSession = (token: string, user: any) => {
  if (typeof window === 'undefined') return;
  
  // 1. Set as active token
  localStorage.setItem(TOKEN_KEY, token);

  // 2. Update sessions list
  const sessions = getSessions();
  const existingIndex = sessions.findIndex(s => s.user.id === user.id);
  
  const newSession: StoredSession = {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    },
    lastActive: Date.now()
  };

  if (existingIndex >= 0) {
    sessions[existingIndex] = newSession;
  } else {
    sessions.push(newSession);
  }

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const switchSession = (token: string) => {
  if (typeof window === 'undefined') return;
  
  const sessions = getSessions();
  const session = sessions.find(s => s.token === token);
  
  if (session) {
    localStorage.setItem(TOKEN_KEY, token);
    // Update last active
    session.lastActive = Date.now();
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    window.location.reload();
  }
};

export const removeSession = (tokenToRemove: string) => {
  if (typeof window === 'undefined') return;

  let sessions = getSessions();
  sessions = sessions.filter(s => s.token !== tokenToRemove);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

  // If we removed the active token, try to switch to another one
  const activeToken = localStorage.getItem(TOKEN_KEY);
  if (activeToken === tokenToRemove) {
    if (sessions.length > 0) {
      // Switch to the most recently active
      const nextSession = sessions.sort((a, b) => b.lastActive - a.lastActive)[0];
      localStorage.setItem(TOKEN_KEY, nextSession.token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    window.location.reload();
  }
};

export const getCurrentSession = (): StoredSession | undefined => {
  if (typeof window === 'undefined') return undefined;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return undefined;
  return getSessions().find(s => s.token === token);
};
