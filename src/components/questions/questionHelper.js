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
        if (question.type == "Register" || question.type == type) {
            return true
        } else{
            return false
        }
    }
    
    checkPositionOfQuestion(question){
        if (question.position > 1) {
            return false
        } else {
            return true;
        }
    }
}

const questionHelper = new QuestionHelper();

export default questionHelper;
