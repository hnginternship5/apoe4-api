const router = require('express').Router();
const {
  catchErrors,
} = require('../helpers');

import UserController from '../components/user/UserController'
import auth from '../components/auth/AuthController';

router.post('/login', catchErrors(auth.login));
router.post('/register', catchErrors(auth.register));
router.get('/userDetails', UserController.getUserProfile);


export default router;
