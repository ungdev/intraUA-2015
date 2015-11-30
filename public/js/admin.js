'use strict'
// Savers
var $buttons           = $('.validButton')
var $generateEvent     = $('#generateEvent')
var $generateChallenge = $('#generateChallenge')

$buttons.click(function (e) {
    e.preventDefault()
    var $self = $(this)

    var val = $self.get(0).editor.getValue()

    try {
        val = JSON.parse(val)
        $self.removeClass('invalid').addClass('valid')
    } catch (e) {
        $self.removeClass('valid').addClass('invalid')
        return
    }

    var target = $self.data('target')

    if (target === 'spotlights') {
        var full = $self.data('full')
        var i    = $self.data('i')

        Object.keys(val).forEach(function (key) {
            full[key] = val[key]
        })

        spotlights[i] = full
        val = spotlights
    }

    $
        .ajax({
            type: 'post',
            url : '/admin',
            data: JSON.stringify({
                target: target,
                val   : val
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        })
        .then(function (data) {
            if (data) {
                location.reload()
            }
        })

    return false
})


var $textareas = $('textarea')
$textareas.each(function () {
    // Store editor in button (easier to get back)
    var $next = $(this).next().get(0)
    if ($next.tagName !== 'BUTTON') {
        $next = $(this).next().next().get(0)
    }

    $next.editor = CodeMirror.fromTextArea(this, {
        mode             : 'application/json',
        gutters          : ['CodeMirror-lint-markers'],
        indentUnit       : 4,
        matchBrackets    : true,
        autoCloseBrackets: true,
        lineNumbers      : true,
        showTrailingSpace: true,
        lint             : true
    })

    var height = $(this).next().height()

    if ($(this).next().next().get(0).tagName === 'PRE')
        $(this).next().next().css('marginTop', -1 * height + 'px')
})

$generateEvent.click(function (e) {
    e.preventDefault()
    var eName = prompt('Event name ?')

    var sday    = prompt('[START] Day ?')
    var shour   = prompt('[START] Hour ?')
    var sminute = prompt('[START] Minute ?')

    var eday    = prompt('[END] Day ?')
    var ehour   = prompt('[END] Hour ?')
    var eminute = prompt('[END] Minute ?')

    var start = new Date(2015, 11, sday, shour, sminute, 0, 0)
    var end   = new Date(2015, 11, eday, ehour, eminute, 0, 0)

    var bracketStart = '    {'
    var bracketEnd   = '"\n    },'
    var nameStart    = '\n        "name": "'
    var startStart   = '",\n        "start": "'
    var endStart     = '",\n        "end": "'

    prompt('Start result', bracketStart + nameStart + eName + startStart + start.toISOString() + endStart + end.toISOString() + bracketEnd)
})

$generateChallenge.click(function (e) {
    e.preventDefault()

    var random = Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, 3);

    var cName = prompt('Challenge name')
    var cDesc = prompt('Challenge description')
    var cPoints = prompt('Challenge points')
    var cToken = prompt('Challenge token', random)

    var bracketStart = '    {'
    var bracketEnd   = '\n    },'
    var nameStart    = '\n        "name": "'
    var descStart    = '",\n        "desc": "'
    var pointsStart  = '",\n        "points": "'
    var tokenStart   = '",\n        "token": "'
    var validated    = '",\n        "validated": false'

    prompt('Challenge result', bracketStart + nameStart + cName + descStart + cDesc + pointsStart + cPoints + tokenStart + cToken + validated + bracketEnd)
})
