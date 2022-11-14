import mongoose from "mongoose";

let commentSchema = new mongoose.Schema({
    // author: String,
    commentUser: String
})

export default mongoose.model('Comment',commentSchema)