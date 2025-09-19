import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../api.js';

function getDeviceId() {
  // Web fallback device identifier (non-unique): userAgent + platform
  const ua = navigator.userAgent || 'unknown';
  const platform = navigator.platform || 'web';
  return `${platform}:${ua.substring(0, 60)}`;
}

export default function ConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const vendorId = state?.vendorId;
  const amount = state?.amount;
  const pin = state?.pin;
  const shopName = state?.shopName;

  if (!vendorId || !amount || !pin) return <p style={{ padding: 16 }}>Missing payment context.</p>;

  const pay = async () => {
    setLoading(true);
    setError('');
    try {
      const deviceId = getDeviceId();
      await api.makePayment({ vendorId, amount, pin, deviceId });
      navigate('/transactions', { replace: true });
    } catch (e) {
      setError(e?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="container card-form">
        <h2 style={{ textAlign: 'center' }}>Confirm Payment</h2>
        <div className="card-panel">
          <p style={{ textAlign: 'center' }}>Vendor: <strong>{shopName || vendorId}</strong></p>
          <p style={{ textAlign: 'center' }}>Amount: <strong>{amount}</strong></p>
          <button disabled={loading} onClick={pay} style={{ width: '100%' }}>
            {loading ? 'Processing...' : 'Pay now'}
          </button>
          {error && <p style={{ color: 'tomato' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}


