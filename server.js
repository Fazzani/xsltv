var express = require("express");
var path    = require("path");
var app     = express();

app.use(express.static(__dirname + '/public'));
//Store all JS and CSS in Scripts folder.

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/tv.html'));
  //__dirname : It will resolve to your project folder.
});

app.listen(3000);

console.log("Running at Port 3000");