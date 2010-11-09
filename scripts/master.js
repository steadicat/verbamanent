var db = 'http://data.verbamanent.org/';
var allPosts = '_design/ordered/_rewrite/date/';

$.prototype.use = function() {
    return this.clone().removeClass('template').insertBefore(this);
};

var days = ['luned&iacute;','marted&iacute;','mercoled&iacute;','gioved&iacute;','venerd&iacute;','sabato','domenica'];
var months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];

var by = [
    '125 milioni di caz..te di',
    'cacofonia di',
    'pillola di saggezza di',
    'abbattete',
    'epitaffio di',
    'bel colpo,',
    '&egrave; tipico di',
    '&egrave; stato qui',
    'sproloquio scritto da',
    'cavolata scritta da',
    'encomio di',
    'emozione regalata da',
    'amenit&agrave; di',
    'il web aveva certamente bisogno di',
    'il grave errore &egrave; di',
    'pistolata di',
    'opera maxima di',
    'scritto da',
    'spam da parte di',
    'guarda un po&rsquo; cos&rsquo;ha da dire',
    'viva la sincerit&agrave; di',
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
    'ma che idea strana che &egrave; venuta in mente a'
];

var dst = [
    [new Date(2000, 3, 26, 1, 0, 0), 2],
    [new Date(2000, 10, 29, 1, 0, 0), 1],
    [new Date(2001, 3, 25, 1, 0, 0), 2],
    [new Date(2001, 10, 28, 1, 0, 0), 1],
    [new Date(2002, 3, 31, 1, 0, 0), 2],
    [new Date(2002, 10, 27, 1, 0, 0), 1],
    [new Date(2003, 3, 30, 1, 0, 0), 2],
    [new Date(2003, 10, 26, 1, 0, 0), 1]
];
function getTimeZoneOffset(date) {
    var prev = 1;
    for (var i in dst) {
        if (date < dst[i][0]) return prev*60*60*1000;
        prev = dst[i][1];
    };
    return prev*60*60*1000;
}
function parseDate(date) {
    var bits = date.split(' ');
    var date = bits[0].split('-');
    var time = bits[1].split(':');
    date[1] = parseInt(date[1])-1;
    return new Date(Date.UTC.apply(null, date.concat(time)));
}
function pad(n) {
    return n < 10? '0'+n: n;
}
function getTime(date) {
    var date = parseDate(date);
    date.setTime(date.getTime() + getTimeZoneOffset(date));
    return date.getUTCHours() + ':' + pad(date.getUTCMinutes());
}
function getDate(date) {
    var date = parseDate(date);
    date.setTime(date.getTime() + getTimeZoneOffset(date));
    return [days[date.getUTCDay()], date.getUTCDate(), months[date.getUTCMonth()], date.getUTCFullYear()].join(' ');
}
$('.commentLink').live('click', function() {
    $(this).parents('.post').find('.comments').toggleClass('off');
});

var lastLoaded = null;
var alreadyLoaded = {};
var previousDate = null;

function callback(json) {
    $.each(json.rows, function(i, row) {
        var post = row.value;
        lastLoaded = row.key;

        var el = $('.post.template').use();
        el
            .attr('id', 'post-' + post._id)
            .find('.body:first').html(post.body).end()
            .find('.by:first').html(by[Math.floor(Math.random()*by.length)]).end()
            .find('.username:first').text(post.user).attr('href', '/user/#' + post.user).end()
            .find('.time:first').text(getTime(post.date)).end();
        var date = getDate(post.date);
        if (date != previousDate) {
            el.find('.date:first').html(date).end();
            previousDate = date;
        }
        if (post.comments.length) {
            el.find('.commentLink:first').text(post.comments.length + ' commenti').attr('href','#post-'+post._id);
        }
        $.each(post.comments, function(i, comment) {
            el
                .find('.comment.template').use()
                .find('.body:first').html(comment.body).end()
                .find('.by:first').html(by[Math.floor(Math.random()*by.length)]).end()
                .find('.username:first').text(comment.user).attr('href', '/user/#' + comment.user).end()
                .find('.time:first').text(getTime(comment.date)).end()
                .find('.date:first').html(getDate(comment.date));
        });
    });
}

function loadPosts(type, start) {
    if (start && alreadyLoaded[start]) return;
    alreadyLoaded[start] = true;
    $.ajax({ url: db + type + '/' + allPosts + (start? '"' + start + '"' : ''), dataType: 'jsonp', callback: 'callback' });
};

$(window).scroll(function() {
    if  ($(window).scrollTop()+300 >= $(document).height() - $(window).height()) {
        loadPosts($(document.body).attr('id'), lastLoaded);
    }
});

$(function() {
    loadPosts($(document.body).attr('id'));
});
