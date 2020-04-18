const express = require('express')
const router = express.Router()
const userModel = require('../models/user.js')
const postModel = require('../models/post.js')




router.get('/', async function(req, resp) {
  try{
    var user = await userModel.find({});
    return resp.json(user)
  }catch(err){
    return resp.send("can't return users")
  }
});
router.get('/:id', async function(req, resp) {
  try{
    var user = await userModel.find({_id: req.params.id});
    return resp.json(user)
  }catch(err){
    return resp.send("cant find user")
  }
});
router.post('/',async function(req, resp) {
  console.log("/users/post");
  
  try{
    var user = await userModel.create(req.body);
    return resp.json(user)
  }catch(err){
    return resp.send(err)
  }
});

router.put('/:id', async function(req, resp) {
  try{
    var user = await userModel.updateOne({_id: req.params.id} ,{ $set: req.body });  
    return resp.json(user)
  }catch(err){
     return resp.send("can't update user")
  }
});

router.delete('/:id',async function(req, resp) {
  try{
    var delete_response = await userModel.deleteOne({_id: req.params.id});
    return resp.json(delete_response)
  }catch(err){
    return resp.send("can't delete user")
  }
}); 
router.get('/:id/posts', async function(req, resp) {
  try{
    var posts_return = await postModel.find({'author': req.params.id});
    return resp.send(posts_return)
  }catch(err){
    return resp.send("Error can't get posts for user id")
  }
});


router.post("/login", async (request, response) => {
  try {
      var user = await userModel.findOne({ email: request.body.email }).exec();
      if(!user) {
          return response.status(400).send({ message: "The email does not exist" });
      }
      user.comparePassword(request.body.password, (error, match) => {
          if(!match) {
              return response.status(400).send({ message: "The password is invalid" });
          }
      });
      response.send({ message: "The username and password combination is correct!" });
  } catch (error) {
      response.status(500).send(error);
  }
});


module.exports = router