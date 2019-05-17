import QuestionModel from "./questionModel";
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
import answerModel from "../answers/answerModel";
import mongoose from "mongoose";
import questionHelper from "./questionHelper";
import questionModel from "./questionModel";

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
     * @apiparam {String} category Register, Daily, IADL.
     */


    async getQuestion(req, res) {
        const {category, nextQuestion} = req.body;
        let timeOfDay = new Date().getHours();
        var dt = new Date().toDateString();

        if (!category) {
            return res.status(httpErrorCodes.NOT_FOUND).json(JsendSerializer.fail('Select a catgeory!', null, 404));
        }

        if (nextQuestion) {
            const viewQuestion = QuestionModel.Question.findById(nextQuestion);

            if (!viewQuestion) {
                return res.status(httpErrorCodes.NOT_FOUND).json(JsendSerializer.fail('No question found!', null, 404));
            }
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Questions sent!', viewQuestion, 200));
        }

        let type = "";
        if (timeOfDay < 12) {
            type = "Morning"
        } else if (timeOfDay < 18) {
            type = "Noon"
        } else if (timeOfDay <= 24) {
            type = "Night"
        }

        const questions = await QuestionModel.Question.find({ category });

        if (!questions) {
            return res.status(httpErrorCodes.NOT_FOUND).json(JsendSerializer.fail('No question found!', null, 404));
        }

        const answers = await answerModel.Answer.find({ created: dt, owner: req.owner }, 'question -_id');
        const arrayAnswers = [];
        for (let i = 0; i < answers.length; i++) {
            const element = answers[i]['question'];
            console.log(element);
            arrayAnswers.push(JSON.stringify(element));
        }

        let questionType = false;
        let questionPosition = false;

        const questionArrayForDailyType = QuestionModel.Question.find({category, type});
        const specialQuestion = questionModel.Question.find({category, type:"Special"});
        const specialCount = specialQuestion.length;
        const typeCount = questionArrayForDailyType.length;
        const totalcount = typeCount + specialCount;
        if (type != "Special" && totalcount <= arrayAnswers.length) {
            return res.status(404).json({
                msg: "You have answered all the questions",
                status: 1
            })
        }

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (arrayAnswers.length > 0) {
                const answered = await questionHelper.checkAnsweredQuestion(question, arrayAnswers);

                if (answered) {
                    questionType = await questionHelper.checkQuestionType(question, type);
                } else {
                    continue;
                }

                if (questionType) {
                    questionPosition = await questionHelper.checkPositionOfQuestion(question);
                } else {
                    continue;
                }

                // if (questionExists) {
                    
                // }

                if (questionPosition) {
                    return res.status(200).json({
                        question: question,
                        error: false,
                        status: 0
                    });
                   // break;
                }else{
                    continue
                }
            } else {
                questionType = await questionHelper.checkQuestionType(question, type);
                if (questionType) {
                    questionPosition = await questionHelper.checkPositionOfQuestion(question);
                } else {
                    continue;
                }

                if (questionPosition) {
                    return res.status(200).json({
                        question: question,
                        error: false,
                        status: 0
                    });
                   // break;
                }else{
                    continue
                }
            }
        }

        return res.status(404).json({
            msg: "You have answered all the questions",
            status: 1
        })
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
     * @apiparam {String} type Morning, Noon, Night, Register.
     * @apiparam {Array} options Array of the User's Options.
     * @apiparam {String} category Category of question. i.e Register, Daily, IADL.
     * @apiparam {Number} position This parameter is still worked on, it's optional for now.
     */


    async createQuestion(req, res) {
        const {text, type, options, category} = req.body
        try {
            const question = new QuestionModel.Question();

            question.text = text;
            question.type = type;
            question.options = options;
            question.category = category;

            await question.save();
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Question created!', question, 201));
        } catch (err) {
            console.log(err)
            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
        }
    }

    /**
     * @api {patch} /questions/updateQuestion Updating a question
     * @apiName questions/updateQuestion
     * @apiVersion 1.0.0
     * @apiGroup Questions
     *
     *
     * @apiSuccess {String} Response Questions updated successfully!
     *
     *
     * @apiError {String} Response An internal Server error has occured!
     *
     *
     * @apiparam {String} text String of text to represent the question. e.g How was your day?
     * @apiparam {String} type Morning, Noon, Night, Register.
     * @apiparam {Array} options Array of the User's Options.
     * @apiparam {String} category Category of question. i.e Register, Daily, IADL.
     * @apiparam {Number} position This parameter is still worked on, it's optional for now.
     */

    //update questions
    async updateQuestion(req, res, next) {
        try {
            const id = req.params.questionId;
            const { text, type, category, position, options } = req.body;

            const question = await QuestionModel.Question.findById(id);
            if (!question) {
                return res.status(httpErrorCodes.NOT_FOUND).json(JsendSerializer.fail('No question found!', null, 404));
            }
            if (text) {
                question.text = text;
            }
            if (type) {
                question.type = type;
            }
            if (category) {
                question.category = category;
            }
            if (position) {
                question.position = position;
            }
            if (options) {
                question.options = options;
            }

            await question.save();
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Question Updated Successfully!', question, 201));
        } catch (err) {
            console.log(err);
            return res.status(httpErrorCodes.INTERNAL_SERVER_ERROR).json(JsendSerializer.fail('An internal Server error has occured!', err, 500));
        }
    }

    /**
     * @api {get} /questions/all Getting all questions
     * @apiName questions/all
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
     */

    //get all questions
    async allQuestions(req, res) {
        const all = await QuestionModel.Question.find({});

        return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Questions are:', all, 201));
    }
}




export default new QuestionController();