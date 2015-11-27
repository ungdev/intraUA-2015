'use strict'

var $form = $('form')
var $user = $('input[type="text"]')
var $pwd  = $('input[type="password"]')

$form.submit(function (e) {
    e.preventDefault()

    $
        .ajax({
            url   : '/login',
            method: 'post',
            data  : {
                login: $user.val(),
                pwd  : $pwd.val()
            }
        })
        .then(function (data) {
            if (!data) {
                $form.addClass('invalid')
                return
            }

            $form.removeClass('invalid')
            localStorage.setItem('token', data)
            location.href = '/home'
        })
})
