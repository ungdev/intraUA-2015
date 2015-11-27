'use strict'

var $joins = $('.join')

$joins.click(function (e) {
    e.preventDefault()

    var $self = $(this)
    var login = $self.data('login')
    var id    = $self.data('id')
    var nick  = window.prompt('Choix du nom (team/votre pseudo) :', login)

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
