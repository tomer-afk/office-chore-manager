import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth.js';
import env from '../config/environment.js';

const googleClient = new OAuth2Client(env.google.clientId);

function setTokenCookies(res, accessToken, refreshToken) {
  const isProduction = env.nodeEnv === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const user = await User.create({ email, password, name });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create(user.id, refreshToken, expiresAt);
    setTokenCookies(res, accessToken, refreshToken);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await User.verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create(user.id, refreshToken, expiresAt);
    setTokenCookies(res, accessToken, refreshToken);
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar_url: user.avatar_url, weight_unit_preference: user.weight_unit_preference } });
  } catch (err) {
    next(err);
  }
}

export async function googleAuth(req, res, next) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.google.clientId,
    });
    const payload = ticket.getPayload();
    const user = await User.createFromGoogle({
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      avatarUrl: payload.picture,
    });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create(user.id, refreshToken, expiresAt);
    setTokenCookies(res, accessToken, refreshToken);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  const refreshTokenCookie = req.cookies?.refreshToken;
  if (refreshTokenCookie) {
    const stored = await RefreshToken.findByHash(refreshTokenCookie);
    if (stored) await RefreshToken.revoke(stored.id);
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  res.json({ message: 'Logged out' });
}

export async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function refreshAccessToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token required' });
    }
    const stored = await RefreshToken.findByHash(token);
    if (!stored) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    const user = await User.findById(stored.user_id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // Rotate refresh token
    await RefreshToken.revoke(stored.id);
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create(user.id, newRefreshToken, expiresAt);
    setTokenCookies(res, accessToken, newRefreshToken);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
