import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    child: {
        type: String,
    },
    type: {
        type: String,
        enum: ["Morning", "Noon", "Night", "Register"],
        required: true
    },
    options: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Option",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
});

const Question = mongoose.model('Question', QuestionSchema);

export default {
    Question: Question,
};