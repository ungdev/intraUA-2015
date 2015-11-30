'use strict'
// Savers
var $buttons = $('.validButton')

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
