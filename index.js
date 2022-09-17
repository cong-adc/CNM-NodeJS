 const express = require("express")
 const app = express()
 const formidable = require('formidable')
 app.set("view engine", "ejs");
 app.set("views", "./template");

 let arr = []

 app.get("/", (req, res) => {
     res.render("index", { students: arr });
 })

 app.get("/api/delete/:id", (req, res) => {
     arr = arr.filter(({ id }) => id != req.params.id)
     res.redirect("/")
 })

 app.post("/api/create", (req, res) => {
     var form = new formidable.IncomingForm();
     form.parse(req, function(err, fields, files) {
         let firstName = fields.firstName;
         let lastName = fields.lastName;
         arr.push({
             id: arr.length + 1,
             firstName,
             lastName,
         })
     });
     res.redirect("/")
 })

 app.listen(5000, () => console.log("Success"))