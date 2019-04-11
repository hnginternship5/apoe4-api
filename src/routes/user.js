const router = require('express').Router();
const {
  catchErrors,
} = require('../helpers');

router.get('/:userId', catchErrors(UserController.getUserProfile));
router.put('/update', catchErrors(UserController.updateUserProfile));

exports = router;
