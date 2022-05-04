require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/secretsDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})



userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});


const User = new mongoose.model('User',userSchema);


app.get("/", (req,res)=>{
  res.render("home");
})

app.get("/register", (req,res)=>{
  res.render("register");
})

app.post("/register", (req,res)=>{
  const email = req.body.username;
  const password = req.body.password;

  const newUser = new User({
    email:email,
    password:password
  })
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
      res.send(err);
    }
  })
})

app.get("/login", (req,res)=>{
  res.render("login");
})

app.post("/login",(req,res)=>{
  User.findOne({email:req.body.username},function(err,founduser){
    if(!founduser){
      res.send("We have found no user with this name in the database, please register");
    }
    else if(founduser){
      if(founduser.password===req.body.password){
        res.render("secrets");
      }
      else{
        res.send("Your entered password does not match with the original one please try again.");
      }
    }
    else{
      console.log(err);
    }
  })
})



app.listen(3000, function(){
   console.log("Server started on port 3000");
});//jshint esversion:6
