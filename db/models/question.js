import mongoose from 'mongoose';


let questionSchema = new mongoose.Schema({
    title : String,
    content : String
})



export default mongoose.model('Question', questionSchema)