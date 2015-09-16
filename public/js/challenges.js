'use strict'

let $submits = $('.btn')

$submits.click(function (e) {
    e.preventDefault()

    let q = 'Appelez un membre de l\'animation pour faire valider votre challenge. Il entrera le mot de passe'
    let token = window.prompt(q)

    $
        .ajax({
            type: 'post',
            url : '/challenges/submit',
            data: {
                token: token,
                index: $submits.index($(this))
            }
        })
        .then(function (data) {
            if (data) {
                location.reload()
            } else {
                window.alert('Code invalide')
            }
        })

    return false
})
