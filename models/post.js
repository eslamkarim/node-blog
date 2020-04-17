const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    post_text: {type: String, required: true},
    author: {type: String, required: true}
})

const postModel = mongoose.model('User', postSchema);

module.exports = postModel