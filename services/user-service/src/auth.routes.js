import { Router } from 'express';
import { register, login } from './auth.controller.js';
import { verifyJWT } from './auth.middleware.js';
import { pool, redis } from './db.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/me', verifyJWT, (req, res) => res.json({ user: req.user }));

router.get('/metrics/users-count', async (_req, res) => {
  const cached = await redis.get('users:count');
  if (cached) return res.json({ count: Number(cached), cached: true });
  const r = await pool.query('SELECT COUNT(*)::int as count FROM users');
  await redis.set('users:count', r.rows[0].count, 'EX', 60);
  res.json({ count: r.rows[0].count, cached: false });
});

export default router;
