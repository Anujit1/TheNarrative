const { Schema, model } = require('mongoose');


const commentSchema = new Schema({

  content: {
    type: String,
    required: true
  },
  articleId:{
    type: Schema.Types.ObjectId,
    ref: 'article',
    required: true
  },
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
  
}, { timestamps: true, versionKey: false });


const Comment = model('comment', commentSchema);

module.exports = Comment;