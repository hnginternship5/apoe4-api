import { catchErrors } from '../helpers';
import authCtrl from '../components/auth/AuthController';
import * as userController from '../components/user/UserController';

const router = require('express').Router();

router.post('/login', catchErrors(authCtrl.login));
router.post('/register', authCtrl.validateRegister, catchErrors(authCtrl.register));
router.get('userdetails', catchErrors(userController.getUserProfile));

export default router;
