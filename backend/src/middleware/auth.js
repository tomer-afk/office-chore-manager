const jwt = require('jsonwebtoken');
const config = require('../config/environment');

/**
 * Middleware to verify JWT token from cookies
 */
const authenticateToken = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
      });
    }

    // Verify token
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: 'Invalid or expired token',
        });
      }

      // Attach user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };

      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
    });
  }
};

/**
 * Generate access token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
