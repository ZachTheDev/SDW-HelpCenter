var express = require('express'),
    app = express(),
    router = express.Router(),
    port = 3000,
    fs = require('fs');
var bodyParser = require('body-parser');
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(port, function () {
    console.log("Live at Port " + port);
});

app.post("/endpoint", function (req, res) {
    console.log(req.body);
    var articleData = JSON.stringify(req.body);
    // fs.writeFile("articles.json", articleData, (error) => {
    //     console.log('error boi: ' + error);
    // });
    fs.readFile('articles.json', function (err, data) {
        console.log(data);
        jsonData = JSON.parse(data);
        console.log(jsonData);
        jsonData.push(articleData);
        fs.writeFile("articles.json", jsonData, (error) => {
            console.log('error dude: ' + error);
        });
    });

    // res.send({
    //     status: 'SUCCESS'
    // });
});


// var router = express.Router();
// var path = __dirname + '/';

// app.post('/articles.json', function (req, res) {
//     // console.log(req);
//     console.log('req received');
//     data = JSON.stringify(req.body)
//     fs.writeFile("articles.json", data);
//     // res.redirect('/');
// });

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