require([
    'assets/js/jquery.js',
    'assets/js/mustache.js',
    'assets/js/elasticlunr.js',
    'text!templates/article_list.mustache',
    'text!articles.json',
    'text!index.json'
], function (_, Mustache, elasticlunr, articleList, data, pullIndex) {
    var renderArticleList = function (ar) {
        $(".dropdown-content").remove();
        // console.log(ar);
        newAr = [];
        for (var x in ar) {
            console.log(ar[x]);
            newAr.push(ar[x][0]);
            // console.log(ar[x][0]);
        }
        // console.log(newAr);
        bestAr = newAr.slice(0, 5);
        // console.log(bestAr);
        $("#contentHolder").append(Mustache.render(articleList, {
            articles: bestAr
        }));

        if (bestAr.length) {
            $("#searchInput").css("border-radius", "0 5px 0 0");
            $("#searchIcon").css("border-radius", "5px 0 0 0");
            $(".dropdown-content").addClass("active");
        } else {
            $("#searchInput").css("border-radius", "0 5px 5px 0");
            $("#searchIcon").css("border-radius", "5px 0 0 5px");
        }

        $("#searchInput").keyup(function () {
            if (this.value) {
                $(".dropdown-content").addClass("active");
                $(".dropdown").addClass("active");
                $("#searchInput").addClass("active");
                $("#searchIcon").addClass("active");
            } else {
                $(".dropdown-content").removeClass("active");
                $(".dropdown").removeClass("active");
                $("#searchInput").removeClass("active");
                $("#searchIcon").removeClass("active");
            }
        });
        $("#searchInput").focusout(function () {
            $(".dropdown-content").addClass("hide");
            $("#searchInput").css("border-radius", "0 5px 5px 0");
            $("#searchIcon").css("border-radius", "5px 0 0 5px");
        });
        $("#searchInput").focus(function () {
            $(".dropdown-content").removeClass("hide");
            $("#searchInput").css("border-radius", "0 5px 0 0");
            $("#searchIcon").css("border-radius", "5px 0 0 0");
        });
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

    // renderArticleList(articles);

    // $('a.all').bind('click', function () {
    //     renderArticleList(articles);
    //     $('input').val('');
    // });

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
        // var config = 'fields ": {"title": {"boost": 2},"body": {"boost": 1}}';
        // config.trim();
        var json_config = null;
        // if (config != '') {
        //     json_config = new elasticlunr.Configuration(config, idx.getFields()).get();
        // }

        var query = $(this).val();
        console.log(query);
        // console.log(idx);
        var results = null;
        if (json_config == null) {
            results = idx.search(query).map(function (result) {
                // console.log(result.ref);
                return articles.filter(function (a) {
                    // console.log(a);
                    return a.id === result.ref;
                });
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