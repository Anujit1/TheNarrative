// modules
const mongoose = require('mongoose');

function connectMongodb(uri){
  mongoose.connect(uri)
    .then(e => console.log('Mongodb Connected'))
    .catch(e => console.log('Error', e));
}

module.exports = {
  connectMongodb
}