'use strict'

var ircPath = 'http://intranet.ua:9090/';

var $iframe = $('<iframe>')
    .attr('frameborder', 0)
    .attr('src', ircPath)

var $container = $('#content > div')

$container.append($iframe)
