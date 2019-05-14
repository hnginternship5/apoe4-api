import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DobSchema = new Schema({
    dob: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
});


export const Dob = mongoose.model('Dob', DobSchema);