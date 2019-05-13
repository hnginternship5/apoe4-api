import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const commentSchema = new Schema({
    thread_id: {
        type: Schema.Types.ObjectId,
        ref: 'Forum',
        required: true,
    },
    body: {
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