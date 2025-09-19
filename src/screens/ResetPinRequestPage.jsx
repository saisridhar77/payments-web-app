import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function ResetPinRequestPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const request = async () => {
    setError('');
    try {
      await api.requestOtp();
      setMessage('OTP sent');
      setTimeout(() => navigate('/reset-pin/verify', { replace: true }), 800);
    } catch (e) {
      setError(e?.message || 'Failed to request OTP');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h2>Reset PIN: Request OTP</h2>
      <div className="card-panel">
        <button onClick={request} style={{ width: '100%' }}>Send OTP</button>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'tomato' }}>{error}</p>}
      </div>
    </div>
  );
}


