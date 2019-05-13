import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const commentSchema = new Schema({
    threadId: {
        type: Schema.Types.ObjectId,
        ref: 'Forum',
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        trim: true,
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

export default  mongoose.model('Comment', commentSchema);