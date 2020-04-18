const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    post_text: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel