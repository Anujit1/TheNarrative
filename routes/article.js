const router = require('express').Router();
const sanitizeHtml = require('sanitize-html');
const Article = require('../models/Article');
const { restrictTo } = require('../middleware/authentication');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');


// ---------- Multer Storage Config ----------

// Cover image storage
const coverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const articleId = req.articleId; 

    const uploadPath = path.resolve(`./public/uploads/${req.user._id}/${articleId}/cover`);
    fs.mkdirSync(uploadPath, { recursive: true });
    

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {

    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Inline image storage
const inlineStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const articleId = req.params.articleId;
    const uploadPath = path.resolve(`./public/uploads/${req.user._id}/${articleId}/inline`);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadCover = multer({ storage: coverStorage });
const uploadInline = multer({ storage: inlineStorage });


// ---------- Routes ----------


// no use
/* // GET /articles - list all
router.get('/', async (req, res) => {
  const articles = await Article.find()
    .populate('createdBy', 'fullname')
    .sort({ createdAt: -1 })
    .lean();

  res.render('articles/listArticle', { articles });
}); */


//  -- create route --
// GET /articles/create - render create form
router.get('/create', restrictTo(['USER', 'ADMIN']), (req, res) => {
  const articleId = new mongoose.Types.ObjectId();  // generate here
  req.articleId = articleId;
  res.render('articles/create', { articleId });
});

// POST /articles - save new article with cover image
router.post(
  '/',

  restrictTo(['USER', 'ADMIN']),

  (req, res, next) => {
    req.articleId = req.query.articleId
    next();
  },

  uploadCover.single('coverImageURL'),

  async (req, res) => {
    const { title, content_html, content_delta, readingTimeMin, articleId } = req.body;
    const cleanHtml = sanitizeHtml(content_html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1','h2','h3','img','pre','code']),
      allowedAttributes: {
        a: ['href','name','target','rel'],
        img: ['src','alt'],
        code: ['class'], pre: ['class'],
        '*': ['style']
      },
      allowedSchemesByTag: { img: ['data','http','https'] }
    });
    
    const coverImageURL = req.file? `/uploads/${req.user._id}/${articleId}/cover/${req.file.filename}` : null;
   
    let delta = {};
    try {
      delta = content_delta ? JSON.parse(content_delta) : {};
    } catch (e) {
      console.error("Failed to parse content_delta:", e);
      delta = {};
    }
    

    const article = await Article.create({
      _id: articleId,   // reuse the one from hidden field
      title: title.trim(),
      content_html: cleanHtml,
      content_delta: delta,
      createdBy: req.user._id,
      readingTimeMin,
      coverImageURL
    });

    // res.redirect(`/articles/${article.slug}`);
    res.redirect('/');
  }
);

// POST /articles/:articleId/upload-image - inline image uploads
router.post('/:articleId/upload-image', restrictTo(['USER', 'ADMIN']),
  uploadInline.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.user._id}/${req.params.articleId}/inline/${req.file.filename}`;
    res.json({ url: imageUrl });
  }
);


//  -- view an article by id, route --
// GET /articles/:slug - view single article
router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
    .populate('createdBy', 'fullname')
    .lean();

  if (!article) return res.status(404).send('Article not found');

  
  res.render('articles/viewArticle', { article });
});


module.exports = router;
