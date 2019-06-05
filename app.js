var express = require('express'),
    app = express(),
    // router = express.Router(),
    port = process.env.PORT || 3000,
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

var elasticlunr = require('elasticlunr');

var idx = elasticlunr(function () {
    this.setRef('id');
    this.addField('title');
    this.addField('body');
});

fs.readFile('articles.json', function (err, data) {
    if (err) throw err;
    var raw = JSON.parse(data);
    // console.log(raw);
    var articles = raw.map(function (a) {
        return {
            id: a.id,
            title: a.data.title,
            body: a.data.markdown
        };
    });
    articles.forEach(function (article) {
        idx.addDoc(article);
    });
    fs.writeFile('index.json', JSON.stringify(idx), function (err) {
        if (err) throw err;
        console.log('index created');
    });
});

module.exports = idx;

// console.log(index.search("example"));

app.post("/endpoint", function (req, res) {
    var json = JSON.stringify(req.body);
    // console.log(json);
    var obj = JSON.parse(json);
    // console.log(obj);
    articleData = obj.articles;
    // console.log(articleData);
    var doc = {};
    doc.id = articleData.id;
    doc.title = articleData.data.title;
    doc.body = articleData.data.markdown;
    idx.addDoc(doc);
    // console.log(JSON.stringify(idx));
    // console.log(doc);
    fs.readFile('articles.json', function (err, d) {
        var data = JSON.parse(d);
        // console.log("data:");
        // console.log(data);
        data.push(articleData);
        articles = JSON.stringify(data);
        // console.log(articles);
        fs.writeFile("articles.json", articles, function (err) {
            if (err) {
                // there was an error :(
                console.log("error buddy: " + err);
            } else {
                // yeet then yote, this was a go
            }
        });
    });
});

app.post("/articleSender", function (req, res) {

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