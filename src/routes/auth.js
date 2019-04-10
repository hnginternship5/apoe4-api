import { catchErrors } from '../helpers';
import authCtrl from '../components/auth/AuthController';
import   UserController from '../components/user/UserController';

const router = require('express').Router();

router.post('/login', catchErrors(authCtrl.login));
router.post('/register', authCtrl.validateRegister, catchErrors(authCtrl.register));
router.get('userdetails', catchErrors(UserController.getUserProfile));
router.put('/updateprofile', catchErrors(UserController.updateUserProfile));

export default router;
