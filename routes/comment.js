// var express = require('express');
// var router = express.Router();
// var model = require('../model');
//
// router.post('/add', function(req, res, next) {
//   var id = parseInt(req.body.id)
//   var data = {
//     comment:req.body.comment,
//     username: req.session.username,
//     // article_id: parseInt(req.body.id)
//   }
//   var article_id = parseInt(req.query.id)  //how can i get current articles'
//
// // var     str= req.location.herf
//
//   model.connect(function(db){
//     db.collection('comments').insertOne(data,function(err,ret){
//       if (err) {
//         console.log("comment failed");
//         res.redirect('/')          //junp to current page
//       }else{
//         console.log("comment successful");
//         res.redirect('/')
//       }
//     })
//   })
// })
//
//
// router.get('/delete', function(req, res, next) {
//   var username = req.session.username || ''
//   var id = parseInt(req.query.id)
//       model.connect(function(db) {
//       db.collection('comments').deleteOne({id: id}, function(err, ret) {
//         if (err) {
//           console.log('Delete Failed')
//         } else {
//           console.log('Deleted Success')
//           console.log('-------------------------------id is:'+ id);
//         }
//         res.redirect('/')
//       })
//     })
//
//   })
//
//
//
//
//
// module.exports = router;
