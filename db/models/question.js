import mongoose from 'mongoose';


let questionSchema = new mongoose.Schema({
    title : String,
    content : String,
    date: { type: Date, default: Date.now },
})



export default mongoose.model('Question', questionSchema)