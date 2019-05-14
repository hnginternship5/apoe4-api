import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    text: {
        type: String,
        ref: 'User',
        required: true
    },
    child: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: ["Morning","Noon","Night","Register"],
        required: true
    },
    options: {
        type: [String]
    }
});

const Question = mongoose.model('Question', QuestionSchema);

export default {
    Question: Question,
};