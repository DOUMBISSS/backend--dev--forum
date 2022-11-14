import mongoose from "mongoose";

let commentSchema = new mongoose.Schema({
    author: String,
    content: String
})