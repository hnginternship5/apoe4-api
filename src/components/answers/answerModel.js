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
        type: String,
        required: true
    },
    created: { type: String, default: createTime }
});

const Answer = mongoose.model('Answer', AnswerSchema);




export default {
    Answer: Answer,
};