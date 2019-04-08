import { catchErrors } from '../helpers';
import authCtrl from '../components/auth/AuthController';

const router = require('express').Router();

router.post('/login', catchErrors(authCtrl.login));
router.post('/register', catchErrors(authCtrl.register));

export default router;
