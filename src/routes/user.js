const router = require('express').Router();
const {
  catchErrors,
} = require('../helpers');
import UserController from '../components/user/UserController';

router.get('/userDetails', UserController.getUserProfile);
router.put('/update', UserController.updateUserProfile);


export default router;
