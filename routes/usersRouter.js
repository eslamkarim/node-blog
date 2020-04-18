const express = require('express')
const router = express.Router()
const userModel = require('../models/user.js')
const postModel = require('../models/post.js')
const jwt = require('jsonwebtoken')
const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 300

router.get('/welcome', (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).end()
  }
  try {
    payload = jwt.verify(token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).end()
    }
    // otherwise, return a bad request error
    return res.status(400).end()
  }

})

router.post('/refresh', (req, res) => {
  // (BEGIN) The code uptil this point is the same as the first part of the `welcome` route
  const token = req.cookies.token

  if (!token) {
    return res.status(401).end()
  }

  var payload
  try {
    payload = jwt.verify(token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end()
    }
    return res.status(400).end()
  }
  // (END) The code uptil this point is the same as the first part of the `welcome` route

  // We ensure that a new token is not issued until enough time has elapsed
  // In this case, a new token will only be issued if the old token is within
  // 30 seconds of expiry. Otherwise, return a bad request status
  const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
  if (payload.exp - nowUnixSeconds > 30) {
    return res.status(400).end()
  }

  // Now, create a new token for the current user, with a renewed expiration time
  const newToken = jwt.sign({ username: payload.username }, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpirySeconds
  })

  // Set the new token as the users `token` cookie
  res.cookie('token', newToken, { maxAge: jwtExpirySeconds * 1000 })
  res.end()
})

router.get('/', async function(req, resp) {
  try{
    var user = await userModel.find({});
    return resp.json(user)
  }catch(err){
    return resp.send("can't return users")
  }
});

router.post('/',async function(req, resp) {
  try{
    var user = await userModel.create(req.body);
    return resp.json(user)
  }catch(err){
    return resp.send(err)
  }
});

router.put('/:id', async function(req, resp) {
  const token = req.cookies.token
  if (!token) {
    return resp.status(401).end()
  }

  try{
    var payload = jwt.verify(token, jwtKey)
    var user = await userModel.updateOne([{_id: req.params.id},{email: payload.email}] ,{ $set: req.body });  
    return resp.json(user)
  }catch(err){
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return resp.status(401).end()
    }
    // otherwise, return a bad request error
    return resp.status(400).end()
  }
});

router.delete('/:id',async function(req, resp) {
  const token = req.cookies.token
  if (!token) {
    return resp.status(401).end()
  }

  try{
    var payload = jwt.verify(token, jwtKey)
    var delete_response = await userModel.deleteOne([{_id: req.params.id},{email: payload.email}]);
    return resp.json(delete_response)
  }catch(err){
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return resp.status(401).end()
    }
    // otherwise, return a bad request error
    return resp.status(400).end()
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
  var email = request.body.email;
  var password = request.body.password;
  try {
      var user = await userModel.findOne({ email: email }).exec();
      if(!user) {
          return response.status(400).send({ message: "The email does not exist" });
      }
      user.comparePassword(password, (error, match) => {
          if(!match) {
              return response.status(400).send({ message: "The password is invalid" });
          }
      });
      const token = jwt.sign({ email }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds
      })
      console.log('token:', token)
    
      // set the cookie as the token string, with a similar max age as the token
      // here, the max age is in milliseconds, so we multiply by 1000
      response.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
      response.end()
  } catch (error) {
      response.status(500).send(error);
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

module.exports = router