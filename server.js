var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/public';

app.use("/assets", express.static(__dirname + '/assets'));

app.post("/add-tasks", function (req, res) {
    fs.write("tasks.json", "JSON", req.body);
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