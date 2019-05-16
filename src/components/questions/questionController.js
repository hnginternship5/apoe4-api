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
     * @apiSuccess {String} Response Question which hasn't been answered or message stating all questions answered
     *
     *
     * @apiError {String} Response An internal Server error has occured!
     *
     *
     * @apiparam {String} type Morning, Noon, Night, Register
     */


    async getQuestion(req, res, next) {
        const {category} = req.body;
        let timeOfDay = new Date().getHours();
        var dt = new Date().toDateString();

        if (!category) {
            return res.status(httpErrorCodes.NOT_FOUND).json(JsendSerializer.fail('Select a catgeory!', null, 404));
        }

        let type = "";
        if (timeOfDay < 12) {
            type = "Morning"
        } else if (timeOfDay < 18) {
            type = "Noon"
        } else if (timeOfDay <= 24) {
            type = "Night"
        }

        const questions = await QuestionModel.Question.find({category});

        if (!questions) {
            return res.status(httpErrorCodes.NOT_FOUND).json(JsendSerializer.fail('No question found!', null, 404));
        }

        const answers = await answerModel.Answer.find({created: dt, owner: req.owner}, 'question -_id');
        const arrayAnswers = [];
        for (let i = 0; i < answers.length; i++) {
            const element = answers[i]['question'];
            arrayAnswers.push(element);
        }
        
        questions.forEach(question => {
            if (arrayAnswers.length > 0) {
                const qId = question._id;
                const checkAnswered = arrayAnswers.includes(qId);
                
                if (!checkAnswered || question.type == "Register" || question.type == type || question.position <=1) {
                    console.log(question)
                    return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Questions sent!', question, 200));
                }
            } else{
                if (question.type == "Register" || question.type == type || question.position <=1) {
                    return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Questions sent!', question, 200));
                }
            }
        });

        

        return res.status(httpErrorCodes.NOT_FOUND).json(JsendSerializer.fail('No question found!', null, 404));
    }

    //This isn't meant to work for now, the admin dashboard to be created will be needed in doing the mapping
    async getChildQuestion(req, res, next) {
        QuestionModel.Question.find({ type: req.body.type }, (err, questions) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            }
            var dt = new Date();
            dt.setDate(dt.getDate() - 1);
            console.log(dt);
            console.log(`Owner: ${req.owner}`);
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
                    });
            });
            setTimeout(function() {
                if (!res.headersSent) {
                    return res.status(300).json({
                        msg: "No more questions available",
                        error: true,
                        status: 1
                    })
                }
            }, 3000);
        });
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

    //update questions
    async updateQuestion(req, res, next) {
        try {
            const id = req.params.questionId;
            const {text, type, category, position, options} = req.body;

            const question = await QuestionModel.Question.findById(id);
            if (!question) {
                return res.status(httpErrorCodes.NOT_FOUND).json(JsendSerializer.fail('No question found!', null, 404));
            }
            if (text) {
                question.text = text;
            }
            if (type) {
                question.type = type
            }
            if (category) {
                question.category = category
            }
            if (position) {
                question.position = position
            }
            if (options) {
                question.options = options
            }
            
            await question.save()
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Question Updated Successfully!', question, 201));
        } catch (err) {
            console.log(err);
            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
        }
    }

    async allQuestions(req, res){
        const all = await QuestionModel.Question.find({});

        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Question created!', all, 201));
    }
}




export default new QuestionController();