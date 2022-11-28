import mongoose from "mongoose";

// const server = '127.0.0.1:27017'; 
const server = 'mongodb+srv://doumbisss:Djenebou77@cluster0.x92ho2t.mongodb.net/baroland?retryWrites=true&w=majority'
const database = 'baroland';     
class Database {
    static connect() {
     mongoose.connect(server)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error(err.message)
       })
  }
  
}
export default Database;