// !! Packages
const express = require('express');
const router = express.Router();

// !! Controllers
const AuthController = require('../../controllers/auth/index');
const VerifyTokenMiddleware = require('../../middlewares/auth.verifytoken');

// !! Route
router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.login);
router.route('/getme').get(VerifyTokenMiddleware, AuthController.getMe);

module.exports = router;
