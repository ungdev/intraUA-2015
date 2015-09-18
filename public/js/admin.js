'use strict'

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

        console.log(e)
        return
    }

    let target = $self.data('target')

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
