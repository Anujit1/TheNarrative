const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { createUserToken } = require('../services/authentication');

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
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  password: {
    type: String,
    required: true
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


// hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);

  next();
});


// check user signin credentials
userSchema.static('findByCredentials', async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('Email not found!');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Password does not match!');

  return user;
});

const USER = mongoose.model('user', userSchema);

module.exports = USER;
