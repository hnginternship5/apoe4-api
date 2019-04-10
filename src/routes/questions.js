const express = require('express');
const questionRouter = express.Router;
const questionModel = require('../components/questions/questionModel');
const httpErrorCodes = require('../../util/httpErrorCodes');
const JsendSerializer = require('../../util/JsendSerializer');
const AppError = require('../../handlers/AppError');

//post questions after register
questionRouter.post('/register-question', (req, res, next) => {
    questionModel.registerQuestions.create(req.body).then((err, question) => {
        if (err) {
            return next(
                new AppError(err.message || 'An error occured while recording answers', httpErrorCodes.INTERNAL_SERVER_ERROR, true)
            );
        } else {
            res.send({
                question
            });
        }

    });
});

//post daily questions
questionRouter.post('/daily-question', (req, res, next) => {
    questionModel.dailyQuestions.create(req.body).then((err, question) => {
        if (err) {
            return next(
                new AppError(err.message || 'An error occured while recording answers', httpErrorCodes.INTERNAL_SERVER_ERROR, true)
            );
        } else {
            res.send({
                question
            });
        }

    });
});

module.exports = questionRouter;