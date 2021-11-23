var express = require('express');
var router = express.Router();
var model = require('../model');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//Register
router.post('/regist',function(req,res,next){
  var data = {
    username:req.body.username,
    password:req.body.password,
    password:req.body.password2,
  }
  var item ={
    username: '',
    passward: '',
  }
  var username =  data.username;
  var password =  data.password;

  //add to the db

model.connect(function(db){
  db.collection('users').findOne({username:{ $regex: username , $options: 'i' }} , function(err, docs) {
    if(err){
      res.redirect('/login')
      console.log("Find user info error when registration");
    }else {
      item = docs
      console.log("Username Entered:" ,username);
      console.log("Passward Entered:" ,password);
      // console.log("Username in db:" ,item.username);
      // console.log("Passward in db:" ,item.password);
      if (!item) {
        model.connect(function(db){
          db.collection('users').insertOne(data,function(err,ret){
            if(err){
              console.log('Register Failed')
              res.redirect('/regist')
            }else {
              res.redirect('/login')
            }
          })
        })
      }
      else if (item.username == username) {
        console.log("Name is used by another user, please enter a new name");
        res.redirect('/mutiname')
      }else{
        model.connect(function(db){
          db.collection('users').insertOne(data,function(err,ret){
            if(err){
              console.log('Register Failed')
              res.redirect('/regist')
            }else {
              res.redirect('/login')
            }
          })
        })
      }
    }
})

})
})

//Login ports
router.post('/login',function (req,res,next){
  var data ={
    username: req.body.username,
    password:req.body.password
  }
  var item ={
    username: '',
    passward: '',
  }
  var username =  data.username;
  var password =  data.password;
  model.connect(function(db){
    db.collection('users').findOne({username:{ $regex: username , $options: 'i' }} , function(err, docs) {
      if(err){
        res.redirect('/login')
        console.log("Find user info error when login");
      }else {
        item = docs
        // console.log("Username Entered:" ,username);
        // console.log("Passward Entered:" ,password);
        // console.log("Username in db:" ,item.username);
        // console.log("Passward in db:" ,item.password);

        if(data.username == item.username && data.password == item.password ){
          req.session.username = data.username   //make session
          res.redirect('/')
        }else {
          res.redirect('/login')
        }
      }
    })
  })
})

//Log out
router.get('/logout', function(req, res, next) {
  req.session.username = null
  res.redirect('/login')
})

module.exports = router;
