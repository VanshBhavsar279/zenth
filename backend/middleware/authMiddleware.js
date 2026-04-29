import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const cookieToken = req.cookies?.zenth_token;
  const header = req.headers?.authorization || '';
  const bearerToken = typeof header === 'string' && header.toLowerCase().startsWith('bearer ')
    ? header.slice('bearer '.length).trim()
    : null;
  const token = cookieToken || bearerToken;
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized' });
  }
};
