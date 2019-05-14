import QuestionModel from "./questionModel";
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
import answerModel from "../answers/answerModel";
import mongoose from "mongoose";

class QuestionController {
    /**
     * @api {post} /questions/getQuestion Get a Question
     * @apiName questions/getQuestion
     * @apiVersion 1.0.0
     * @apiGroup Questions
     *
     *
     * @apiSuccess {String} Response Question which hasnt been answere or message stating all questions answered
     *
     *
     * @apiError {String} Response An internal Server error has occured!
     *
     *
     * @apiparam {String} type Morning, Noon, Night, Register
     */


    async getQuestion(req, res, next) {
        QuestionModel.Question.find({ type: req.body.type }, (err, questions) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            };
            var dt = new Date();
            dt.setDate(dt.getDate() - 1);
            console.log(dt);
            questions.map((question) => {
                answerModel.Answer.findOne({ question: question.id, created: { $lt: dt } })
                    .exec(function(err, answer) {
                        if (answer == null && !res.headersSent) {
                            return res.status(200).json({
                                question: question,
                                error: false
                            });
                        }
                    });
            });
            setTimeout(function() {
                if (!res.headersSent) {
                    return res.status(300).json({
                        msg: "no messages",
                        error: true
                    })
                }
            }, 3000)
        })
    }

    //This isn't meant to work for now, the admin dashboard to be created will be needed in doing the mapping
    async getChildQuestion(req, res, next) {
        QuestionModel.Question.find({ type: req.body.type }, (err, questions) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            };
            var dt = new Date();
            dt.setDate(dt.getDate() - 1);
            console.log(dt)
            console.log(`Owner: ${req.owner}`)
            questions.map((question) => {
                answerModel.Answer.findOne({ question: question.id, created: { $gt: dt }, owner: req.owner })
                    .exec(function(err, answer) {
                        if (answer == null && !res.headersSent) {
                            return res.status(200).json({
                                question: question,
                                error: false,
                                status: 0
                            });
                        }
                    })
            })
            setTimeout(function() {
                if (!res.headersSent) {
                    return res.status(300).json({
                        msg: "No more questions available",
                        error: true,
                        status: 1
                    })
                }
            }, 3000)
        })
    }

    /**
     * @api {post} /questions/createQuestion Creating a question
     * @apiName questions/createQuestion
     * @apiVersion 1.0.0
     * @apiGroup Questions
     *
     *
     * @apiSuccess {String} Response Questions registered successfully!
     *
     *
     * @apiError {String} Response An internal Server error has occured!
     *
     *
     * @apiparam {String} text String of text to represent the question. e.g How was your day?
     * @apiparam {String} type Morning, Noon, Night, Register
     * @apiparam {Array} options Array of the User's Options
     
     */


    async createQuestion(req, res, next) {
        try {
            const Question = await QuestionModel.Question.create(req.body);
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Question created!', Question, 201));
        } catch (err) {
            console.log(err)
            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
        }
    }
}
export default new QuestionController();