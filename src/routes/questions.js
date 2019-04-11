const express = require('express');
const questionRouter = express.Router;
const questionModel = require('../components/questions/questionModel');

//post questions after register
// questionRouter.post('/register-question', (req, res, next) => {
//     questionModel.registerQuestions.create(req.body).then((question) => {
//         res.send({
//             question
//         }).catch(next);
//     });
// });

//post daily questions
// questionRouter.post('/daily-question', (req, res, next) => {
//     questionModel.dailyQuestions.create(req.body).then((question) => {
//         res.send({
//             question
//         }).catch(next);
//     });
// });

module.exports = questionRouter;