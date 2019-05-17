import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    text: {
        type: String,
        required: true
    },
    child: {
        type: String,
    },
    position: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ["Morning", "Noon", "Night", "Register"],
        required: true
    },
    options: {
        type: [String]
    },
    category: {
        type: String,
        required: true
    }
});

const Question = mongoose.model('Question', QuestionSchema);

export default {
    Question: Question,
};