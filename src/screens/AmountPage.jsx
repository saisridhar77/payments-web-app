import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AmountPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const vendorId = state?.vendorId;
  const shopName = state?.shopName;

  if (!vendorId) return <p style={{ padding: 16 }}>Missing vendor. Go back to scan.</p>;

  const next = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    navigate('/pin', { state: { vendorId, shopName, amount: value }, replace: true });
  };

  return (
    <div className="page-center">
      <div className="container card-form">
        <h2 style={{ textAlign: 'center' }}>Enter Amount</h2>
        <div className="card-panel">
          {shopName && <p style={{ marginTop: 0, textAlign: 'center' }}>Paying to: <strong>{shopName}</strong></p>}
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '80%', fontSize: 18 }}
          />
          <button style={{width: '100%' }} onClick={next} disabled={!amount}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}


