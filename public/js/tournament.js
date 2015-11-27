'use strict'

var $isOwner = $('[data-isOwner]')
var isOwner  = $isOwner.length === 1

if (isOwner) {
    $isOwner.find('.score').click(function (e) {
        e.preventDefault()

        var $self = $(this)

        var actualScore = $self.text()
        var newScore
        if ($self.prev().attr('title') === '(vide)') {
            window.alert('Impossible de modifier le score d\'une équipe inexistante');
            return;
        }

        do {
            newScore = parseInt(window.prompt('Nouveau score ?', actualScore), 10)
            if (window.isNaN(newScore)) {
                break;
            }
        } while (!newScore && newScore !== 0)

        if (!newScore) {
            return;
        }

        var tournamentId  = location.pathname.split('/').slice(-1)[0];
        var isTop         = $self.parent().hasClass('game-top')
        var classToSearch = (isTop) ? '.game-top' : '.game-bottom'
        var gameIndex     = parseInt($self.parent().attr('data-game'), 10)
        var roundIndex    = parseInt($self.parent().parent().attr('data-round'), 10)

        $
            .ajax({
                type: 'post',
                url : '/editTournament',
                data: {
                    tournamentId: tournamentId,
                    gameIndex   : gameIndex,
                    roundIndex  : roundIndex,
                    isTop       : isTop,
                    newScore    : newScore
                }
            })
            .then(function (data) {
                if (data) {
                    location.reload();
                }
            })

        return false
    })
}
