const router = require('express').Router();
const {
  catchErrors,
} = require('../helpers');

router.post('/login', catchErros(auth.login));
router.post('/register', catchErrors(auth.register));

exports = router;
