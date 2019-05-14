import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const WhgSchema = new Schema({
    weight: {
        type: Number,
    },
    Height: {
        type: String,
    },
    gender: {
        type: String,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
});


export const Whg = mongoose.model('Whg', WhgSchema);