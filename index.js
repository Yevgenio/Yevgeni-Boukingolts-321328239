const express = require('express');
const path = require('path');
const BodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require("multer");
const fs = require("fs");
const sql = require('./db/db');
const CreateDB = require('./db/CreateDB');
const CRUD = require('./db/CRUD');
const server_side = require('./static/server_side');
const port = 3000;

const upload = multer({
    dest: "/temporary"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });

const app = express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'static')));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');


app.get('/', (req, res)=>{
    res.redirect('/home');
});

app.get('/home', CRUD.showPosts);

app.get('/trending', CRUD.showTrending);

app.get('/events', CRUD.showEvents);

app.get('/fresh', CRUD.showFresh);

app.get('/login', (req,res)=>{
    const variables = { 
        title: 'Login',
        ...server_side.layout_variables(req)
  }
    res.render('login', variables);
});

app.post('/UserLogin', CRUD.UserLogin);

app.get('/signup', (req,res)=>{
    const variables = { 
        title: 'Signup',
        ...server_side.layout_variables(req)
  }
    res.render('signup', variables);
});

app.post('/UserSignUp', CRUD.UserSignUp);

app.get('/logout', CRUD.UserLogout);

app.get('/user/:name', CRUD.showAccount);

app.get('/notifications', CRUD.showNotifications);

app.get('/settings', CRUD.UpdateUser);

app.post('/UserUpdated', upload.single("avatar"), CRUD.UserUpdated);

app.get('/post/:id', CRUD.goToPost);

app.post('/postComment', CRUD.postComment);

app.post('/leaveLike', CRUD.leaveLike);

app.post('/removeLike', CRUD.removeLike);

app.get('/search', CRUD.search);

// cretae DB
app.get('/create_users', CreateDB.create_users);
app.get('/create_posts', CreateDB.create_posts);
app.get('/create_likes', CreateDB.create_likes);
app.get('/insert_users', CreateDB.insert_users); 
app.get('/insert_posts', CreateDB.insert_posts); 
app.get('/insert_likes', CreateDB.insert_likes); 
app.get('/read_users', CreateDB.read_users); 
app.get('/read_posts', CreateDB.read_posts); 
app.get('/read_likes', CreateDB.read_likes); 
app.get('/drop_likes', CreateDB.drop_likes)
app.get('/drop_posts', CreateDB.drop_posts)
app.get('/drop_users', CreateDB.drop_users)


app.listen(port,()=>{
    console.log("server is running on port ", port);
})
