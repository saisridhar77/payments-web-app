import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config.js';
import { Session } from './session.js';
import Layout from './components/Layout.jsx';
import LoginPage from './screens/LoginPage.jsx';
import NotAuthorized from './screens/NotAuthorized.jsx';
import Home from './screens/Home.jsx';
import QRScanPage from './screens/QRScanPage.jsx';
import AmountPage from './screens/AmountPage.jsx';
import PinPage from './screens/PinPage.jsx';
import ConfirmPage from './screens/ConfirmPage.jsx';
import SetPinPage from './screens/SetPinPage.jsx';
import ResetPinRequestPage from './screens/ResetPinRequestPage.jsx';
import ResetPinVerifyPage from './screens/ResetPinVerifyPage.jsx';
import TransactionsPage from './screens/TransactionsPage.jsx';

const Guard = () => {
  if (!Session.token) return <Navigate to="/login" replace />;
  if (Session.isGuest()) return <Navigate to="/not-authorized" replace />;
  return <Outlet />;
};

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/home" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/not-authorized', element: <NotAuthorized /> },
  {
    element: <Guard />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/home', element: <Home /> },
          { path: '/scan', element: <QRScanPage /> },
          { path: '/amount', element: <AmountPage /> },
          { path: '/pin', element: <PinPage /> },
          { path: '/confirm', element: <ConfirmPage /> },
          { path: '/set-pin', element: <SetPinPage /> },
          { path: '/reset-pin/request', element: <ResetPinRequestPage /> },
          { path: '/reset-pin/verify', element: <ResetPinVerifyPage /> },
          { path: '/transactions', element: <TransactionsPage /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}


