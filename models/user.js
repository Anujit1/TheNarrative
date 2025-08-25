const { createHmac, randomBytes } = require('crypto');
const mongoose = require('mongoose');
const { nextTick } = require('process');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender:{
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  password:{
    type: String,
    required: true
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: '/images/profile-image-avatar/default-user-profile.png'
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  }
});

userSchema.pre('save', function () {
  const user = this;

  if(!user.isModified('password')) return;

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

  this.salt = salt;
  this.password = hashedPassword;

  nextTick;
})

const USER = mongoose.model('user', userSchema);

module.exports = USER; 