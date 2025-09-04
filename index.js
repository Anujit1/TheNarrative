// modules
const {PORT, MONGO_URI} = require('./config');
const { connectMongodb } = require('./connections');
const express = require('express');
const path = require('path');
const authRoute = require('./routes/auth')
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authentication');
const localsMiddleware = require('./middleware/locals');
const articleRoute = require('./routes/article');
const ARTICLE = require('./models/article');
const serverless = require('serverless-http');

// variables
const app = express();
connectMongodb(MONGO_URI);

// view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

//middleware
app.use(express.urlencoded({extended: false})); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(localsMiddleware);


// route
app.get('/', async (req, res) => {
  // Fetch articles + populate creator name
  const articles = await ARTICLE.find({})
    .populate('createdBy', 'fullname')
    .sort({ createdAt: -1 }) // latest first
    .lean(); // plain JS objects (lighter than mongoose docs)

  // Map only the fields you need
  const data = articles.map(article => ({
    title: article.title,
    content_html: article.content_html.substring(0, 70) + "...", // preview, first 200 chars
    coverImageURL: article.coverImageURL || '/images/default-cover.jpg', // fallback
    createdAt: new Date(article.createdAt).toLocaleDateString("en-US", { 
      weekday: "short", 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    }),
    creatorName: article.createdBy.fullname,
    slug: article.slug
  }));

  res.render('home', { articles: data });
});

app.use('/articles', articleRoute);

app.use('/auth', authRoute);

if (!process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
}

module.exports = app;
module.exports.handler = serverless(app);