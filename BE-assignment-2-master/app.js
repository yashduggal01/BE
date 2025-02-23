const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.redirect('/posts'); // Redirect to the /posts page
});

app.get('/posts', (req, res) => {
  const posts = JSON.parse(fs.readFileSync('posts.json', 'utf-8'));
  res.render('index', { posts });
});

app.get('/post', (req, res) => {
  const posts = JSON.parse(fs.readFileSync('posts.json', 'utf-8'));
  const post = posts.find(p => p.id === parseInt(req.query.id));
  res.render('post', { post });
});

app.get('/add-post', (req, res) => {
  res.render('add-post');
});

app.post('/add-post', (req, res) => {
  const posts = JSON.parse(fs.readFileSync('posts.json', 'utf-8'));
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content
  };
  posts.push(newPost);
  fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
  res.redirect('/posts');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});