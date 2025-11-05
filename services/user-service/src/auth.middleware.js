import jwt from 'jsonwebtoken';

export function verifyJWT(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = header.replace(/^Bearer\s+/i, '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwt');
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid/expired token' });
  }
}
