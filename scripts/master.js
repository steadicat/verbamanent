var db = 'http://verbamanent.cloudant.com:5984/main/';
var allPosts = '_design/ordered/_view/date?callback=?&limit=20';

$.prototype.use = function() {
    return this.clone().removeClass('template').insertBefore(this);
};

$(function() {
    $.getJSON(db + allPosts, function(json) {
        $.each(json.rows, function(i, row) {
            var post = row.value;
            var el = $('.post.template').use().find('.body:first').html(post.body).end();
            $.each(post.comments, function(i, comment) {
                console.log(comment.body);
                el.find('.comment.template').use().find('.body:first').html(comment.body);
            });
        });
    })
});