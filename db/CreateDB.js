var SQL = require('./db');
const path = require('path');
const csv=require('csvtojson');

//create user table
const create_users = (req,res,next)=> {
    var Q1 = `
    CREATE TABLE IF NOT EXISTS users (
        name VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        avatar VARCHAR(50) NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
    SQL.query(Q1,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating <users> table"});
            return;
        }
        console.log('created <users> table');
        res.send("<users> table created");
        return;
    })
    next;   
}

const create_posts = (req,res,next)=> {
    var Q1 = `
    CREATE TABLE IF NOT EXISTS posts (
        post_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        reply_id INT,
        FOREIGN KEY (name) REFERENCES users (name)
    )
  `;
    SQL.query(Q1,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating <posts> table"});
            return;
        }
        console.log('created <posts> table');
        res.send("<posts> table created");
        return;
    })
    next;   
}

const create_likes = (req,res,next)=> {
    var Q1 = `
    CREATE TABLE likes (
        post_id INT,
        name VARCHAR(50),
        PRIMARY KEY (post_id, name)
      );
  `;
    SQL.query(Q1,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating <posts> table"});
            return;
        }
        console.log('created <likes> table');
        res.send("<likes> table created");
        return;
    })
    next;   
}

const insert_users = (req,res)=>{
    var Q2 = "INSERT INTO users SET ?";
    const csvFilePath= path.join(__dirname, "users.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var NewEntry = {
            "name": element.name,
            "email": element.email,
            "password": element.password,
            "phone": element.phone,
            "avatar": element.avatar
        }
        SQL.query(Q2, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly into users");
        });
    });
    });
    
    res.send("data inserted");

};

const insert_posts = (req,res)=>{
    var Q2 = "INSERT INTO posts SET ?";
    const csvFilePath= path.join(__dirname, "posts.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var NewEntry = {
            "post_id": element.post_id,
            "name": element.name,
            "message": element.message,
            "date": element.date,
            "reply_id": element.reply_id
        }
        SQL.query(Q2, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly into posts");
        });
    });
    });
    res.send("data inserted");
};

const insert_likes = (req,res)=>{
    var Q2 = "INSERT INTO likes SET ?";
    const csvFilePath= path.join(__dirname, "likes.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var NewEntry = {
            "post_id": element.post_id,
            "name": element.name
        }
        SQL.query(Q2, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly into likes");
        });
    });
    });
    res.send("data inserted");
};

const drop_users = (req, res)=>{
    const table_name = "users"
    var Q4 = "DROP TABLE " + table_name;
    SQL.query(Q4, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping "+ table_name + "table:", err);
            res.status(400).send({message: "error om dropping"+ table_name + "table:" + err});
            return;
        }
        console.log(table_name + " table dropped");
        res.send(table_name + " table dropped");
        return;
    })
}

const drop_posts = (req, res)=>{
    const table_name = "posts"
    var Q4 = "DROP TABLE " + table_name;
    SQL.query(Q4, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping "+ table_name + "table:", err);
            res.status(400).send({message: "error om dropping"+ table_name + "table:" + err});
            return;
        }
        console.log(table_name + " table dropped");
        res.send(table_name + " table dropped");
        return;
    })
}

const drop_likes = (req, res)=>{
    const table_name = "likes"
    var Q4 = "DROP TABLE " + table_name;
    SQL.query(Q4, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping "+ table_name + "table:", err);
            res.status(400).send({message: "error om dropping"+ table_name + "table:" + err});
            return;
        }
        console.log(table_name + " table dropped");
        res.send(table_name + " table dropped");
        return;
    })
}

module.exports = {
    create_users,
    create_posts,
    create_likes, 
    insert_users,
    insert_posts,
    insert_likes,
    drop_users, 
    drop_posts,
    drop_likes};
// module.exports = {init_table, insert_table, CreateTable, InsertData, ShowTable, drop};

