import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, redis } from './db.js';

export async function register(req, res) {
  try {
    const { email, password, role = 'patient', fullName } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });

    const hash = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role`,
      [email.toLowerCase(), hash, role]
    );
    const user = userResult.rows[0];

    if (role === 'doctor') {
      await pool.query(`INSERT INTO doctors (user_id, full_name) VALUES ($1,$2)`, [user.id, fullName || 'Doctor User']);
    } else {
      await pool.query(`INSERT INTO patients (user_id, full_name) VALUES ($1,$2)`, [user.id, fullName || 'Patient User']);
    }

    await redis.del('users:count');
    return res.status(201).json({ message: 'Registered', user });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Email already registered' });
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });

    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email.toLowerCase()]);
    if (result.rowCount === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'supersecretjwt',
      { expiresIn: '1d' }
    );

    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
