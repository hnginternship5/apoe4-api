import Rating from "./trackerModel";
import Category from "../category/categoryModel";

class TrackerController {

    async getADaySingleCategoryRating(req, res){
        let {date} = req.body;
        const {categoryId} = req.params;

        if (!date) {
            date = new Date();
        }
        const created = date.toDateString();

        const findRating = await Rating.findOne({category: categoryId, created, owner: req.owner});

        if(!findRating){
            return res.status(200).json({
                message: "No rating",
                code: 400
            })
        }

        const percentage = Math.round(findRating.user_score * 100 / findRating.total_score);

        const categoryName = await Category.findById(categoryId);
        const category = {name: categoryName.category, percentage}

        return res.status(200).json({
            category,
            message: "Rating retrieved successfully",
            code: 200,
            status: "Successful"
        })
    }

    async getADayAllCategoriesRatings(req, res){
        
        let {date} = req.body;
        if (!date) {
            date = new Date();
        }
        const created = date.toDateString();

        const allcategories = await Rating.find({created, owner: req.owner});

        if(!allcategories){
            return res.status(200).json({
                message: "No rating",
                code: 400
            })
        }

        let allRatings = [];

        for (let i = 0; i < allcategories.length; i++) {
            const rating = allcategories[i];
            const categoryName = await Category.findById(rating.category);
            const percentage = Math.round(rating.user_score * 100 / rating.total_score);
            const category = {name: categoryName.category, percentage}
            allRatings.push(category);
        }

        return res.status(200).json({
            allcategories: allRatings,
            message: "Ratings retrieved successfully",
            status: "Successful",
            code: 200
        })
    }

    async allSingleCategoryRatings(req, res){
        const {categoryId} = req.params;

        const findCategory = await Rating.find({owner: req.owner, category: categoryId});

        if (!findCategory) {
            return res.status(200).json({
                message: "No rating for selected category",
                status: "Failed",
                code: 400
            })
        }
        
        let ratings = [];
        const categoryName = await Category.findById(categoryId);

        for (let i = 0; i < findCategory.length; i++) {
            const rating = findCategory[i];
            const percentage = Math.round(rating.user_score * 100 / rating.total_score);
            const category = {percentage, date: rating.created}
            ratings.push(category);
        }

        return res.status(200).json({
            ratings,
            name: categoryName.category,
            message: `Ratings for ${categoryName.category} was successfully retrieved`,
            status: "Successful",
            code: 200
        })
    }

    async allCategoriesRatings(req, res){

        const allcategories = await Rating.find({owner: req.owner});

        if (!allcategories) {
            return res.status(200).json({
                message: "No rating",
                status: "Failed",
                code: 400
            })
        }

        let allRatings = [];

        for (let i = 0; i < allcategories.length; i++) {
            const rating = allcategories[i];
            const categoryName = await Category.findById(rating.category);
            const percentage = Math.round(rating.user_score * 100 / rating.total_score);
            const category = { name: categoryName.category, percentage, date: rating.created}
            allRatings.push(category);
        }


        return res.status(200).json({
            allcategories: allRatings,
            message: "Ratings retrieved successfully",
            status: "Successful",
            code: 200
        })
    }
}

const trackerController = new TrackerController();
export default trackerController;