import QuestionBank from "./questionbankModel";

class QuestionBankController{
    async store(req, res){
        const {question, options, category, answer, mark, type, image} = req.body;

        if(!question || !options || !category || !answer ){
            return res.status(200).json({
                message: "Oops! Some important informations are missing!",
                status: "failed",
                code: 400
            })
        }

        const findQuestion = await QuestionBank.findOne({question, category, options});

        if (findQuestion) {
            return res.status(200).json({
                message: "Oops! This question exists already!",
                status: "failed",
                question: findQuestion,
                code: 400
            })
        }

        const checkAnswer = options.includes(answer);

        if(!checkAnswer){
            return res.status(200).json({
                message: "Oops! Selected answer not among the options!",
                status: "failed",
                code: 400
            })
        }

        const newQuestion = new QuestionBank();
        newQuestion.question = question;
        newQuestion.category = category;
        newQuestion.options = options;
        newQuestion.answer = answer;
        if(mark){
            newQuestion.mark = mark;
        }
        if(type){
            newQuestion.type = type;
        }
        if(image){
            newQuestion.image = image
        }

        await newQuestion.save();
        return res.status(200).json({
            message: "Question has been saved!",
            status: "successful",
            lecture: newQuestion,
            code: 200
        })

    }

    async read(req, res){
        const {id} = req.params;
        
        const findQuestion = await QuestionBank.findById(id);

        if (!findQuestion) {
            return res.status(200).json({
                message: "Oops! This question may have been removed!",
                status: "failed",
                code: 400
            })
        }

        return res.status(200).json({
            message: "Question exists!",
            status: "successful",
            question: findQuestion,
            code: 200
        })
    }

    async update(req, res){
        const {id} = req.params;
        const {question, category, options, answer, type, mark, image} = req.body;
        
        const findQuestion = QuestionBank.findById(id);

        if (!findQuestion) {
            return res.status(200).json({
                message: "Oops! This question may have been removed!",
                status: "failed",
                code: 400
            })
        }

        if(question){
            findQuestion.question = question;
        }
        if(category){
            findQuestion.category = category;
        }
        if(options){
            findQuestion.options = options
        }
        if(answer){
            findQuestion.answer = answer
        }
        if(type){
            findQuestion.type = type
        }
        if(mark){
            findQuestion.mark = mark
        }
        if(image){
            findQuestion.image = image
        }
        await findQuestion.save();

        return res.status(200).json({
            message: "Question has been updated!",
            status: "successful",
            question: findQuestion,
            code: 200
        })
    }

    async remove(req, res){
        const {id} = req.params;

        const findQuestion = await QuestionBank.findById(id);

        if (!findQuestion) {
            return res.status(200).json({
                message: "Oops! This question may have been removed!",
                status: "failed",
                code: 400
            })
        }

        await QuestionBank.deleteOne({_id: id});
        
        return res.status(200).json({
            message: "Question has been deleted!",
            status: "successful",
            code: 200
        })
    }

    async all(req, res){
        const questions = await QuestionBank.find({})

        if (questions.length < 1) {
            return res.status(200).json({
                message: "Oops! No question has been added yet!",
                status: "successful",
                code: 404
            })
        }

        //return res.json(questions)
        //const allQuestions = JSON.stringify(questions);

        return res.status(200).json({
            message: "All questions!",
            status: "successful",
            code: 200,
            questions
        })
    }
}

export default new QuestionBankController();