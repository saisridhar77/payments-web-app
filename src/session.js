import Cookies from 'js-cookie';

export const Session = {
  set({ accessToken, userType }) {
    if (accessToken) Cookies.set('access_token', accessToken, { sameSite: 'Lax' });
    if (userType) Cookies.set('user_type', userType, { sameSite: 'Lax' });
  },
  clear() {
    Cookies.remove('access_token');
    Cookies.remove('user_type');
  },
  get token() {
    return Cookies.get('access_token') || null;
  },
  get userType() {
    return Cookies.get('user_type') || null;
  },
  isGuest() {
    return (Cookies.get('user_type') || 'guest') === 'guest';
  },
};


