const mongoose = require('mongoose')
const Bcrypt = require('bcrypt')
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

userSchema.pre('save',function(next){
    if(!this.isModified("password")) {
        return next();
    }
    this.password = Bcrypt.hashSync(this.password, 10);
    next();
})

userSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, Bcrypt.compareSync(plaintext, this.password));
};
const userModel = mongoose.model('User', userSchema);

module.exports = userModel