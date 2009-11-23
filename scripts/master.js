var db = 'http://verbamanent.cloudant.com:5984/';
var allPosts = '_design/ordered/_view/date?callback=?&limit=20';

$.prototype.use = function() {
    return this.clone().removeClass('template').insertBefore(this);
};

var months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];

var by = [
    '125 milioni di caz..te di',
    'cacofonia di',
    'pillola di saggezza di',
    'abbattete',
    'epitaffio di',
    'bel colpo,',
    'è tipico di',
    'è stato qui',
    'sproloquio scritto da',
    'cavolata scritta da',
    'encomio di',
    'emozione regalata da',
    'amenità di',
    'il web aveva certamente bisogno di',
    'il grave errore è di',
    'pistolata di',
    'opera maxima di',
    'scritto da',
    'spam da parte di',
    'guardà un po\' cos\'ha da dire',
    'viva la sincerità di',
    'grazie di aver partecipato a',
    'scoop di',
    'opera omnia',
    'il meglio di',
    'quello che avreste sempre voluto sapere su',
    'citazione da',
    'messaggio da',
    'chi poteva scrivere una cosa del genere se non',
    'cacofonia di',
    'marzullata di',
    'ma che idea strana che è venuta in mente a'
];

function getTime(date) {
    var bits = date.split(' ')[1].split(':');
    return bits[0] + ':' + bits[1];
}
function getDate(date) {
    var bits = date.split(' ')[0].split('-');
    var day = bits[2][0] == '0' ? bits[2][1] : bits[2];
    return day + ' ' + months[parseInt(bits[1]-1)] + ' ' + bits[0];
}
$('.commentLink').live('click', function() {
    $(this).parents('.post').find('.comments').toggleClass('off');
});

var lastLoaded = null;
var alreadyLoaded = {};

function loadPosts(type, start) {
    if (start && alreadyLoaded[start]) return;
    alreadyLoaded[start] = true;
    $.getJSON(db + type + '/' + allPosts + (start? '&startkey=\"'+start+'%2F"': ''), function(json) {
        $.each(json.rows, function(i, row) {
            var post = row.value;
            lastLoaded = row.key;

            var el = $('.post.template').use();
            el
            .attr('id', 'post-' + post._id)
            .find('.body:first').html(post.body).end()
            .find('.by:first').text(by[Math.floor(Math.random()*by.length)]).end()
            .find('.username:first').text(post.user).attr('href', 'user.html#' + post.user).end()
            .find('.time:first').text(getTime(post.date)).end()
            .find('.date:first').text(getDate(post.date)).end();
            if (post.comments.length) {
                el.find('.commentLink:first').text(post.comments.length + ' commenti').attr('href','#post-'+post._id);
            }
            $.each(post.comments, function(i, comment) {
                el
                .find('.comment.template').use()
                .find('.body:first').html(comment.body).end()
                .find('.by:first').text(by[Math.floor(Math.random()*by.length)]).end()
                .find('.username:first').text(comment.user).attr('href', 'user.html#' + comment.user).end()
                .find('.time:first').text(getTime(comment.date)).end()
                .find('.date:first').text(getDate(comment.date));
            });
        });
    });
};

$(window).scroll(function() {
    if  ($(window).scrollTop()+300 >= $(document).height() - $(window).height()) {
        loadPosts($(document.body).attr('id'), lastLoaded);
    }
});

$(function() {
    loadPosts($(document.body).attr('id'));
});