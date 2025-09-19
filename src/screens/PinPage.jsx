import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function PinPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const vendorId = state?.vendorId;
  const amount = state?.amount;
  const shopName = state?.shopName;

  useEffect(() => {
    (async () => {
      try {
        const res = await api.hasPin();
        if (!res?.hasPin) navigate('/set-pin', { replace: true });
      } catch (e) {
        setError(e?.message || 'Failed to check pin');
      }
    })();
  }, [navigate]);

  if (!vendorId || !amount) return <p style={{ padding: 16 }}>Missing payment context.</p>;

  const next = () => {
    if (!pin || pin.length !== 6) return;
    navigate('/confirm', { state: { vendorId, amount, pin, shopName }, replace: true });
  };

  return (
    <div className="page-center">
      <div className="container card-form">
        <h2 style={{ textAlign: 'center' }}>Enter PIN</h2>
        <div className="card-panel">
          <p style={{ marginTop: 0, textAlign: 'center' }}>Paying {amount} to {shopName || 'vendor'}</p>
          <input
            type="password"
            inputMode="numeric"
            placeholder="6-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={6}
            style={{ width: '100%', fontSize: 18 }}
          />
          <button style={{ marginTop: 16, width: '100%' }} onClick={next} disabled={pin.length !== 6}>
            Continue
          </button>
          {error && <p style={{ color: 'tomato' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}


