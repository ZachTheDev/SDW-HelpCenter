require([
    'assets/js/jquery.js',
    'assets/js/mustache.js',
    'assets/js/elasticlunr.js',
    'text!templates/article_list.mustache',
    'text!articles.json',
    'text!index.json'
], function (_, Mustache, elasticlunr, articleList, data, pullIndex) {
    var renderArticleList = function (qs) {
        $("#question-list-container")
            .empty()
            .append(Mustache.to_html(articleList, {
                articles: qs
            }));
    };

    // var idx = elasticlunr(function () {
    //     this.setRef('id');
    //     this.addField('title');
    //     this.addField('body');
    // });

    var idxTemp = JSON.parse(pullIndex);
    console.time('load');
    window.idx = elasticlunr.Index.load(idxTemp);

    window.search = function (term) {
        idx.search(term);
    };

    var articles = JSON.parse(data).map(function (a) {
        return {
            id: a.id,
            title: a.data.title,
            body: a.data.markdown
        };
    });

    renderArticleList(articles);

    $('a.all').bind('click', function () {
        renderArticleList(articles);
        $('input').val('');
    });

    var debounce = function (fn) {
        var timeout;
        return function () {
            var args = Array.prototype.slice.call(arguments),
                ctx = this;

            clearTimeout(timeout);
            timeout = setTimeout(function () {
                fn.apply(ctx, args);
            }, 100);
        };
    };

    $('input').bind('keyup', debounce(function () {
        if ($(this).val() < 2) return;
        // var config = $('#configuration').val();
        // config.trim();
        var json_config = null;
        // if (config != '') {
        //     json_config = new elasticlunr.Configuration(config, idx.getFields()).get();
        // }

        var query = $(this).val();
        console.log(query);
        console.log(idx);
        var results = null;
        if (json_config == null) {
            results = idx.search(query);
            console.log(results);
            // .map(function (result) {
            //     return articles.filter(function (q) {
            //         console.log(q.id === parseInt(result.ref, 10));
            //         return q.id === parseInt(result.ref, 10);
            //     })[0];
            // });
        } else {
            results = idx.search(query, json_config).map(function (result) {
                return articles.filter(function (q) {
                    console.log(q.id === parseInt(result.ref, 10));
                    return q.id === parseInt(result.ref, 10);
                })[0];
            });
        }

        console.log(results);
        renderArticleList(results);
    }));

    $("#question-list-container").delegate('li', 'click', function () {
        var li = $(this);
        var id = li.data('question-id');

        // renderQuestionView(questions.filter(function (question) {
        //     return (question.id == id);
        // })[0]);
    });

});