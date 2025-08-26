const JWT = require('jsonwebtoken');
const { SESSION_SECRET } = require('../config');

function createUserToken(user){
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl
  }

  const token = JWT.sign(payload, SESSION_SECRET);

  return token;
} 

function validateUserToken(userToken){
  const payload = JWT.verify(userToken, SESSION_SECRET);

  return payload;
}

module.exports = {
  createUserToken,
  validateUserToken
}