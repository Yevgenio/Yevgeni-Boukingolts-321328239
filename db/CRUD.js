var sql = require('./db');
const path = require('path');
const csv=require('csvtojson');
const multer = require("multer");
const fs = require("fs");
const cookieParser = require('cookie-parser');
const server_side = require('../static/server_side');

const UserSignUp = (req,res)=>{
  // validate body exists
  if (!req.body) {
      res.status(400).send('error' ,{message: "content cannot be empty"});
      return;
  }
  const NewUserSignIn = {
      "name": req.body.name,
      "email": req.body.email,
      "password": req.body.password,
      "phone": req.body.phone,
      "avatar": "default"
  }
  res.cookie("name", req.body.name);
  res.cookie("email", req.body.email);
  res.cookie("password", req.body.password);
  
  // run qury
  const Q1 = 'INSERT INTO users SET ?';
  sql.query(Q1, NewUserSignIn, (err, mysqlres) =>{
      if (err) {
          console.log("error: error: ", err);
          res.status(400).render('error' , {message:"could not sign up"});
          return;
      }
      res.redirect('/home');
      return;
  })
};

const UserLogin = (req, res) => {
  if (!req.body) {
    res.status(400).send('error' ,{message: "content cannot be empty"});
    return;
  }  
  const { name, password } = req.body;
  const Q1 = 'SELECT * FROM users WHERE name = ? AND password = ?';
  sql.query(Q1,[name, password],(error, results) => {
      if (error) {
        res.status(500).send('An error occurred while checking login credentials');
      } else if (results.length === 0) {
        res.status(401).send('Invalid login credentials');
      } else {
        const user = results[0];
        // const { id, name } = user;
        res.cookie("name", user.name);
        res.cookie("email", user.email);
        res.cookie("password", user.password);
        res.redirect('/home');
        return;
      }
    }
  );
};

const UpdateUser = (req, res) => {
  const name = req.cookies.name;
  sql.query(
  'SELECT * FROM users WHERE name = ?',[name],(error, results) => {
    if (error) {
      res.status(500).send('An error occurred while fetching user');
    } else if (results.length === 0) {
      res.status(404).send('User not found');
    } else {
      const user = results[0];
      const variables = { 
          user: user,
          ...server_side.layout_variables(req)
    }
    res.render('settings', variables);
    return;
  }
}
);
};

const UserUpdated = (req, res) => {
  if (!req.body) {
    res.status(400).send('error' ,{message: "content cannot be empty"});
    return;
  }
  const { name, email, password, phone} = req.body;

  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "../static/images/"+ name +".png");

  if (path.extname(req.file.originalname).toLowerCase() === ".png") {
    fs.rename(tempPath, targetPath, err => {
      if (err) {
        console.log("error: error: ", err);
        res.status(400).send({message:"could not upload 1"});
        return;
    }

    sql.query(
      'UPDATE users SET email = ?, password = ?, phone = ?, avatar = name WHERE name = ?', 
      [email, password, phone, name], 
      (error, results) => {
      if (error) {
        res.status(500).send('An error occurred while fetching user');
      } else if (results.length === 0) {
        res.status(404).send('User not found');
      } else {
      res.redirect('/home');
      return;
    }
  }
  );
    });
  } else {
    fs.unlink(tempPath, err => {
      if (err) {
        console.log("error: error: ", err);
        res.status(400).send({message:"could not upload 1"});
        return;
    }

      res
        .status(403)
        .contentType("text/plain")
        .end("Only .png files are allowed!");
    });
  }


  
};

const UserLogout = (req, res) => {
  // get the data
  res.clearCookie('email')
  res.clearCookie('password')
  res.clearCookie('name')
  return res.redirect("/home");
};

//(SELECT p.id, COUNT(l.post_id) AS likes
//FROM posts p
//LEFT JOIN likes l ON p.id = l.post_id
//GROUP BY p.id) as posts

const showAccount = (req,res) => {
  const { name } = req.params;
  
  sql.query(`   
      SELECT * , DATE_FORMAT(created, '%Y-%m-%d %H:%i') AS time 
      FROM users WHERE name = ?`,[name],(error, results) => {
    if (error) {
      res.status(500).send('An error occurred while fetching user');
    } else if (results.length === 0) {
      res.status(404).send('User not found');
    } else {
      const user = results[0];
      const Q1 = `
      SELECT * , TIMESTAMPDIFF(HOUR, posts.date, NOW()) AS time 
      FROM (
        SELECT p.*, COUNT(r.reply_id) AS replies
        FROM (SELECT p.* , COUNT(l.post_id) AS likes
              FROM posts p
              LEFT JOIN likes l ON p.post_id = l.post_id
              GROUP BY p.post_id) as p
        LEFT JOIN posts r ON p.post_id = r.reply_id
        GROUP BY p.post_id
      ) as posts  
      JOIN users ON posts.name = users.name
      WHERE users.name = ?
      ORDER BY posts.date DESC`
    sql.query(Q1,[name],(err, mysqlres)=>{
    if (err) {
        console.log("error: error: ", err);
        res.status(400).send({message:"could not search user posts"});
        return;
    }
    const variables = { 
          user: user,
          posts: mysqlres,
          ...server_side.layout_variables(req)
    }
    res.render('user', variables);
    return;
  })
}
}
);
}

