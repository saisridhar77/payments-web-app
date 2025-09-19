import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function SetPinPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setError('');
    try {
      await api.setPin(pin);
      setOk(true);
      setTimeout(() => navigate('/scan', { replace: true }), 800);
    } catch (e) {
      setError(e?.message || 'Failed to set PIN');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h2>Set PIN</h2>
      <div className="card-panel">
        <input
          type="password"
          inputMode="numeric"
          placeholder="6-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={6}
          style={{ width: '100%', fontSize: 18 }}
        />
        <button style={{ marginTop: 12, width: '100%' }} onClick={submit} disabled={pin.length !== 6}>
          Save PIN
        </button>
        {ok && <p style={{ color: 'green' }}>PIN set</p>}
        {error && <p style={{ color: 'tomato' }}>{error}</p>}
      </div>
    </div>
  );
}


