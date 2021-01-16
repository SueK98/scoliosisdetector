var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
var axios = require("axios");
var exphbs = require("express-handlebars");
var fs = require("fs");
var apiURL = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/01c7f7b8-8865-4009-baf8-6e87b4558f1b/classify/iterations/Scoliosis-Severity-Classifier/image";

app.use(express.static(__dirname + "/public"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("home");
});

app.get("/testScoliosis", function(req,res){
    res.render("testScoliosis")
});

app.post("/testScoliosis", upload.single('scoliosisPhoto'), function(req,res){
    var fileName = "./uploads/" + req.file.filename;
    
    fs.readFile(fileName, function(err, data) {
      if (err) {
          res.send("There was an error, please try again")
      } else {
        const options = {
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "application/octet-stream",
            "Prediction-Key": "c29bb8d326904fea9fbf77994bb7305c"
          },
          url: apiURL
        };
        axios(options)
          .then(response => {
            console.log("getting an resp");
              console.log(response.data);
              var tag = response.data.predictions[0].tagName;

              if(tag == 'severe'){
                  res.render("severe", {img: data});
              }else if(tag == 'healthy'){
                res.render("healthy", {img: data});
              }else if(tag == 'mild'){
                res.render("mild", {img: data});
              }else{
                  res.redirect("/error")
              }
          })
          .catch(err => {
              console.log("getting an error");
            console.error(err.response);
            res.send(err.response);
          });
      }
    });
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

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on localhost:3000");
});