require([
    'assets/js/jquery.js',
    'assets/js/mustache.js',
    'assets/js/elasticlunr.js',
    'text!templates/article_list.mustache',
    'text!templates/viewer.mustache',
    'text!articles.json',
    'text!index.json'
], function (_, Mustache, elasticlunr, articleList, articleViewer, data, pullIndex) {
    var renderArticleList = function (ar) {
        $(".dropdown-content").remove();
        // console.log(ar);
        newAr = [];
        for (var x in ar) {
            // console.log(ar[x]);
            newAr.push(ar[x][0]);
            // console.log(ar[x][0]);
        }
        // console.log(newAr);
        bestAr = newAr.slice(0, 5);
        console.log(bestAr);
        $("#contentHolder").append(Mustache.render(articleList, {
            articles: bestAr
        }));

        if (bestAr.length) {
            $("#searchInput").css("border-radius", "0 5px 0 0");
            $("#searchIcon").css("border-radius", "5px 0 0 0");
            $(".dropdown-content").addClass("active");
            var iconWidth = $("#icon").width();
            var leftPadding = iconWidth + 5;
            leftPadding = parseInt(leftPadding);
            // console.log(leftPadding);
            $(".searchResults").css("padding-left", leftPadding);
        } else {
            $("#searchInput").css("border-radius", "0 5px 5px 0");
            $("#searchIcon").css("border-radius", "5px 0 0 5px");
        }

        $("#searchInput").keyup(function (e) {
            if (this.value) {
                $(".dropdown-content").addClass("active");
                $(".dropdown").addClass("active");
                $("#searchInput").addClass("active");
                $("#searchIcon").addClass("active");
            } else {
                $(".dropdown-content").addClass("hide");
                $("#searchInput").css("border-radius", "0 5px 5px 0");
                $("#searchIcon").css("border-radius", "5px 0 0 5px");
                $(".dropdown-content").removeClass("active");
                $(".dropdown").removeClass("active");
                $("#searchInput").removeClass("active");
                $("#searchIcon").removeClass("active");
            }
        });
        $('body').click(function (evt) {
            if (evt.target.id == "searchInput") return;
            if ($(evt.target).closest('#searchInput').length)
                return;
            $(".dropdown-content").addClass("hide");
            $("#searchInput").css("border-radius", "0 5px 5px 0");
            $("#searchIcon").css("border-radius", "5px 0 0 5px");
        });
        $("#searchInput").focus(function () {
            if (bestAr.length) {
                $(".dropdown-content").removeClass("hide");
                $("#searchInput").css("border-radius", "0 5px 0 0");
                $("#searchIcon").css("border-radius", "5px 0 0 0");
            }
        });
        $("#searchInput").keydown(function (e) {
            if (e.which == 27) {
                $("#searchInput").blur();
                $(".dropdown-content").addClass("hide");
                $("#searchInput").css("border-radius", "0 5px 5px 0");
                $("#searchIcon").css("border-radius", "5px 0 0 5px");
            }
        });
    };

    var renderArticleView = function (article) {
        // console.log(article);
        $("#body")
            .empty()
            .append(Mustache.render(articleViewer, {
                markdown: JSON.stringify(article)
            }));
    };

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
        // console.log(query);
        // console.log(idx);
        var results = null;
        if (json_config == null) {
            results = idx.search(query, {}).map(function (result) {
                // console.log(result.ref);
                return articles.filter(function (a) {
                    // console.log(a);
                    return a.id === result.ref;
                });
            });
        }
        // console.log(results);
        renderArticleList(results);
    }));

    $("#contentHolder").on('click', 'a', function () {
        var a = $(this).attr('id');
        console.log(a);
        var markdown = String(a);
        // console.log(markdown);

        renderArticleView(markdown);

        // renderArticleView(articles.filter(function (article) {
        //     console.log(article.id);
        //     console.log(id);
        //     console.log(article.id == id);
        //     return (article.id == id);
        // })[0]);
    });

});