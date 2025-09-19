// Centralized config for API and Google OAuth
// Provide environment variables in a .env file:
// VITE_API_BASE=https://your-api.example.com
// VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id

export const API_BASE = import.meta.env.VITE_API_BASE;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!API_BASE) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_BASE is not set. Set it in .env');
}


