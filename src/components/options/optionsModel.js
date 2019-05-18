import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const OptionSchema = new Schema({
    option: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

const Option = mongoose.model('Option', OptionSchema);




export default Option;