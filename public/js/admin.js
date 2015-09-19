'use strict'

// Separate spotlights
let $spotlightsData = $('.spotlights.data')
let spotlights      = $('.spotlights.data').data('spotlights')
spotlights.forEach(function (spotlight, i) {
    let $h2       = $('<h2>').text(spotlight.name)
    let $button   = $('<button>')
        .addClass('validButton')
        .attr('data-target', 'spotlights')
        .attr('data-full', JSON.stringify(spotlight))
        .attr('data-i', i)
        .text('✓')
    let $textarea = $('<textarea>')
        .addClass('form-control')
        .attr('rows', 10)
        .val(JSON.stringify({
            pools: spotlight.pools,
            tree : spotlight.tree
        }, null, 4))

    $spotlightsData.after($h2)
    $h2.after($textarea)
    $textarea.after($button)
})

// Savers
let $buttons = $('.validButton')

$buttons.click(function (e) {
    e.preventDefault()
    let $self = $(this)

    let val = $self.get(0).editor.getValue()

    try {
        val = JSON.parse(val)
        $self.removeClass('invalid').addClass('valid')
    } catch (e) {
        $self.removeClass('valid').addClass('invalid')
        return
    }

    let target = $self.data('target')

    if (target === 'spotlights') {
        let full = $self.data('full')
        let i    = $self.data('i')

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
            data: {
                target: target,
                val   : val
            }
        })
        .then(function (data) {
            if (data) {
                location.reload()
            }
        })

    return false
})


let $textareas = $('textarea')
$textareas.each(function () {
    // Store editor in button (easier to get back)
    $(this).next().get(0).editor = CodeMirror.fromTextArea(this, {
        mode             : 'application/json',
        gutters          : ['CodeMirror-lint-markers'],
        indentUnit       : 4,
        matchBrackets    : true,
        autoCloseBrackets: true,
        lineNumbers      : true,
        showTrailingSpace: true,
        lint             : true
    })
})
