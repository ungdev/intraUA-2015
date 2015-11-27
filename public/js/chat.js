'use strict'

var ircPath = 'http://utt.fr/';

var $iframe = $('<iframe>')
    .attr('frameborder', 0)
    .attr('src', ircPath)

var $container = $('#content > div')

$container.append($iframe)
