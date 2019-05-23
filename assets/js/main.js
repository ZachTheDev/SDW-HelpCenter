$(document).ready(function () {

    var title = $("#articleTitle").val();
    var author = $("#articleAuthor").val();
    var userType = $("#articleType").val();

    var metadata = {
        task: title,
        important: author,
        urgent: userType
    };

    $("#save").on("click", function () {
        $.post("/server.js", metadata);
    });

});