const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')


var app = express();


app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', function(req, resp) {
    return resp.status(200).send("This is working hi!")
});
app.listen(3000, function () {
  console.log('listening on port 3000!');
});