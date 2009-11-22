var db = 'http://verbamanent.cloudant.com:5984/users/';

$.prototype.use = function() {
    return this.clone().removeClass('template').insertBefore(this);
};

function getTime(date) {
    return date.split(' ')[1];
}
function getDate(date) {
    return date.split(' ')[0];
}

$(function() {
    $.getJSON(db + location.hash.substring(1) + '?callback=?', function(user) {
        var el = $('.user.template').use();
        el.find('.username:first').text(user.username).end();
        el.find('.profile.template').use()
        .find('.key').text('Descrizione').end().find('.value').text(user.description);
        el.find('.profile.template').use()
        .find('.key').text('Email').end().find('.value').text(user.email);
        el.find('.profile.template').use()
        .find('.key').text('Url').end().find('.value').text(user.url);
        $.each(user.profile, function(key, val) {
            el.find('.profile.template').use()
            .find('.key').text(key).end().find('.value').html(val);
        });

        el.find('.profile.template').use()
        .find('.key').text('Iscritto dal').end().find('.value').text(user.date);

        el.find('.profile.template').use()
        .find('.key').text('Post').end().find('.value').text(user.posts);
        el.find('.profile.template').use()
        .find('.key').text('Commenti').end().find('.value').text(user.comments);
    });
});