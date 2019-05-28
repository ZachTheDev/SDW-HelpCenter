var express = require('express'),
    app = express(),
    // router = express.Router(),
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
    var json = JSON.stringify(req.body);
    console.log(json);
    var obj = JSON.parse(json);
    console.log(obj);
    articleData = obj.articles;
    console.log(articleData);

    // fs.writeFile("articles.json", articleData, function (err) {
    //     if (err) {
    //         // there was an error
    //         console.log("error buddy: " + err);
    //     } else {
    //         // data written successfully
    //         console.log("write success bro");
    //     }
    // });

    fs.readFile('articles.json', function (err, d) {
        var data = JSON.parse(d);
        console.log("data:");
        console.log(data);
        // var array = [];
        // array.push(data);
        data.push(articleData);
        articles = JSON.stringify(data);
        // articleToAdd = JSON.stringify(array);
        // object.articles = articleToAdd;
        // console.log(object);
        console.log(articles);
        fs.writeFile("articles.json", articles, function (err) {
            if (err) {
                // there was an error :(
                console.log("error buddy: " + err);
            } else {
                // yeet then yote, this was a go
            }
        });
    });

    // fs.readFile('articles.json', function (err, data) {
    //     var jsonData = JSON.parse(data);
    //     // console.log(jsonData);
    //     jsonData['articles'].push(articleData);
    //     fs.writeFile("articles.json", jsonData, (error) => {
    //         console.log('error dude: ' + error);
    //     });
    // });

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