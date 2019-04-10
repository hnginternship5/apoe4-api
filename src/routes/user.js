const router = require('express').Router();
const {
  catchErrors,
} = require('../helpers');

const userController = require('../components/user/UserController');

router.post('/login', catchErros(auth.login));
router.post('/register', catchErrors(auth.register));
router.get('/userDetails', userController.getUserProfile);


exports = router;
