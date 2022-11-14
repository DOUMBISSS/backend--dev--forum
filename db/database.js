
import mongoose from "mongoose";

const server = '127.0.0.1:27017'; 
const database = 'baroland';     
class Database {
  constructor() {
    this.connect()
  }
connect() {
     mongoose.connect(`mongodb://${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
  
}
export default Database;