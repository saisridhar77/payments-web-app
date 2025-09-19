import Cookies from 'js-cookie';
import { API_BASE } from './config.js';

const jsonHeaders = () => ({
  'Content-Type': 'application/json; charset=UTF-8',
});

const authHeaders = () => {
  const token = Cookies.get('access_token');
  return {
    ...jsonHeaders(),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handle = async (res) => {
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) {
    const message = body?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
};

export const api = {
  async auth(googleIdToken) {
    const res = await fetch(`/api/login/student`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ token: googleIdToken }),
    });
    return handle(res);
  },

  async hasPin() {
    const res = await fetch(`/api/student/has-pin`, {
      method: 'GET',
      headers: authHeaders(),
    });
    return handle(res); // expected { hasPin: boolean }
  },

  async setPin(pin) {
    const res = await fetch(`/api/student/set-pin`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ pin }),
    });
    return handle(res);
  },

  async validateVendor(vendorId) {
    const res = await fetch(`/api/vendor?vendorId=${encodeURIComponent(vendorId)}`, {
      method: 'GET',
      headers: authHeaders(),
    });
    return handle(res); // expected { shopName }
  },

  async makePayment({ vendorId, amount, pin, deviceId }) {
    const res = await fetch(`/api/transaction`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ vendorId, amount, pin, deviceId }),
    });
    return handle(res);
  },

  async requestOtp() {
    const res = await fetch(`/api/student/reset-pin/request-otp`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return handle(res);
  },

  async verifyOtp({ otp, newPin }) {
    const res = await fetch(`/api/student/reset-pin/verify-otp`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ otp, newPin }),
    });
    return handle(res);
  },

  async transactions() {
    const res = await fetch(`/api/student/transactions`, {
      method: 'GET',
      headers: authHeaders(),
    });
    return handle(res);
  },
};


