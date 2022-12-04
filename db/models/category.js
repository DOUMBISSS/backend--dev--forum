import mongoose from "mongoose";



let categorySchema = new mongoose.Schema ({
        name:String,
        question_id:[{type : mongoose.Types.ObjectId , ref: "Question"}]
})


export default mongoose.model('Category',categorySchema)