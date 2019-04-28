import  User from '../components/user/userModel';
import crypto from 'crypto';
import async from 'async';
import smtpTransport from '../components/mail/forgotmail';

const forgotRouter = require('express').Router();

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
const email = `apoe4@gmail.com`;
forgotRouter.post('/forgot', (req, res) => {
    async.waterfall([
        function(done) {
        User.findOne({
            email: req.body.email
        }).exec(function(err, user) {
            if (user) {
            done(err, user);
            } else {
            done('User not found.');
            }
        });
        },
        function(user, done) {
        // create the random token
        crypto.randomBytes(20, function(err, buffer) {
            const token = buffer.toString('hex');
            done(err, user, token);
        });
        },
        function(user, token, done) {
        User.findByIdAndUpdate({ _id: user._id }, {resetPasswordToken: token, resetPasswordExpires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
            done(err, token, new_user);
        });
        },
        function(token, user, done) {
        const data = {
            to: user.email,
            from: email,
            template: 'forgot-password-email',
            subject: 'Reset Password!',
            context: {
            url: `${req.headers.host}/api/v1/auth/reset/${token}`,
            name: user.fullName.split(' ')[0]
            }
        };
    
        smtpTransport.sendMail(data, function(err) {
            if (!err) {
            return res.status(200).json({ message: 'Kindly check your email for further instructions' });
            } else {
            return done(err);
            }
        });
        }
    ], function(err) {
        return res.status(422).json({ message: err });
    });
});

forgotRouter.get('/reset/:token', (req, res) => {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }).exec(function(err, user) {
        if (user) {
            return res.status(200).json({
                message: 'Use a POST request with this same endpoint and include newPassword and verifyPassword as a body parameter',
            })
        }
        return res.status(400).json({
            message: 'Invalid token!',
        });
      });
});

forgotRouter.post('/reset/:token', (req, res) => {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }).exec(function(err, user) {
        if (!err && user) {
          if (req.body.newPassword === req.body.verifyPassword) {
            user.password = req.body.newPassword;
            user.resetPasswordExpires = undefined;
            user.resetPasswordToken = undefined;
            user.save(function(err) {
              if (err) {
                return res.status(500).send({
                  message: err
                });
              } else {
                const data = {
                  to: user.email,
                  from: email,
                  template: 'reset-password',
                  subject: 'Password Reset Confirmation',
                  context: {
                    name: user.fullName.split(' ')[0]
                  }
                };
    
                smtpTransport.sendMail(data, function(err) {
                  if (!err) {
                    return res.json({ message: 'Password has been reset!' });
                  } else {
                    return done(err);
                  }
                });
              }
            });
          } else {
            return res.status(422).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
});

export default forgotRouter;
