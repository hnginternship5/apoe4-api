const express = require('express');
const router = express.Router;
const registerQuestions = require('../components/questions/registerQuestionModel');

//post questions on register
router.post('/register-question', (req, res) => {
    registerQuestions.create(req.body).then((question) => {
        res.send({
            question
        });
    });
});