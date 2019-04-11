import { catchErrors } from '../helpers';
import authCtrl from '../components/auth/AuthController';

const router = require('express').Router();

router.post('/login', catchErrors(authCtrl.login));
router.post('/register', authCtrl.validateRegister, catchErrors(authCtrl.register));

export default router;
