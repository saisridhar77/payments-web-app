import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Session } from '../session.js';

export default function Layout() {
  const navigate = useNavigate();
  const logout = () => { Session.clear(); navigate('/login', { replace: true }); };
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="inner container">
          <strong>Payments</strong>
          <button onClick={logout} style={{ background: 'transparent', border: 0, color: 'var(--text)' }}>Logout</button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <nav className="bottom-nav">
        <div className="inner container">
          <NavLink to="/scan">Scan</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/reset-pin/request">Reset PIN</NavLink>
        </div>
      </nav>
    </div>
  );
}


