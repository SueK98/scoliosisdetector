const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.render("home");
});

app.get("/healthy", function(req, res){
    res.render("healthy");
});

app.get("/mild", function(req, res){
    res.render("mild");
});

app.get("/severe", function(req, res){
    res.render("severe");
});

app.get("/testScoliosis", function(req, res){
    res.render("testScoliosis");
});

app.listen(3000, function(){
    console.log("Server started on localhost:3000");
});