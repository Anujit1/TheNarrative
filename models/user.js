const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


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
}, { timestamps: true});


class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.status = 401;
  }
}


// hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.email = this.email.trim().toLowerCase();
  
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);

  next();
});


// check user signin credentials
userSchema.static('findByCredentials', async function(userEmail, password) {
  const email = userEmail.trim().toLowerCase();
  const user = await this.findOne({ email });
  if (!user) throw new AuthError('Invalid Email or Password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthError('Invalid Email or Password');

  return user;
});


const USER = mongoose.model('user', userSchema);


module.exports = USER;
