const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/data",function(req,res){
  res.sendFile(__dirname + "/public/html/data.html");
});


// app.post("/data",function(req,res){
//     console.log(req.body.userName);
//     const userName = req.body.userName;
//     const url = "https://codeforces.com/api/user.info?handles="+userName;
//
//     request(url,function(error,response){
//         let data = JSON.parse(response.body);
//         console.log(data.result[0].problem);
//     });
//     res.send("done");
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
   console.log("server is up and running on port 3000!!");
});
