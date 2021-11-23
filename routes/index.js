var express = require('express');
var router = express.Router();
var model =require('../model');
var moment = require('moment');




// registration page
router.get('/regist', function(req, res, next) {
  res.render('regist', {})
})

router.get('/login', function(req, res, next) {
  res.render('login', {})
})

router.get('/mutiname', function(req, res, next) {
  res.render('mutiname', {})
})

router.get('/permit', function(req, res, next) {
  res.render('permit', {})
})



/* GET home page. */
router.get('/', function(req, res, next) {
  var username =req.session.username || ''
  var page = req.query.page || 1
  var data = {
    total: 0, //total pages
    curPage: page,
    list: []  //list of current pages
  }
  var pageSize =6
  model.connect(function(db) {
    db.collection('article').find().toArray(function(err, docs) {
      data.total = Math.ceil(docs.length / pageSize)
      model.connect(function(db) {
        // sort()  limit()  skip()
        db.collection('article').find().sort({_id: -1}).limit(pageSize).skip((page-1)*pageSize).toArray(function(err, docs2) {
          if (docs2.length == 0) {
            res.redirect('/?page='+((page-1) || 1))
          } else {
            docs2.map(function(ele, index) {
              ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
            })
            data.list = docs2
          }
          res.render('index', { username: username, data: data });
        })
      })
    })
  })
});



//Write  and  Edit
router.get('/write', function(req, res, next) {
  var username = req.session.username || ''
  var id = parseInt(req.query.id)
  var page = req.query.page
  var item = {
    title: '',
    content: '',
    username: ''
  }



  if (id) {  // Editing
    model.connect(function(db) {
      db.collection('article').findOne({id: id} , function(err, docs) {
        if (err) {
          console.log('Look up failed')
        }
        else {
          item = docs
          item['page'] = page
          if (item.username == username) {
            res.render('write', {username: username, item: item})
          }
          else{
            res.redirect('/permit')
            // res.redirect('/?page='+((page-1) || 1))

          }
        }
      })
    })
  } else {  // new articles
    res.render('write', {username: username, item: item})
  }
})


//Details
router.get('/detail', function(req, res, next) {
  var id = parseInt(req.query.id)
  var username = req.session.username || ''
  var article_id = parseInt(req.query.id)
  model.connect(function(db) {
    db.collection('article').findOne({id: id}, function(err, docs) {
      if (err) {
        console.log('Look up failed', err)
      } else {
        var item = docs
        item['time'] = moment(item.id).format('YYYY-MM-DD HH:mm:ss')
        model.connect(function(db){
          db.collection('comments').find({article_id:article_id}).toArray(function(err,docs2){
              console.log("comment list",err)
              docs2.map(function(ele, index) {
                ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
              })
              var list = docs2
              res.render('detail', {item: item, username: username, list: list})
          })
        })
      }
    })
  })
})





module.exports = router;
