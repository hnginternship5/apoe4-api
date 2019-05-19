import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const Schema = mongoose.Schema;
const createTime = new Date().toDateString();
const AnswerSchema = new Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
        default: "5cdff1bca367b31144980d90"
    },
    created: { type: String, default: createTime }
});

const Answer = mongoose.model('Answer', AnswerSchema);




export default {
    Answer: Answer,
};