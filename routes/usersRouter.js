const express = require('express')
const router = express.Router()
const userModel = require('../models/user.js')

router.get('/', function(req, resp) {
  userModel.find({},(err, res) =>{
    if(!err) return resp.json(res)
  });
  });
router.post('/',function(req, resp) {
   var {firstName,lastName,email,password,gender} = req.body
   userModel.create([{firstName: firstName}, {lastName: lastName}, {email: email}, {password: password}, {gender: gender}], (err,user) =>{
      if(!err) return resp.json(user)
      return resp.send("error can't save user")
   })
  });

module.exports = router