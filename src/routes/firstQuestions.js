const express = require('express');
const firstQuestionRouter = express.Router;
const registerQuestions = require('../components/questions/firstQuestionModel');

//post questions on register
firstQuestionRouter.post('/register-question', (req, res) => {
    registerQuestions.create(req.body).then((question) => {
        res.send({
            question
        });
    });
});

module.exports = firstQuestionRouter;