const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/public/html/data.html");
});

app.get("/data",function(req,res){
  res.sendFile(__dirname + "/public/html/data.html");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
   console.log("server is up and running on port 3000!!");
});
