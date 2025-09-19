import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function ResetPinVerifyPage() {
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    setError('');
    try {
      await api.verifyOtp({ otp, newPin: pin });
      navigate('/scan', { replace: true });
    } catch (e) {
      setError(e?.message || 'Failed to verify OTP');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h2>Reset PIN: Verify OTP</h2>
      <div className="card-panel">
        <input
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ width: '100%', fontSize: 18, marginBottom: 8 }}
        />
        <input
          type="password"
          inputMode="numeric"
          placeholder="6-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={6}
          style={{ width: '100%', fontSize: 18 }}
        />
        <button style={{ marginTop: 12, width: '100%' }} onClick={submit} disabled={!otp || pin.length !== 6}>
          Save new PIN
        </button>
        {error && <p style={{ color: 'tomato' }}>{error}</p>}
      </div>
    </div>
  );
}


