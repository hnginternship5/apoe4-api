import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const forumSchema = new Schema({
    title: {
        type: String,
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
    status: {
        type: String,
        required: true,
        default: 'open',
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

export default  mongoose.model('Forum', forumSchema);