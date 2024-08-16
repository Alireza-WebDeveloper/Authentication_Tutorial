const JwtService = require('../modules/service/jwt.service');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError.Unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];

    const jwtService = new JwtService(
      '4824C3@c1732623^@$5313',
      '24h',
      'access_token'
    );
    const decoded = jwtService.verifyToken(token);

    if (!decoded) {
      throw createHttpError.Unauthorized('Invalid token');
    }

    if (Date.now() >= decoded.exp * 1000) {
      throw createHttpError.Unauthorized('Token has expired');
    }

    req.user = decoded.user_id;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticateUser;

/*

const date = new Date(decoded.exp * 1000);
    const dateString = date.toLocaleString();
    console.log(dateString);

    */
