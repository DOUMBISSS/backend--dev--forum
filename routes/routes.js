import express from "express";
import { userControllerCreate } from '../controllers/UserController.js';
const app = express();
var router = express.Router();


export const routes = express.Router();

// routes.post('/Users',userControllerCreate)

// routes.get('/Users', function (req, res) {
//     User.find ().then((user)=> {
//       res.json(user)})
//     })
  
//     routes.post('/Users', function (req, res) {
//       new User(req.body).save().then((user) => {
//             res.send("person saved successful")
//         })
//     });
  
//   routes.put('/Users/:id', function (req, res) {
//       User.findByIdAndUpdate(req.params.id,{firstName:"Karim"}).then((user)=>{
//         res.send(user);
//       })
//     });
  
//   // routes.delete('/user/:id', function (req, res) {
//   //   User.findByIdAndDelete(req.params.id).then((user)=>{
//   //     res.send(user);
//   //   })
//   //   });


