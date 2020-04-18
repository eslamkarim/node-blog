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

router.put('/:id',async function(req, resp) {
  const token = req.cookies.token
  if (!token) {
    return resp.status(401).end()
  }
  try{
      var payload = jwt.verify(token, jwtKey)
      var user = await userModel.find({email: payload.email});
      var post = await postModel.updateOne({_id: req.params.id, author: user[0]._id.toHexString()} ,{ $set: req.body });
    return resp.json(post)
  }catch(err){
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return resp.status(401).end()
    }
    // otherwise, return a bad request error
    return resp.send(err)
  }
});

router.delete('/:id',async function(req, resp) {
  const token = req.cookies.token
  if (!token) {
    return resp.status(401).end()
  }
  try{
      var payload = jwt.verify(token, jwtKey)
      var user = await userModel.find({email: payload.email});
      var post = await postModel.deleteOne({_id: req.params.id, user[0]._id.toHexString()});
    return resp.json(post)
  }catch(err){
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return resp.status(401).end()
    }
    // otherwise, return a bad request error
    return resp.send(err)
  }
});

module.exports = router

