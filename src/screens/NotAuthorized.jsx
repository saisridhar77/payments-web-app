import { Link } from 'react-router-dom';
import { Session } from '../session.js';

export default function NotAuthorized() {
  return (
    <div style={{ maxWidth: 560, margin: '40px auto', padding: 16 }}>
      <h2>Not authorized for payments</h2>
      <p>Your account is marked as guest and cannot make payments.</p>
      <div style={{ marginTop: 16 }}>
        <Link to="/login" onClick={() => Session.clear()}>Return to Login</Link>
      </div>
    </div>
  );
}


