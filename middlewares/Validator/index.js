const { validationResult } = require('express-validator');

// router
//   .route('/')
//   .get(GameController.getAllGames)
//   .post(
//     [check('name').notEmpty().withMessage('Name is required')],
//     Validate,
//     GameController.createGame
//   );

const Validate = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({
      status: 400,
      errors: errorMessages,
    });
  } else {
    next();
  }
};

module.exports = Validate;
