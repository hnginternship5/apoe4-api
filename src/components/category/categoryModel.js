import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category: {
        type: String,
        required: true
    },
    child: {
        type: String,
        default: null
    }
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;