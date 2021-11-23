var express = require('express');
var router = express.Router();
var model = require('../model');
var multiparty = require('multiparty');
var fs = require('fs');


router.post('/add', function(req, res, next) {
  var id = parseInt(req.body.id)

  if (id) {  // edit
    var page = req.body.page
    var title = req.body.title
    var content = req.body.content
    model.connect(function(db) {
      db.collection('article').updateOne({id: id}, {$set: {
        title: title,
        content: content
      }}, function(err, ret) {
        if (err) {
          console.log('Edit failed', err)
        } else {
          console.log('Edit success')
          res.redirect('/?page='+page)
        }
      })
    })
  } else {   // new article
    var data = {
      title: req.body.title,
      content: req.body.content,
      username: req.session.username,
      id: Date.now()
    }
    model.connect(function(db) {
      db.collection('article').insertOne(data, function(err, ret) {
        if(err) {
          console.log('article release failed', err)
          res.redirect('/write')
        } else {
          res.redirect('/')
        }
      })
    })
  }
})


router.get('/delete', function(req, res, next) {
  var username = req.session.username || ''
  var id = parseInt(req.query.id)
  var page = req.query.page
  var item = {
    username: ''
  }
  model.connect(function(db) {
    db.collection('article').findOne({id: id} , function(err, docs) {
    item = docs
    if (item.username == username) {
      model.connect(function(db) {
      db.collection('article').deleteOne({id: id}, function(err, ret) {
        if (err) {
          console.log('Delete Failed')
        } else {
          model.connect(function(db) {
          db.collection('comments').deleteMany({article_id: id}, function(err, ret) {
          console.log('Deleted Success')
        })
      })
        res.redirect('/?page='+page)
      }
    })
  })
}else {
      res.redirect('/permit')
      // res.redirect('/?page='+page)
    }

  })
})
})


router.post('/upload', function(req, res, next) {
  var form = new multiparty.Form()
  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log('Upload Failed', err);
    } else {
      console.log('File List', files)
      var file = files.filedata[0]

      var rs = fs.createReadStream(file.path)
      var newPath = '/uploads/' + file.originalFilename

      var ws = fs.createWriteStream('./public' + newPath)
      rs.pipe(ws)
      ws.on('close', function() {
        console.log('File upload successful')
        res.send({err: '', msg: newPath})
      })
    }
  })
})



router.post('/addc', function(req, res, next) {
  var id = parseInt(req.body.id)
  var data = {
    comment:req.body.comment,
    username: req.session.username,
    article_id: parseInt(req.body.id),
    id: Date.now()
  }
  var article_id= parseInt(req.body.id)

  // var article_id = parseInt(req.body.id)  //how can i get current articles'

// var     str= req.location.herf

  model.connect(function(db){
    db.collection('comments').insertOne(data,function(err,ret){
      if (err) {
        console.log("comment failed");
        res.redirect('/detail?id='+article_id)          //junp to current page
      }else{
        console.log("comment successful");
        res.redirect('/detail?id='+article_id)
      }
    })
  })
})


router.get('/deletec', function(req, res, next) {
  var username = req.session.username || ''
  var id = req.query.id
  var article_id = parseInt(req.query.id)

      model.connect(function(db) {
      db.collection('comments').remove({article_id: article_id}, function(err, ret) {
        if (err) {
          console.log('Delete Failed')
        } else {
          console.log('Deleted Success',article_id)
        }
        res.redirect('/')
      })
    })

  })

module.exports = router;
