const slugify = require('slugify'); 
const {Schema, model } = require('mongoose');

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 160
  },
  content_html: {
    type: String,
    required: true
  },
  content_delta: {
    type: Object,
    required: true
  },
  coverImageURL: {
    type: String,
    default: null
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  readingTimeMin: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true,
  versionKey: false
});

// Auto-generate slug from title if not set
ArticleSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Optional: quick text index for search
ArticleSchema.index({ title: 'text' });

module.exports = model('article', ArticleSchema);
