const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');

class JwtService {
  constructor(secret, expiresIn, cookieName = 'token') {
    this.secret = secret;
    this.expiresIn = expiresIn;
    this.cookieName = cookieName;
  }

  generateToken(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return error;
    }
  }

  setTokenCookie(res, token) {
    res.cookie(this.cookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }

  clearTokenCookie(res) {
    res.clearCookie(this.cookieName);
  }

  getTokenFromCookies(req) {
    return req.cookies[this.cookieName];
  }

  getDecode(token) {
    return jwt.decode(token);
  }
}

module.exports = JwtService;
