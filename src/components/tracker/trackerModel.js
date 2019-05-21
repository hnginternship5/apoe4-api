import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const createTime = new Date().toDateString();
const RatingSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: String,
        default: createTime
    },
    user_score: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false
    },
    total_score: {
        type: Number,
        required: true
    }
});

const Rating = mongoose.model('Rating', RatingSchema);

export default Rating;