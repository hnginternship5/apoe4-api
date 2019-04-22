import {
    catchErrors
} from '../helpers';
import passport from '../config/passport';
import authCtrl from '../components/auth/AuthController';

const router = require('express').Router();

router.post('/login', catchErrors(authCtrl.login));
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    }));
router.get('/google/failure', (req, res, next) => {
    return res.status(400).json({
        message: "Google Auth Failed"
    });
});
router.get('/google/success', (req, res, next) => {
    console.log(req.body)
    return res.status(200).json({
        token: authCtrl.signToken(req.body.owner),
        message: "Google Auth Success"
    });
});
router.get('/google/redirect',
    passport.authenticate('google', {
        failureRedirect: '/auth/google/failure',
        session: false
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log(req.body)
        res.redirect('/api/v1/auth/google/success');
    });
router.post('/register', authCtrl.validateRegister, catchErrors(authCtrl.register));
router.post('/dob', catchErrors(authCtrl.dob));
router.post('/whg', catchErrors(authCtrl.whg));


export default router;