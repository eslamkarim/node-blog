const express = require('express')
const router = express.Router()
const postModel = require('../models/post.js')

router.get('/', async function(req, resp) {
  postModel.find({},(err, res) =>{
    if(!err) return resp.json(res)
  }).populate('author');
  });
  router.get('/:id', function(req, resp) {
    postModel.find({_id: req.params.id},(err, res) =>{
      if(!err) return resp.json(res)
    }).populate('author');
    });
router.post('/',function(req, resp) {
   postModel.create(req.body, (err,post) =>{
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