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
        type: mongoose.type.ObjectId,
        required: true
        ref: 'User',
        trim: true,
    },
    catId: {
        type: mongoose.type.ObjectId,,
        required: true,
        ref: 'Category',
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

export default  mongoose.model('User', forumSchema);