const USER_API = import.meta.env.VITE_USER_API_URL || 'http://localhost:4001';
const APPT_API = import.meta.env.VITE_APPT_API_URL || 'http://localhost:4002';

export async function login(email, password) {
  const r = await fetch(`${USER_API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!r.ok) throw new Error('Login failed');
  return r.json();
}

export async function registerUser(email, password, role, fullName) {
  const r = await fetch(`${USER_API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role, fullName })
  });
  if (!r.ok) throw new Error('Register failed');
  return r.json();
}

export async function getAppointments(token) {
  const r = await fetch(`${APPT_API}/api/appointments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!r.ok) throw new Error('Fetch appointments failed');
  return r.json();
}
