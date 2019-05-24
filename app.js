var express = require("express");
const fs = require('fs');
var app = express();
// var router = express.Router();
var path = __dirname + '/';

app.use(express.static(__dirname));

app.post('/articles.json', function (req, res) {
    // console.log(req);
    console.log('req received');
    data = JSON.stringify(req.body)
    fs.writeFile("articles.json", data);
    // res.redirect('/');
});

// router.use(function (req, res, next) {
//     console.log("/" + req.method);
//     next();
// });

// router.get("/", function (req, res) {
//     res.sendFile(path + "index.html");
// });

// router.get("/writeArticle", function (req, res) {
//     res.sendFile(path + "articleEditor.html");
// });

// router.get("/articles.json", function (req, res) {
//     res.sendFile(path + "articles.json");
// });

// router.post("/articles.json", function (req, res) {
//     res.sendFile(path + "articles.json");
// });

// app.use("/", router);

// app.use("*", function (req, res) {
//     res.sendFile(path + "404.html");
// });

app.listen(3000, function () {
    console.log("Live at Port 3000");
});