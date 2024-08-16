// !! Service Module
const createHttpError = require('http-errors');
const JwtService = require('../../modules/service/jwt.service');
const HashService = require('../../modules/service/hash.service');
const UserModel = require('../../model/user');

exports.register = async (req, res, next) => {
  try {
    const { fullname, username, password } = req.body;

    // !! Validation
    if (!fullname || !username || !password) {
      throw createHttpError.BadRequest(
        'Fullname, username, and password are required.'
      );
    }

    // !! Check if User Exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw createHttpError.Conflict('Username already exists.');
    }

    // !! Hash Password
    const hashedPassword = await HashService.createHashPassword(password);

    // !! Create New User
    const newUser = await UserModel.create({
      fullname,
      username,
      password: hashedPassword,
    });

    // !! Generate JWT Access Token
    const jwtAccessToken = new JwtService(
      '4824C3@c1732623^@$5313',
      '24h',
      'access_token'
    );
    const accessToken = jwtAccessToken.generateToken({
      user_id: newUser._id,
    });

    // !! Return Response
    const userResponse = await UserModel.findById(newUser._id).select(
      '-password'
    );

    return res.status(201).json({
      status: 'success',
      data: {
        user: userResponse,
        token: {
          accessToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // !! Validation
    if (!username || !password) {
      throw createHttpError.BadRequest('Username and password are required.');
    }

    // !! Check if User Exists
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw createHttpError.NotFound('User not found.');
    }

    // !! Verify Password
    const isPasswordCorrect = await HashService.compareHashPassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw createHttpError.Unauthorized('Incorrect password.');
    }

    // !! Generate JWT Access Token
    const jwtService = new JwtService(
      '4824C3@c1732623^@$5313',
      '24h',
      'access_token'
    );
    const accessToken = jwtService.generateToken({ user_id: user._id });

    // !! Exclude Password from User Object
    const { password: _, ...userWithoutPassword } = user.toObject();

    // !! Return Response
    return res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token: {
          accessToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// exports.getMe = async (req, res, next) => {
//   try {
//     // دریافت توکن از هدر Authorization
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw createHttpError.Unauthorized('No token provided');
//     }

//     const token = authHeader.split(' ')[1]; // جدا کردن توکن از "Bearer"

//     // بررسی و رمزگشایی توکن
//     const jwtService = new JwtService(
//       '4824C3@c1732623^@$5313',
//       '24h',
//       'access_token'
//     );
//     const decodedToken = jwtService.verifyToken(token);

//     if (!decodedToken) {
//       throw createHttpError.Unauthorized('Invalid token');
//     }

//     // یافتن کاربر بر اساس ID موجود در توکن
//     const user = await UserModel.findById(decodedToken.user_id).select(
//       '-password'
//     );

//     if (!user) {
//       throw createHttpError.NotFound('User not found');
//     }

//     // بازگشت اطلاعات کاربر
//     return res.status(200).json({
//       status: 'success',
//       data: {
//         user,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};