// SELECT p.*, COUNT(r.id) AS reply_count
// FROM posts p
// LEFT JOIN posts r ON p.post_id = r.reply_id
// GROUP BY p.post_id;

const showPosts = (req,res) => {
  const Q1 = `
        SELECT * , TIMESTAMPDIFF(HOUR, posts.date, NOW()) AS time 
        FROM (
          SELECT p.*, COUNT(r.reply_id) AS replies
          FROM (SELECT p.* , COUNT(l.post_id) AS likes
                FROM posts p
                LEFT JOIN likes l ON p.post_id = l.post_id
                GROUP BY p.post_id) p
          LEFT JOIN posts r ON p.post_id = r.reply_id
          GROUP BY p.post_id
        ) as posts 
        JOIN users ON posts.name = users.name
        ORDER BY posts.date DESC`
  sql.query(Q1,(err, mysqlres)=>{
      if (err) {
          console.log("error: error: ", err);
          res.status(400).send({message:"could not search posts"});
          return;
      }
      const variables = { posts: mysqlres,
        ...server_side.layout_variables(req)
      }
      res.render('main', variables);
      return;
  })
}

const showTrending = (req,res) => {
  const Q1 = `
        SELECT * , TIMESTAMPDIFF(HOUR, posts.date, NOW()) AS time 
        FROM (
          SELECT p.*, COUNT(r.reply_id) AS replies
          FROM (SELECT p.* , COUNT(l.post_id) AS likes
                FROM posts p
                LEFT JOIN likes l ON p.post_id = l.post_id
                GROUP BY p.post_id) p
          LEFT JOIN posts r ON p.post_id = r.reply_id
          GROUP BY p.post_id
        ) as posts 
        JOIN users ON posts.name = users.name
        ORDER BY posts.likes DESC`
  sql.query(Q1,(err, mysqlres)=>{
      if (err) {
          console.log("error: error: ", err);
          res.status(400).send({message:"could not search posts"});
          return;
      }
      const variables = { posts: mysqlres,
        ...server_side.layout_variables(req)
      }
      res.render('main', variables);
      return;
  })
}

const showEvents = (req,res) => {
  const Q1 = `
        SELECT * , TIMESTAMPDIFF(HOUR, posts.date, NOW()) AS time 
        FROM (
          SELECT p.*, COUNT(r.reply_id) AS replies
          FROM (SELECT p.* , COUNT(l.post_id) AS likes
                FROM posts p
                LEFT JOIN likes l ON p.post_id = l.post_id
                GROUP BY p.post_id) p
          LEFT JOIN posts r ON p.post_id = r.reply_id
          GROUP BY p.post_id
        ) as posts 
        JOIN users ON posts.name = users.name
        ORDER BY posts.replies DESC`
  sql.query(Q1,(err, mysqlres)=>{
      if (err) {
          console.log("error: error: ", err);
          res.status(400).send({message:"could not search posts"});
          return;
      }
      const variables = { posts: mysqlres,
        ...server_side.layout_variables(req)
      }
      res.render('main', variables);
      return;
  })
}

const showFresh = (req,res) => {
  const Q1 = `
        SELECT * , TIMESTAMPDIFF(HOUR, posts.date, NOW()) AS time 
        FROM (
          SELECT p.*, COUNT(r.reply_id) AS replies
          FROM (SELECT p.* , COUNT(l.post_id) AS likes
                FROM posts p
                LEFT JOIN likes l ON p.post_id = l.post_id
                GROUP BY p.post_id) p
          LEFT JOIN posts r ON p.post_id = r.reply_id
          GROUP BY p.post_id
        ) as posts 
        JOIN users ON posts.name = users.name
        WHERE posts.replies = 0 AND posts.likes = 0`
  sql.query(Q1,(err, mysqlres)=>{
      if (err) {
          console.log("error: error: ", err);
          res.status(400).send({message:"could not search posts"});
          return;
      }
      const variables = { posts: mysqlres,
        ...server_side.layout_variables(req)
      }
      res.render('main', variables);
      return;
  })
}


