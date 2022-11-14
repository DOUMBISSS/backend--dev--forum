import express from 'express';
import Database from './db/database.js';
import User from './db/models/user.js';
import bodyParser from 'body-parser';
import {routes} from "./routes/routes.js";
import Question from "./db/models/question.js";
import Comment from "./db/models/comments.js";
import cors from "cors"


const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors())
app.use(routes);
const database = new Database();

database.connect();

// const user = new User({
//                     firstName: 'Doumbia', 
//                     lastName: 'Fode',
//                     email:'fode77doumbia@gmail.com'
//                      })
// console.log(user)

// const email = EmailModel.create({
//     email:'fode77doumbia@gmail.com'
// }).then(() => {
//     console.log("Email created with success")
// })
// .catch(err => {
//     console.log(err.message)
// })

// const user =  new User({
//     firstName: 'Doumbia', 
//     lastName: 'Fode',
//      password:'ddjjd'
//     email:'fode77doumbia@gmail.com',
// }).save()
// .then(doc => {
//   console.log('User added to your database')
// })
// .catch(err => {
//   console.error(err)
// });

// User.create([
//     {firstName: 'Doumbia Fode',email:'doumbia77fode@gmail.com',password:'ddjjd'},

//     {firstName: 'Kouyate Karim',email:'kouyate02@gmail.com',password:'ddjjd'},

// ])

let auth =(req,res,next)=>{
  let token =req.cookies.auth;
  User.findByToken(token,(err,user)=>{
      if(err) throw err;
      if(!user) return res.json({
          error :true
      });
      req.token= token;
      req.user=user;
      next();
  })
}


app.post('/api/register',function(req,res){
  // taking a user
  const newuser=new User(req.body);
  
 if(newuser.password!=newuser.password2)return res.status(400).json({message: "password not match"});
  
  User.findOne({email:newuser.email},function(err,user){
      if(user) return res.status(400).json({ auth : false, message :"email exits"});

      newuser.save((err,doc)=>{
          if(err) {console.log(err);
              return res.status(400).json({ success : false});}
          res.status(200).json({
              succes:true,
              user : doc
          });
      });
  });
});

// login user
app.post('/api/login', function(req,res){
  let token=req.cookies.auth;
  User.findByToken(token,(err,user)=>{
      if(err) return  res(err);
      if(user) return res.status(400).json({
          error :true,
          message:"You are already logged in"
      });
  
      else{
          User.findOne({'email':req.body.email},function(err,user){
              if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
      
              user.comparepassword(req.body.password,(err,isMatch)=>{
                  if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
      
              user.generateToken((err,user)=>{
                  if(err) return res.status(400).send(err);
                  res.cookie('auth',user.token).json({
                      isAuth : true,
                      id : user._id,
                      email : user.email
                  });
              });    
          });
        });
      }
  });
});

// get logged in user
app.get('/api/profile',auth,function(req,res){
  res.json({
      isAuth: true,
      id: req.user._id,
      email: req.user.email,
      name: req.user.firstname + req.user.lastname
      
  })
});

//logout user
app.get('/api/logout',auth,function(req,res){
  req.user.deleteToken(req.token,(err,user)=>{
      if(err) return res.status(400).send(err);
      res.sendStatus(200);
  });
}); 

app.get('/api/question',function(req,res){
    res.json({
        title:req.body.title,
        content:req.body.content,
    })
})

app.post('/api/question',function(req,res){
    const newQuestion=new Question(req.body)
    newQuestion.save((err,doc)=>{
        if(err) {console.log(err);
            return res.status(400).json({ success : false});}
        res.status(200).json({
            succes:true,
            message : "Question added with success",
            data : doc
        });
    });
    
})

app.get('/api/questions', (req,res) => { 
                        Question.find({})
                        .then((doc)=>{res.send(doc)})
                        .catch(err => {console.log(err);      
                            })
                    })

app.get('/api/question/:id',(req,res) => { 
                        Question.findById((req.params.id),(req.body))
                        .then((doc)=>{res.send(doc)})
                        .catch(err => {console.log(err);      
                            })
                    })

app.put('/api/question/:id',(req,res) => { 
                        Question.findByIdAndUpdate((req.params.id),(req.body))
                        .then((doc)=>{res.send(doc)})
                        .catch(err => {console.log(err);      
                            })
                    })

app.get('/api/comment',function(req,res){
                        res.json({
                            commentUser:req.body.commentUser
                        })
                    })

app.post('/api/comment',(req,res)=>{
    const newComment = new Comment(req.body)
    newComment.save((err,doc)=>{
        if(err) {console.log(err);
            return res.status(400).json({ success : false});}
        res.status(200).json({
            succes:true,
            message : "Comment added with success",
            dataComment : doc
        });
    })
})
app.get('/api/comments',(req,res)=>{
    Comment.find({})
    .then((doc)=>{res.send(doc)})
    .catch(err => {console.log(err);      
                            })
                        })

// app.delete('/api/question/:id',(req,res) => { 
//                      Question.findByIdAndDelete((req.params.id),(req.body))
//                         .then((doc)=>{res.send(doc).res.status(200)})
//                         .catch(err => {console.log(err);      
//                             })
//                     })

app.listen(port , ()=> {
    console.log('Server running at http:127.0.0.1:' + port)
})