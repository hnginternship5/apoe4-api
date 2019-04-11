const router = require('express').Router();
const {
  catchErrors,
} = require('../helpers');
import UserController from '../components/user/UserController';

router.get('/:userId', catchErrors(UserController.getUserProfile));
router.put('/update', catchErrors(UserController.updateUserProfile));


export default router;