const goToPost = (req,res) => {
  const { id } = req.params;
  const Q1 = `
    SELECT * , DATE_FORMAT(posts.date, '%Y-%m-%d %H:%i') AS time 
    FROM (
      SELECT p.*, COUNT(r.reply_id) AS replies
      FROM (SELECT p.* , COUNT(l.post_id) AS likes
            FROM posts p
            LEFT JOIN likes l ON p.post_id = l.post_id
            GROUP BY p.post_id) p
      LEFT JOIN posts r ON p.post_id = r.reply_id
      GROUP BY p.post_id
    ) as posts  
    JOIN users ON posts.name = users.name 
    WHERE post_id = ?`
    sql.query(Q1,[id],(error, results) => {
    if (error) {
      res.status(500).send('An error occurred while fetching user');
    } else if (results.length === 0) {
      res.status(404).send('User not found');
    } else {
      const post = results[0];
      const Q1 = `
        SELECT * , TIMESTAMPDIFF(HOUR, posts.date, NOW()) AS time 
        FROM (
          SELECT p.*, COUNT(r.reply_id) AS replies
          FROM (SELECT p.* , COUNT(l.post_id) AS likes
                FROM posts p
                LEFT JOIN likes l ON p.post_id = l.post_id
                GROUP BY p.post_id) p
          LEFT JOIN posts r ON p.post_id = r.reply_id
          GROUP BY p.post_id
        ) as posts  
        JOIN users ON posts.name = users.name
        WHERE reply_id = ?
        ORDER BY posts.date DESC`
      sql.query(Q1,[id],(err, mysqlres)=>{
      if (err) {
          console.log("error: error: ", err);
          res.status(400).send({message:"could not search posts"});
          return;
      }
      const variables = { 
        post: post,
        posts: mysqlres,
        ...server_side.layout_variables(req)
      }
      res.render('post', variables);
      return;
  })
    }
  }
);
}

const showNotifications = (req,res) => {
  const name = req.cookies.name;
  const Q1 = `
        SELECT users_reply.name AS name, 
                users_reply.avatar AS avatar, 
                posts_reply.post_id as post_id,
                TIMESTAMPDIFF(HOUR, posts_reply.date, NOW()) AS time
        FROM posts AS posts_original
        JOIN users AS users_original ON posts_original.name = users_original.name
        JOIN posts AS posts_reply ON posts_reply.reply_id = posts_original.post_id
        JOIN users AS users_reply ON posts_reply.name = users_reply.name
        WHERE users_original.name = ?
        ORDER BY posts_reply.date DESC`
  sql.query(Q1,[name],(err, mysqlres)=>{
      if (err) {
          console.log("error: error: ", err);
          res.status(400).send({message:"could not search posts"});
          return;
      }
      const variables = { notifications: mysqlres,
        ...server_side.layout_variables(req)
      }
      res.render('notifications', variables);
      return;
  })
}

const postComment = (req,res)=>{
  // validate body exists
  if (!req.body) {
      res.status(400).send('error' ,{message: "content cannot be empty"});
      return;
  }


const newPost = {
      "reply_id": req.body.reply_id,
      "name": req.cookies.name,
      "message": req.body.message,
  }

  // run qury
  const Q1 = 'INSERT INTO posts SET ?';
  sql.query(Q1, newPost, (err, mysqlres) =>{
      if (err) {
          console.log("error: error: ", err);
          res.status(400).render('error' , {message:"could not submit post"});
          return;
      }
      res.redirect(req.get('referer'));
      // res.redirect('/post/'+req.body.reply_id);
      return;
  })
};

const leaveLike = (req,res)=>{
  // validate body exists
  if (!req.body) {
      res.status(400).send('error' ,{message: "content cannot be empty"});
      return;
  }

  const newPost = {
      "post_id": req.body.post_id,
      "name": req.cookies.name,
  }
  const Q1 = 'INSERT INTO likes SET ?';
  sql.query(Q1, newPost, (err, mysqlres) =>{
      if (err) {
          console.log("error: error: ", err);
          res.status(400).render('error' , {message:"could not submit post"});
          res.redirect(req.get('referer'));
          return;
      }
      res.redirect(req.get('referer'));
      // res.redirect('back');
      // res.redirect('/home');
      return;
  })
};

const search = (req,res) => {
  // validate body exists
  if (!req.body) {
    res.status(400).send('error' ,{message: "content cannot be empty"});
    return;
  } 

  const search = req.query.value;
  console.log(search)
  const Q1 = `
        SELECT * FROM posts JOIN users ON posts.name = users.name
        WHERE posts.name LIKE ? OR posts.message LIKE ?
        ORDER BY posts.date DESC`
  sql.query(Q1,['%'+search+'%','%'+search+'%'],(err, mysqlres)=>{
      if (err) {
          console.log("error: error: ", err);
          res.status(400).send({message:"could not search posts"});
          return;
      }
      const variables = { posts: mysqlres,
        ...server_side.layout_variables(req)
      }
      res.render('main', variables);
      return;
  })
}

module.exports = {
  UserSignUp, 
  UserLogin, 
  UserLogout,
  showPosts,
  showTrending,
  showEvents,
  showFresh,
  goToPost,
  postComment,
  showAccount,
  UpdateUser,
  UserUpdated,
  showNotifications,
  leaveLike,
  search
};

