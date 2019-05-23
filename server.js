var express = require("express");
const fs = require('fs');
var app = express();
var router = express.Router();
var path = __dirname + '/';

app.use("/assets", express.static(__dirname + '/assets'));

app.post("/writeArticle", function (req, res) {
    fs.writeFile("articles.json", "JSON", req.body);
});

router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});

router.get("/", function (req, res) {
    res.sendFile(path + "index.html");
});

router.get("/writeArticle", function (req, res) {
    res.sendFile(path + "articleEditor.html");
});

app.use("/", router);

app.use("*", function (req, res) {
    res.sendFile(path + "404.html");
});

app.listen(3000, function () {
    console.log("Live at Port 3000");
});