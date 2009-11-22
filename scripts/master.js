var db = 'http://verbamanent.cloudant.com:5984/main/';
var allPosts = '_design/ordered/_view/date?callback=?&limit=20';

$(function() {
    $.getJSON(db + allPosts, function(json) {
        $.each(json.rows, function(i, post) {
            $('#post').clone().removeAttr('id').insertBefore($('#post'))
            .find('.body').html(post.value.body);
        });
    })
});