var db = 'http://verbamanent.cloudant.com:5984/main/';
var allPosts = '_design/ordered/_view/date?callback=?&limit=20';

$.prototype.use = function() {
    return this.clone().removeClass('template').insertBefore(this);
};

function getTime(date) {
    return date.split(' ')[1];
}
function getDate(date) {
    return date.split(' ')[0];
}
$('.commentLink').live('click', function() {
    $(this).parents('.post').find('.comments').toggleClass('off');
});

var lastLoaded = null;
var alreadyLoaded = {};

function loadPosts(start) {
    if (start && alreadyLoaded[start]) return;
    alreadyLoaded[start] = true;
    $.getJSON(db + allPosts + (start? '&startkey=\"'+start+'%2F"': ''), function(json) {
        $.each(json.rows, function(i, row) {
            var post = row.value;
            lastLoaded = row.key;
            console.log(lastLoaded);
            var el = $('.post.template').use();
            el
            .attr('id', 'post-' + post._id)
            .find('.body:first').html(post.body).end()
            .find('.username:first').text(post.user).attr('href', 'user/#' + post.user).end()
            .find('.time:first').text(getTime(post.date)).end()
            .find('.date:first').text(getDate(post.date)).end();
            if (post.comments.length) {
                el.find('.commentLink:first').text(post.comments.length + ' commenti').attr('href','#post-'+post._id);
            }
            console.log(post);
            $.each(post.comments, function(i, comment) {
                el
                .find('.comment.template').use()
                .find('.body:first').html(comment.body).end()
                .find('.username:first').text(comment.user).attr('href', '/user/#' + comment.user).end()
                .find('.time:first').text(getTime(comment.date)).end()
                .find('.date:first').text(getDate(comment.date));
            });
        });
    });
};

$(window).scroll(function() {
    if  ($(window).scrollTop()+200 >= $(document).height() - $(window).height()) {
        loadPosts(lastLoaded);
    }
});

$(function() {
    loadPosts();
});