const express = require('express')
const router = express.Router()
const postModel = require('../models/post.js')

router.get('/', function(req, resp) {
  postModel.find({},(err, res) =>{
    if(!err) return resp.json(res)
  });
  });
  router.get('/:id', function(req, resp) {
    postModel.find({_id: req.params.id},(err, res) =>{
      if(!err) return resp.json(res)
    });
    });
router.post('/',function(req, resp) {
   var {post_text,author} = req.body   
   postModel.create([{post_text: post_text}, {author: author}], (err,post) =>{
      if(!err) return resp.json(post)
      return resp.send(err)
   })
  });

router.put('/:id',function(req, resp) {
  postModel.updateOne({_id: req.params.id} ,{ $set: req.body },
  (err, post)=>{  
    if(!err) return resp.json(post)
     return resp.send("can't update post")
  });
});

router.delete('/:id',function(req, resp) {
  postModel.deleteOne({_id: req.params.id} ,(err, post)=>{  
    if(!err) return resp.json(post)
     return resp.send("can't delete post")
  });
});

module.exports = router