import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import timestamps from 'mongoose-timestamp';

const RegisterQuestionSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

const DailyQuestionSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    day: {
        type: String,
        enum: ['great', 'good', 'fair', 'bad'],
        required: true,
    },
    night: {
        type: String,
        enum: ['great', 'good', 'fair', 'bad'],
        required: true,
    },
    plannedActivities: {
        type: String,
        required: true,
    },
    reminders: {
        type: Boolean,
        required: true,
    },
});

const MorningQuestionSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    night: {
        type: String,
        enum: ['great', 'good', 'fair', 'bad'],
        required: true,
    },
    why: {
        type: String
    },
    plannedActivities: {
        type: String,
        enum: ['running', 'walking', 'gym', 'none'],
        required: true,
    },
    reminders: {
        type: String,
        enum: ['Yes', 'No'],
        required: true,
    },
});

const NoonQuestionSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    now: {
        type: String,
    },
    where: {
        type: String,
        enum: ['At work', 'At home', 'working from home', 'other']
    },
    day: {
        type: String,
        enum: ['Awesome', 'Interesting', 'Boring', 'Okay'],
        required: true,
    },
});

const NightQuestionSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    excercise: {
        type: String,
        enum: ['Yes', 'No']
    },
    day: {
        type: String,
        enum: ['great', 'good', 'fair', 'bad'],
        required: true,
    },
    eaten: {
        type: String,
        enum: ['1', '2', '3', 'More'],
        required: true,
    },
});



const registerQuestions = mongoose.model('RegisterQuestion', RegisterQuestionSchema);
const dailyQuestions = mongoose.model('DailyQuestion', DailyQuestionSchema);
const morningQuestions = mongoose.model('MorningQuestion', MorningQuestionSchema);
const noonQuestions = mongoose.model('NoonQuestion', NoonQuestionSchema);
const nightQuestions = mongoose.model('NightQuestion', NightQuestionSchema);



module.exports = {
    registerQuestions: registerQuestions,
    dailyQuestions: dailyQuestions,
    morningQuestions: morningQuestions,
    noonQuestions: noonQuestions,
    nightQuestions: nightQuestions,
};