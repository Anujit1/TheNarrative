const { createHmac, randomBytes } = require('crypto');
const mongoose = require('mongoose');
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

userSchema.pre('save', function (next) {
  const user = this;

  if(!user.isModified('password')) return;

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static('matchPassword', async function(email, password){
  const user = await this.findOne({email});

  // email error
  if(!user){ 
    return {status:null, err: 'Email not found!'};
  }

  const salt = user.salt;
  const userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest('hex');
  
  /* console.log("user.salt: ", salt, "\n", "rec-pass: ", password, "\n", "hash-rec pass: ", userProvidedHash, "\n", "hash pass: ", user.password, "\n");  // test for password match */

  //password error
  if (userProvidedHash !== user.password){ 
    return { status: false, err: 'Password does not match!' };
  }

  const token = createUserToken(user);

  return { status: true, token };
});

const USER = mongoose.model('user', userSchema);

module.exports = USER; 