'use strict'

const ircPath = 'http://utt.fr/';

let $iframe = $('<iframe>')
    .attr('frameborder', 0)
    .attr('src', ircPath)

let $container = $('#content > div')

$container.append($iframe)
