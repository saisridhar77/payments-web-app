import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { api } from '../api.js';
import { Session } from '../session.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (Session.token && !Session.isGuest()) {
      navigate('/scan', { replace: true });
    }
  }, [navigate]);

  const onSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) throw new Error('No Google credential');

      // Optional: read profile info if needed
      try { jwtDecode(idToken); } catch {}

      const body = await api.auth(idToken);
      const returnedToken = body?.accessToken;
      const userType = returnedToken ? 'normal' : 'guest';

      Session.set({ accessToken: returnedToken || '', userType });

      if (userType === 'guest') {
        navigate('/not-authorized', { replace: true });
        return;
      }

      // After auth, check if user has a PIN and route accordingly
      try {
        const has = await api.hasPin();
        if (has?.hasPin) navigate('/scan', { replace: true });
        else navigate('/set-pin', { replace: true });
      } catch {
        navigate('/scan', { replace: true });
      }
    } catch (e) {
      setError(e?.message || 'Login failed');
    }
  };

  const onError = () => setError('Google sign-in failed');

  return (
    <div className="container" style={{ maxWidth: 520, marginTop: 56 }}>
      <div className="card-panel" style={{ textAlign: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Sign in to Payments</h2>
        <p style={{ color: 'var(--muted)' }}>Use your Google account to continue</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <GoogleLogin onSuccess={onSuccess} onError={onError} useOneTap shape="pill" text="continue_with" />
        </div>
        {error && <p style={{ color: 'tomato', marginTop: 12 }}>{error}</p>}
      </div>
    </div>
  );
}


