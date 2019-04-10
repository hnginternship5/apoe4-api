import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import timestamps from 'mongoose-timestamp';

const RegisterQuestionSchema = new Schema({
    firstName: {
        type: Number,
        required: true,
    },
    familyHistory: {
        type: Boolean,
        default: false,
        required: true,
    },
    dailyActivities: {
        type: String,
        required: true,
    },
    familiar: {
        type: Boolean,
        default: true,
        required: true,
    },
    variant: {
        type: String,
        enum: ['Epsilon2', 'Epsilon3', 'Epsilon4'],
        required: true,
    },
    test: {
        type: Boolean,
        required: true,
    },
    highBloodPressure: {
        type: Boolean,
        required: true,
    },
    lastCheckup: {
        type: String,
        required: true,
    },
});


const registerQuestions = mongoose.model('RegisterQuestion', RegisterQuestionSchema);

module.exports = registerQuestions;