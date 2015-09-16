'use strict'

let $events = $('.event')

let toHHMMSS = function (secNum) {
    let hours   = Math.floor(secNum / 3600)
    let minutes = Math.floor((secNum - (hours * 3600)) / 60)
    let seconds = secNum - (hours * 3600) - (minutes * 60)

    if (hours   < 10) {
        hours   = `0${hours}`
    }

    if (minutes < 10) {
        minutes = `0${minutes}`
    }

    if (seconds < 10) {
        seconds = `0${seconds}`
    }

    return `<kbd>${hours}</kbd>:<kbd>${minutes}</kbd>:<kbd>${seconds}</kbd>`
}

$events.each(function () {
    let $self = $(this)
    let $span = $self.children()
    let to    = ($self.hasClass('now')) ? new Date($span.data('start')) : new Date($span.data('end'))
    let now   = new Date()

    let count = Math.floor((to - now) / 1000)
    new Countdown(count, function (seconds) {
        $span.html(toHHMMSS(seconds))
    }, function() {
        location.reload()
    });
})
