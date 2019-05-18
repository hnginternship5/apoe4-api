import Option from "../options/optionsModel";

class QuestionHelper {
    checkAnsweredQuestion(question, arr){
        const qId = JSON.stringify(question._id);
        const checkAnswered = arr.includes(qId);
        if (checkAnswered) {
            return false;
        } else{
            return true;
        }
    }
    
    checkQuestionType(question, type){
        if (type == "Register" && question.type == "Register" ) {
            return true
        }
        else if (type != "Register" || question.type == type) {
            return true
        } else{
            return false
        }
    }
    
    async swapOptionsName(options){
        let optionNames = []

        for (let i = 0; i < options.length; i++) {
            const id = options[i];
            const option = await Option.findById(id);
            const name = option.option;
            optionNames.push(name);
        }

        return optionNames;
    }

    async swapOptionsId(options){
        let optionIds = []

        for (let i = 0; i < options.length; i++) {
            const option = await Option.findOne({option:options[i]});
            const id = option._id;
            optionIds.push(id);
        }

        return optionIds;
    }

    checkRegisterQuestionExists(answerArray, questionArray){
        const arrayAnswers = [];
        const arrayQuestions = [];
        for (let i = 0; i < answerArray.length; i++) {
            const element = answerArray[i]['question'];
            arrayAnswers.push(JSON.stringify(element));
        }

        for (let i = 0; i < questionArray.length; i++) {
            const element = questionArray[i]['_id'];
            arrayQuestions.push(JSON.stringify(element));
        }

        let count = 0;
        arrayQuestions.forEach(question => {
            //const result = this.checkAnsweredQuestion(question, answerArray);
            const answered = arrayAnswers.includes(question)
            if (!answered) {
                count += 1;
            }
        });

        return count;
    }
}

const questionHelper = new QuestionHelper();

export default questionHelper;
