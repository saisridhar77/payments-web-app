import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const go = (path) => () => navigate(path);
  return (
    <div>
      <h2>Welcome</h2>
      <div className="home-grid">
        <div className="card-panel" onClick={go('/scan')} style={{ cursor: 'pointer' }}>
          <h3>Scan</h3>
          <p>Scan vendor QR to start payment</p>
        </div>
        <div className="card-panel" onClick={go('/transactions')} style={{ cursor: 'pointer' }}>
          <h3>Transactions</h3>
          <p>View your recent payments</p>
        </div>
        <div className="card-panel" onClick={go('/set-pin')} style={{ cursor: 'pointer' }}>
          <h3>Set PIN</h3>
          <p>Secure your payments with a PIN</p>
        </div>
        <div className="card-panel" onClick={go('/reset-pin/request')} style={{ cursor: 'pointer' }}>
          <h3>Reset PIN</h3>
          <p>Request OTP to reset your PIN</p>
        </div>
      </div>
    </div>
  );
}


