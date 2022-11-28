import mongoose from "mongoose";



let categorySchema = new mongoose.Schema ({
        name:String,
        question_id:{type : mongoose.Types.ObjectId , ref: "Question"}
        // categories : ['React Js','PHP','MongoDB','NosQl']
})


export default mongoose.model('Category',categorySchema)