const express = require('express');
const usersRouter = require('./routes/usersRouter')
const postsRouter = require('./routes/postsRouter')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true, useUnifiedTopology: true });

var app = express();


app.use(express.json())
app.use('/users', usersRouter)
app.use('/posts', postsRouter)

app.listen(3000, function () {
  console.log('listening on port 3000!');
});