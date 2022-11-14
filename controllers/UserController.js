import User from '../db/models/user.js';


export  async function userControllerCreate(req,res) {
    const user = await User.create(req.body);
    res.send(user)
}

// export function userControl (req,res){
//         User.findByIdAndUpdate(req.params.id,{name:"Karim"}).then((user)=>{
//           res.send(user);
// })}

// export function userControl (req,res){
//         new User.create(req.body).save().then((user) => {
//             res.send(user)
//         })
//     }