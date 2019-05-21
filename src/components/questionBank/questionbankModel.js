import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const QuestionBankSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    mark: {
        type: Number,
        default: 1
    },
    type: {
        type: String,
        enum: ["Morning", "Noon", "Night", "Register"],
        default: "Morning"
    },
    image: {
        type: String,
        required: false
    }
});

const QuestionBank = mongoose.model('QuestionBank', QuestionBankSchema);

export default QuestionBank;