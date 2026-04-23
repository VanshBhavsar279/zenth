import jwt from 'jsonwebtoken';

/** Sets req.admin if valid JWT cookie is present; does not block otherwise */
export const optionalAuthMiddleware = (req, res, next) => {
  const token = req.cookies?.zenth_token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: decoded.id, email: decoded.email };
  } catch {
    /* ignore invalid token for public routes */
  }
  next();
};
