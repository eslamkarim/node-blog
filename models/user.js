const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email:{type: String, required: true, match: /^\w+\@\w+\.\w/, unique: true},
    password: {type: String, required: true},
    gender: {type: String, enum: ['m', 'f']}
})

userSchema.statics.getUserByGender = function getUserByGender(gender, cb) {
    this.find({gender: gender}, cb)
}

userSchema.methods.getFullName = function getFullName() {
    return this.firstName+" "+this.lastName
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel