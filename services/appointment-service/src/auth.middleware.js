import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = header.replace(/^Bearer\s+/i, '');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwt');
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid/expired token' });
  }
}
