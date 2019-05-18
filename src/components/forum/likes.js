import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const likeSchema = new Schema({
    threadId: {
        type: Schema.Types.ObjectId,
        ref: 'Forum',
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        trim: true,
    },
});

export default  mongoose.model('Like', likeSchema);