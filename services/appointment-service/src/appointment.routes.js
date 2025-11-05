import { Router } from 'express';
import { pool, redis } from './db.js';
import { requireAuth } from './auth.middleware.js';

const router = Router();

router.post('/appointments', requireAuth, async (req, res) => {
  try {
    const { doctorId, patientId, scheduledAt, reason } = req.body;
    if (!doctorId || !patientId || !scheduledAt) {
      return res.status(400).json({ message: 'doctorId, patientId, scheduledAt required' });
    }
    const result = await pool.query(
      `INSERT INTO appointments (doctor_id, patient_id, scheduled_at, reason)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [doctorId, patientId, scheduledAt, reason || null]
    );
    await redis.del(`appointments:user:${patientId}`);
    await redis.del(`appointments:doctor:${doctorId}`);
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/appointments', requireAuth, async (req, res) => {
  try {
    let q = `SELECT * FROM appointments ORDER BY scheduled_at DESC`;
    let params = [];
    let cacheKey = 'appointments:all';

    if (req.user.role === 'patient') {
      q = `SELECT a.* FROM appointments a
           JOIN patients p ON p.id = a.patient_id
           WHERE p.user_id = $1
           ORDER BY a.scheduled_at DESC`;
      params = [req.user.id];
      cacheKey = `appointments:user:${req.user.id}`;
    } else if (req.user.role === 'doctor') {
      q = `SELECT a.* FROM appointments a
           JOIN doctors d ON d.id = a.doctor_id
           WHERE d.user_id = $1
           ORDER BY a.scheduled_at DESC`;
      params = [req.user.id];
      cacheKey = `appointments:doctor:${req.user.id}`;
    }

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const result = await pool.query(q, params);
    await redis.set(cacheKey, JSON.stringify(result.rows), 'EX', 30);
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
