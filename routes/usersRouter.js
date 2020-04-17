const express = require('express')
const router = express.Router()
const userModel = require('../models/user.js')

router.get('/', function(req, resp) {
  userModel.find({},(err, res) =>{
    if(!err) return resp.json(res)
  });
  });
  router.get('/:id', function(req, resp) {
    userModel.find({_id: req.params.id},(err, res) =>{
      if(!err) return resp.json(res)
    });
    });
router.post('/',function(req, resp) {
   var {firstName,lastName,email,password,gender} = req.body   
   userModel.create([{firstName: firstName}, {lastName: lastName}, {email: email}, {password: password}, {gender: gender}], (err,user) =>{
      if(!err) return resp.json(user)
      return resp.send(err)
   })
  });

router.put('/:id',function(req, resp) {
  userModel.updateOne({_id: req.params.id} ,{ $set: req.body },
  (err, user)=>{  
    if(!err) return resp.json(user)
     return resp.send("can't update user")
  });
});

router.delete('/:id',function(req, resp) {
  userModel.deleteOne({_id: req.params.id} ,(err, user)=>{  
    if(!err) return resp.json(user)
     return resp.send("can't delete user")
  });
});

module.exports = router