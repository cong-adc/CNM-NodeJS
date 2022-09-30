 const express = require("express")
 const app = express()
 const formidable = require('formidable')
 app.set("view engine", "ejs");
 app.set("views", "./template");
 require('dotenv').config()

 const multer = require('multer')
const upload = multer()

 const AWS = require("aws-sdk");

 const config = new AWS.Config(
    {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS,
        region: process.env.AWS_REGION
    }
 )


 AWS.config = config;

 const docClient = new AWS.DynamoDB.DocumentClient();

 const tableName = "students";

 app.get("/", (req, res) => {

    const params = {
        TableName: tableName,
    }

    docClient.scan(params, (err, doc) => {
        if(err) {
            console.log(err);
            return res.send("failed to scan")   
        }   else {
            // console.log(doc);
           return res.render("index", {students: doc.Items})
        }
    })
})

 app.get("/api/delete/:id", (req, res) => {
    const params = {
        TableName: tableName,
        Key: {
            maSV: req.params.id,
        }
    }
    docClient.delete(params, (err, data) => {
        if(err) {
            console.error(err)
             res.send('FAIL')
        } else {
             res.redirect("/")
        }
    }) })

app.post("/api/create", upload.single() , (req, res) => {

    const values = req.body;

    // console.log('====================================');
    // console.log(values);
    // console.log('====================================');
    const params = {
        TableName: tableName,
        Item: {
            maSV: new Date().getTime().toString(),
            ...values,
        }
    }
    
    docClient.put(params, (err, data) => {
        if(err) {
            console.error(err)
             res.send('FAIL')
        } else {
             res.redirect("/")
        }
    })

    // var form = new formidable.IncomingForm();
    // form.parse(req, function(err, fields, files) {
    //     let firstName = fields.firstName;
    //     let lastName = fields.lastName;
    //     arr.push({
    //         id: arr.length + 1,
    //         firstName,
    //         lastName,
    //     })
    // });
    // res.redirect("/")
})



 let arr = []

//  app.get("/", (req, res) => {
//      res.render("index", { students: arr });
//  })

//  app.get("/api/delete/:id", (req, res) => {
//      arr = arr.filter(({ id }) => id != req.params.id)
//      res.redirect("/")
//  })

//  app.post("/api/create", (req, res) => {
//      var form = new formidable.IncomingForm();
//      form.parse(req, function(err, fields, files) {
//          let firstName = fields.firstName;
//          let lastName = fields.lastName;
//          arr.push({
//              id: arr.length + 1,
//              firstName,
//              lastName,
//          })
//      });
//      res.redirect("/")
//  })

 app.listen(5000, () => console.log("Success"))