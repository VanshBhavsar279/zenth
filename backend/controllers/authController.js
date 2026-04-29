import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const timingSafeCompare = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  try {
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword || !process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    const emailOk = String(email || '').trim().toLowerCase() === String(adminEmail).trim().toLowerCase();
    const passOk = timingSafeCompare(password || '', adminPassword);

    if (!emailOk || !passOk) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign({ id: 'admin', email: adminEmail }, process.env.JWT_SECRET, {
      expiresIn,
    });

    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };

    res.cookie('zenth_token', token, cookieOptions);

    res.json({ message: 'Logged in', email: adminEmail, token });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('zenth_token', {
    path: '/',
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
  res.json({ message: 'Logged out' });
};

export const me = (req, res) => {
  res.json({
    authenticated: true,
    email: req.admin?.email || process.env.ADMIN_EMAIL || '',
  });
};
