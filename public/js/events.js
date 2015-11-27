'use strict'

var $events = $('.event')

var toHHMMSS = function (secNum) {
    var hours   = Math.floor(secNum / 3600)
    var minutes = Math.floor((secNum - (hours * 3600)) / 60)
    var seconds = secNum - (hours * 3600) - (minutes * 60)

    if (hours   < 10) {
        hours   = '0' + hours
    }

    if (minutes < 10) {
        minutes = '0' + minutes
    }

    if (seconds < 10) {
        seconds = '0' + seconds
    }

    return '<kbd>' + hours + '</kbd>:<kbd>' + minutes + '</kbd>:<kbd>' + seconds + '</kbd>'
}

$events.each(function () {
    var $self = $(this)
    var $span = $self.children()
    var to    = ($self.hasClass('now')) ? new Date($span.data('end')) : new Date($span.data('start'))
    var now   = new Date()

    console.log(to, now, to - now);

    var count = Math.floor((to - now) / 1000)
    new Countdown(count, function (seconds) {
        $span.html(toHHMMSS(seconds))
    }, function() {
        location.reload()
    });
})
