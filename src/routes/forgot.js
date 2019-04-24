import passport from '../config/passport';
import { User } from '../components/user/userModel';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import async from 'async';
import flash from 'express-flash';

const router = require('express').Router();

/**
 * @api {post} /auth/forgot User forgot password
 * @apiName auth/forgot
 * @apiVersion 1.0.0
 * @apiGroup Auth
 *
 *
 * @apiSuccess An email is sent to user with a link and token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     An e-mail has been sent to user@email.com with further instructions.
 *
 * @apiError error for invalid email
 *
 *
 * @apiparam {String} email user email
 */

router.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'smtp.gmail.com',
                port: 465,
                secure: false,
                auth: {
                    user: 'geneapoe@gmail.com',
                    pass: 'apoe4gene'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'geneapoe@gmail.com',
                subject: 'Apoe4 Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your Apoe4 account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.json({
            Token: req.params.token,
            userId: user._id
        });
    });
});

/**
 * @api {post} /auth/reset/:token Reset a user's password
 * @apiName auth/reset/:token
 * @apiVersion 1.0.0
 * @apiGroup Auth
 *
 *
 * @apiSuccess An email is sent to user with a link and token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *       Success! Your password has been changed.
 *     
 * @apiError ValidationError for invalid input data
 *
 * @apiErrorExample ValidationError-Response:
 *     HTTP/1.1 400 Bad Request
 *       Password reset token is invalid or has expired.
 *
 * @apiparam {String} password User's new password
 */

router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                    req.logIn(user, function(err) {
                        done(err, user);
                    });
                });
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'geneapoe@gmail.com',
                    pass: 'apoe4gene'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});

export default router;