const router = require('express').Router();
const {
  catchErrors,
} = require('../helpers');

import * as userController from '../components/user/UserController'

router.post('/login', catchErros(auth.login));
router.post('/register', catchErrors(auth.register));
router.get('/userDetails', userController.getUserProfile);


exports = router;
