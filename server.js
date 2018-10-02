var express = require("express");
var path = require("path");
var app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
//Store all JS and CSS in Scripts folder.

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    //__dirname : It will resolve to your project folder.
});

app.listen(PORT);

console.log("Running at Port " + PORT);