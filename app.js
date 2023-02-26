const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');


// express app
const app = express();


// connect to mongodb
const dburi = 'mongodb+srv://publicUser:x7puBs3r10@node-tutorial.vozlggy.mongodb.net/node-tutorial?retryWrites=true&w=majority'
mongoose.set('strictQuery', true);
mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
  .then( result => {
    console.log('connected to db')
    app.listen(3000, () => console.log('app listening on port 3000') );
  })
  .catch( err => console.log(err) );


// register view engine
app.set('view engine', 'ejs');


// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


// Routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});


// Blog routes
app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', {title: 'All Blogs', blogs: result})
    })
    .catch(err => console.log(err));
})

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);
  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => console.log(err));
});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => console.log(err));
})

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then( result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => console.log(err));
})

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
