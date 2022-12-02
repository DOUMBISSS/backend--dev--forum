import express from 'express';
import Database from './db/database.js';
import User from './db/models/user.js';
import bodyParser from 'body-parser';
import {routes} from "./routes/routes.js";
import Question from "./db/models/question.js";
import Comment from "./db/models/comments.js";
import Category from './db/models/category.js';
import cors from "cors";
import dotenv from 'dotenv'
import bcrypt from "bcrypt";
// import Category from './db/models/category.js';


const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors())
app.use(routes);
const database = new Database();

Database.connect();


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


app.post('/register',function(req,res){
  const newuser=new User(req.body);
  
 if(newuser.password!=newuser.password2)
    return res.status(400).json({message: "password not match"});
  
  User.findOne({email:newuser.email},function(err,user){
      if(user) 
        return res.status(400).json({ auth : false, message :"email exits"});

      newuser.save((err,doc)=>{
        if(err) {console.log(err);
        return res.status(400).json({ success : false});  }
        res.json(doc);
    });

  });
});

app.post('/login', function(req,res){
    // let token=req.cookies.auth;
    // User.findByToken(token,(err,user)=>{
    //     if(err) return  res(err);
    //     if(user) return res.status(400).json({
    //         error :true,
    //         message:"You are already logged in"
    //     });
    
    //     else{
            User.findOne({'email':req.body.email},function(err,user){
                if(!user) return res.json({isAuth : false, message : 'Auth failed ,email not found'});
        
                user.comparepassword(req.body.password,(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
        
                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    res.json({
                        isAuth : true,
                        token : user.token,
                        id : user._id,
                        email : user.email,
                        name: user.name
                    });
                });    
            });
          });
       // }
    });


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401)
      }
      req.user = user;
      next();
    });
  }
  
  app.get('/api/me', authenticateToken, (req, res) => {
    res.send(req.user);
  });

app.get('/profile',auth,function(req,res){
  res.json({
      isAuth: true,
      id: req.user._id,
      email: req.user.email,
      name: req.user.name
      
  })
});

//logout user
app.get('/logout',auth,function(req,res){
  req.user.deleteToken(req.token,(err,user)=>{
      if(err) return res.status(400).send(err);
      res.sendStatus(200);
  });
});

app.get('/users',function(req,res){
                        User.find({})
                        .then((doc)=>{res.send(doc)})
                        .catch(err => {console.log(err);      
                            })

})

app.get('/question',function(req,res){
    res.json({
        title:req.body.title,
        content:req.body.content,
    })
})

app.post('/questions',function(req,res){
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

app.get('/questions', (req,res) => { 
                        Question.find({}).populate("comments")
                        .then((doc)=>{res.send(doc)})
                        .catch(err => {console.log(err);      
                            })
                    })

app.get('/question/:id',(req,res) => { 
                        Question.findById((req.params.id),(req.body)).populate("comments")
                        .then((doc)=>{res.send(doc)})
                        .catch(err => {console.log(err);      
                            })
                    })

app.put('/question/:id',(req,res) => { 
                        Question.findByIdAndUpdate((req.params.id),(req.body))
                        .then((doc)=>{res.send(doc)})
                        .catch(err => {console.log(err);      
                            })
                    })

app.get('/comment',function(req,res){
                        res.json({
                            content:req.body.content
                        })
                    })

app.post('/comments',(req,res)=>{
    const newComment = new Comment(req.body)
    newComment.save((err,doc)=>{
        if(err) {console.log(err);
            return res.status(400).json({ success : false});}
            Question.updateOne({"_id" : doc.question_id},{$push : {comments : doc._id}})
            .then((doc)=> console.log(doc))
        res.status(200).json({
            succes:true,
            message : "Comment added with success",
            dataComment : doc
        });
    })
})
app.get('/comments',(req,res)=>{
    Comment.find({})
    .then((doc)=>{res.send(doc)})
    .catch(err => {console.log(err);      
                            })
                        })

app.get('/categories', (req,res) => { 
    Category.find({}).populate('question_id')
    .then((doc)=>{res.send(doc)})
    .catch(err => {console.log(err);      
    })
})

app.post('/categories',function(req,res){
    const categories = new Category (req.body)
    categories.save()
    .then((doc)=>{res.send(doc)})
    .catch(err => {console.log(err);      
     })
})

app.listen(port , ()=> {
    console.log('Server running at http:127.0.0.1:' + port)
})