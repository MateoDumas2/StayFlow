import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { saveSession } from '@/lib/auth-utils';

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

const CHECK_USERNAME = gql`
  query CheckUsername($username: String!) {
    checkUsername(username: $username) {
      available
      suggestions
    }
  }
`;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('GUEST');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  const [register, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);
  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  
  const [checkUsername] = useLazyQuery(CHECK_USERNAME, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (!data.checkUsername.available) {
        setUsernameError(t('auth.username_taken') || 'Nombre de usuario ya existe');
        setUsernameSuggestions(data.checkUsername.suggestions);
      } else {
        setUsernameError('');
        setUsernameSuggestions([]);
      }
    }
  });

  // Check username availability
  React.useEffect(() => {
    if (mode === 'register' && name.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkUsername({ variables: { username: name } });
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setUsernameError('');
      setUsernameSuggestions([]);
    }
  }, [name, mode, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'register' && usernameError) {
      return;
    }

    try {
      if (mode === 'register') {
        const { data } = await register({
          variables: {
            input: { email, password, name, role },
          },
        });
        saveSession(data.register.token, data.register.user);
        window.location.reload();
        onClose();
      } else {
        const { data } = await login({
          variables: {
            input: { email, password },
          },
        });
        saveSession(data.login.token, data.login.user);
        window.location.reload();
        onClose();
      }
    } catch (err: any) {
      // Error handling without console spam
      if (err.networkError) {
        // network error
      }
      if (err.graphQLErrors) {
        // graphql errors
      }
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'login' ? t('auth.welcome_back') : t('auth.create_account')}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.name_label')}</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow ${usernameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                        placeholder={t('auth.name_placeholder')}
                        required
                      />
                      {usernameError && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                          <p className="text-xs text-red-500 mb-1 flex items-center gap-1">
                            <span>⚠️</span> {usernameError}
                          </p>
                          {usernameSuggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs text-gray-500 py-1">Sugerencias:</span>
                              {usernameSuggestions.map(suggestion => (
                                <button
                                  key={suggestion}
                                  type="button"
                                  onClick={() => setName(suggestion)}
                                  className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded transition-colors font-medium"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.role_label')}</label>
                      <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${role === 'GUEST' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <input 
                            type="radio" 
                            name="role" 
                            value="GUEST" 
                            checked={role === 'GUEST'} 
                            onChange={() => setRole('GUEST')}
                            className="hidden"
                          />
                          <span>🎒 {t('auth.role_guest')}</span>
                        </label>
                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${role === 'HOST' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <input 
                            type="radio" 
                            name="role" 
                            value="HOST" 
                            checked={role === 'HOST'} 
                            onChange={() => setRole('HOST')}
                            className="hidden"
                          />
                          <span>🏠 {t('auth.role_host')}</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email_label')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                    placeholder={t('auth.email_placeholder')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password_label')}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={registerLoading || loginLoading}
                >
                  {registerLoading || loginLoading ? t('auth.processing') : (mode === 'login' ? t('auth.login_link') : t('auth.register_link'))}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                {mode === 'login' ? (
                  <>
                    {t('auth.no_account')}{' '}
                    <button
                      onClick={() => setMode('register')}
                      className="text-primary font-medium hover:underline"
                    >
                      {t('auth.register_link')}
                    </button>
                  </>
                ) : (
                  <>
                    {t('auth.already_have_account')}{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="text-primary font-medium hover:underline"
                    >
                      {t('auth.login_link')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
