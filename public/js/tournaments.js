'use strict'

let $joins = $('.join')

$joins.click(function (e) {
    e.preventDefault()

    let $self = $(this)
    let login = $self.data('login')
    let id    = $self.data('id')
    let nick  = window.prompt('Choix du nom (team/votre pseudo) :', login)

    if (!nick) {
        return
    }

    $.ajax({
        type: 'post',
        url : '/joinTournament/' + id,
        data: {
            nick: nick
        }
    }).then(function (data) {
        if (data === 'full') {
            window.alert('Tournoi plein')
            return
        }

        if (!data) {
            return
        }

        location.href = '/tournaments/' + data
    })

    return false
})
