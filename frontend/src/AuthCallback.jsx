import { useEffect, useState } from 'react';
import { authService } from './services/auth.service';

export default function AuthCallback({ onAuthSuccess, onAuthError }) {
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const onboarding = params.get('onboarding');
    const oauthError = params.get('error');

    if (oauthError) {
      const msg = oauthError === 'oauth'
        ? 'Google sign-in was cancelled or failed. Please try again.'
        : `Google sign-in error: ${oauthError}`;
      setErrorMsg(msg);
      window.history.replaceState({}, document.title, '/');
      if (onAuthError) {
        setTimeout(() => onAuthError(msg), 1500);
      }
      return;
    }

    if (!token) {
      const msg = 'No authentication token received from Google. Please try logging in again.';
      setErrorMsg(msg);
      window.history.replaceState({}, document.title, '/');
      if (onAuthError) {
        setTimeout(() => onAuthError(msg), 1500);
      }
      return;
    }

    // 1. Immediately store token in localStorage
    localStorage.setItem('fitoglobe_token', token);

    // 2. Immediately clean query string from address bar for security
    window.history.replaceState({}, document.title, '/');

    // 3. Fetch user profile to establish full session matching manual login
    authService.getMe()
      .then((user) => {
        if (!user) {
          throw new Error('Unable to load user profile');
        }
        const needsOnboard = onboarding === 'true' || !user.country;
        if (onAuthSuccess) {
          onAuthSuccess(user, needsOnboard);
        }
      })
      .catch((err) => {
        console.error('Failed to complete Google OAuth session:', err);
        localStorage.removeItem('fitoglobe_token');
        localStorage.removeItem('fitoglobe_user');
        const msg = err.response?.data?.message || 'Authentication failed. Please try logging in again.';
        setErrorMsg(msg);
        if (onAuthError) {
          setTimeout(() => onAuthError(msg), 1500);
        }
      });
  }, [onAuthSuccess, onAuthError]);

  return (
    <div style={{ background: '#030308', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'DM Sans, sans-serif', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        {errorMsg ? (
          <>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1, color: '#FF5050', marginBottom: 8 }}>
              Sign-in Failed
            </div>
            <div style={{ fontSize: 14, color: '#aaa', lineHeight: 1.5 }}>
              {errorMsg}
            </div>
          </>
        ) : (
          <>
            <div style={{ width: 44, height: 44, border: '3px solid rgba(200, 255, 0, 0.2)', borderTopColor: '#C8FF00', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: 1.5, color: '#C8FF00', marginBottom: 6 }}>
              Signing you in...
            </div>
            <div style={{ fontSize: 13, color: '#888' }}>
              Setting up your fitness dashboard
            </div>
          </>
        )}
      </div>
    </div>
  );
}