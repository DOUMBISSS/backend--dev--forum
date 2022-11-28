import mongoose from "mongoose";

let commentSchema = new mongoose.Schema({
    content: String,
    question_id:{type : mongoose.Types.ObjectId , ref: "Question"},
    date: { type: Date, default: Date.now },
})

const Comment = mongoose.model('Comment',commentSchema)
export default Comment