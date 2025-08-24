const { createHmac, randomBytes } = require('crypto');
const { Schema } = require('mongoose');

const userSchema = new Schema({
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
    enum: ['MALE', 'FEMALE'],
    required: true
  },
  password:{
    type: String,
    required: true
  },
  salt: {
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

userSchema.pre('save', function () {
  const user = this;

  if(!user.isModified('password')) return;

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

  this.salt = salt;
  this.password = hashedPassword;

  next();  
})

const USER = model('user', userSchema);

module.exports = USER;