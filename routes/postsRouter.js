const express = require('express')
const router = express.Router()
const postModel = require('../models/post.js')
const userModel = require('../models/user.js')
const jwt = require('jsonwebtoken')
const jwtKey = 'my_secret_key'

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

router.post('/',async function(req, resp) {
  const token = req.cookies.token
  if (!token) {
    return resp.status(401).end()
  }
  try{
      var payload = jwt.verify(token, jwtKey)
      var user = await userModel.find({email: payload.email});
      var posts = await postModel.create({title: req.body.title, post_text: req.body.post_text, author: user[0]._id.toHexString()});
      return resp.json(posts)
    }catch(err){
      if (err instanceof jwt.JsonWebTokenError) {
        // if the error thrown is because the JWT is unauthorized, return a 401 error
        return resp.status(401).end()
      }
      // otherwise, return a bad request error
      return resp.send(err)
    }
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