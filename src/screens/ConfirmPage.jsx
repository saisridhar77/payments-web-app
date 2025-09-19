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
  const [consent, setConsent] = useState(false);

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
    <div className="page-center" style={{ background: 'linear-gradient(135deg, #1e253a 0%, #232b47 100%)', minHeight: '100vh' }}>
      <div
        className="container card-form"
        style={{
          background: 'rgba(19,26,42,0.98)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(91,140,255,0.10)',
          padding: 0,
          maxWidth: 420,
          width: '100%',
        }}
      >
        <h2 style={{ textAlign: 'center', margin: '0 0 12px 0', paddingTop: 24 }}>Confirm Payment</h2>
        <div className="card-panel" style={{ background: 'transparent', boxShadow: 'none', padding: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 16, color: '#a8b0c3' }}>Vendor</p>
            <strong style={{ fontSize: 20, color: '#e9edf7' }}>{shopName || vendorId}</strong>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 16, color: '#a8b0c3' }}>Amount</p>
            <strong style={{ fontSize: 22, color: '#5b8cff' }}>₹{amount}</strong>
          </div>
          <hr style={{ border: 0, borderTop: '1px solid #232b47', margin: '18px 0 18px 0' }} />
          <div style={{ margin: '0 0 18px 0', textAlign: 'left' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                style={{ marginTop: 2, accentColor: '#5b8cff' }}
              />
              <span>
                I agree to disclose my name and transaction details to SWD and give consent to SWD to deduct relevant balance from my account.
              </span>
            </label>
          </div>
          <button
            disabled={loading || !consent}
            onClick={pay}
            style={{
              width: '100%',
              marginTop: 8,
              background: loading || !consent ? '#243252' : 'var(--accent)',
              color: loading || !consent ? '#a8b0c3' : '#fff',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Processing...' : 'Pay now'}
          </button>
          {error && <p style={{ color: 'tomato', textAlign: 'center', marginTop: 14 }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}


