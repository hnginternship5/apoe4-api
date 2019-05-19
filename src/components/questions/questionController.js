import QuestionModel from "./questionModel";
import JsendSerializer from '../../util/JsendSerializer';
import httpErrorCodes from '../../util/httpErrorCodes';
import answerModel from "../answers/answerModel";
import mongoose from "mongoose";
import questionHelper from "./questionHelper";
import questionModel from "./questionModel";
import QuestionBank from "../questionBank/questionbankModel";

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
        let {type, nextQuestion} = req.body;
        //let timeOfDay = new Date().getHours();
        var dt = new Date().toDateString();

        // if (!category) {
        //     return res.status(httpErrorCodes.NOT_FOUND).json(JsendSerializer.fail('Select a catgeory!', null, 404));
        // }

        if (nextQuestion) {
            const viewQuestion = QuestionModel.Question.findById(nextQuestion);

            if (viewQuestion) {
                return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Questions sent!', viewQuestion, 200));
            }
            
        }

        // let type = "";
        // if (timeOfDay < 12) {
        //     type = "Morning"
        // } else if (timeOfDay < 18) {
        //     type = "Noon"
        // } else if (timeOfDay <= 24) {
        //     type = "Night"
        // }

        
        const answers = await answerModel.Answer.find({ created: dt, owner: req.owner }, 'question -_id');
        const totalAnswer = await answerModel.Answer.find({owner: req.owner}, 'question -_id');
        const registerQuestions = await QuestionModel.Question.find({type: "Register"}, "_id");

        //return 
        const arrayAnswers = [];
        for (let i = 0; i < answers.length; i++) {
            const element = answers[i]['question'];
            arrayAnswers.push(JSON.stringify(element));
        }

        let questionType = false;
        let optionNames = [];

        const registerQuestionRemaining = await questionHelper.checkRegisterQuestionExists(totalAnswer, registerQuestions);
        if (registerQuestionRemaining > 0) {
            type = "Register";
        }

        let questions = [];
        let specialQuestions = [];



        const specialCategoryQuestions = await QuestionBank.find({type});

        if(specialCategoryQuestions.length > 0){
            for (let i = 0; i < specialCategoryQuestions.length; i++) {
                const question = specialCategoryQuestions[i];
                const stringQuestionId = JSON.stringify(question._id)
                const checkIfAnswered = arrayAnswers.includes(stringQuestionId);
                if(!checkIfAnswered){
                    specialQuestions.push(question);
                }
            }
        }

        if(specialQuestions.length > 0){
            questions = specialQuestions;
        }else{
            questions = await QuestionModel.Question.find({ type });
        }

        if (questions.length < 1) {
            return res.status(httpErrorCodes.OK).json(JsendSerializer.fail('No question found!', null, 404));
        }

        for (let i = 0; i < questions.length; i++) {

            let question = questions[i];
            
            if (arrayAnswers.length > 0) {
                const answered = await questionHelper.checkAnsweredQuestion(question, arrayAnswers);
                if (answered) {
                    
                    questionType = await questionHelper.checkQuestionType(question, type);
                } else {
                    continue;
                }
                //console.log(questionType)
                if (questionType) {
                    
                    if(specialQuestions.length < 1)
                        optionNames= await questionHelper.swapOptionsName(question.options);
                    else
                        optionNames = question.options    
                     //question['options'] = optionNames;
                    question = {
                        options: optionNames,
                        text: question.text,
                        _id: question._id,
                        type: question.type,
                        category: question.category,
                    }
                    return res.status(200).json({
                        question,
                        error: false,
                        status: 0
                    });
                } else {
                    continue;
                }
            } else {
                questionType = await questionHelper.checkQuestionType(question, type);
                if (questionType) {
                    if(specialQuestions.length < 1)
                        optionNames= await questionHelper.swapOptionsName(question.options);
                    else
                        optionNames = question.options  
                    
                    question = {
                        options: optionNames,
                        text: question.text,
                        _id: question._id,
                        type: question.type,
                        category: question.category,
                    }
                    return res.status(200).json({
                        question,
                        error: false,
                        status: 0
                    });
                } else {
                    continue;
                }
                
            }
        }

        return res.status(200).json({
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
        const {text, type, options, category, child} = req.body
        try {
            const question = new QuestionModel.Question();

            question.text = text;
            question.type = type;
            question.options = await questionHelper.swapOptionsId(options);
            question.category = category

            if (child) {
                question.child = child;
            }

            await question.save();
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Question created!', question, 201));
        } catch (err) {
            console.log(err);
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
            const { text, type, category, child, options } = req.body;

            const question = await QuestionModel.Question.findById(id);
            if (!question) {
                return res.status(httpErrorCodes.OK).json(JsendSerializer.fail('No question found!', null, 404));
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
            if (child) {
                question.child = child;
            }
            if (options) {
                question.options = options;
            }

            await question.save();
            const questions = await QuestionModel.Question.find({});
            return res.status(httpErrorCodes.OK).json(JsendSerializer.success('Question Updated Successfully!', questions, 201));
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

    async deleteQuestion(req, res){
        const {id} = req.params;

         await QuestionModel.Question.findOneAndRemove({_id:id});

         res.status(200).json({
             msg: "Success"
         })
    }
}

export default new QuestionController();