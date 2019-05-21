import Option from "../options/optionsModel";
import Rating from "../tracker/trackerModel";

class AnswerHelper {
    async categoryRating(user, category, date, userScore, categoryScore){
        const findRating = await Rating.findOne({owner:user, category, created:date});
        if(findRating){
            //const rating = new AnswerHelper();
            await answerHelper.updateRating(findRating, userScore, categoryScore);

            findRating.save();
            return findRating;
        }

        const newRating = new Rating();
        newRating.owner = user;
        newRating.category = category;
        newRating.user_score = userScore;
        newRating.total_score = categoryScore;

        await newRating.save();
        return newRating;

    }

    async updateRating(findRating, userScore, categoryScore){
        findRating.user_score = userScore;
        findRating.total_score = categoryScore;

        return findRating;
    }
    
}

const answerHelper = new AnswerHelper();

export default answerHelper;
