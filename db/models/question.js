import mongoose from 'mongoose';
import Comment from './comments.js';
import Category from './category.js'


let questionSchema = new mongoose.Schema({
    title : String,
    content : String,
    categories:String,
    date: { type: Date, default: Date.now },
    comments:[{type : mongoose.Types.ObjectId , ref: "Comment"}],
    // categories: [{type : mongoose.Types.ObjectId , ref: "Category"}]
})



export default mongoose.model('Question', questionSchema)