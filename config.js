require('dotenv').config();

const config = {
  PORT: process.env.PORT || 8080,
  MONGO_URI: process.env.MONGO_URI,
  SESSION_SECRET: process.env.SESSION_SECRET 
}

module.exports = config;