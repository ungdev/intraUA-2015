'use strict'

let $isOwner = $('[data-isOwner]')
let isOwner  = $isOwner.length === 1

if (isOwner) {
    $isOwner.find('.score').click(function (e) {
        e.preventDefault()

        let $self = $(this)

        let actualScore = $self.text()
        let newScore    = parseInt(window.prompt('Nouveau score ?', actualScore), 10)

        let tournamentId  = location.pathname.split('/').slice(-1)[0];
        let isTop         = $self.parent().hasClass('game-top')
        let classToSearch = (isTop) ? '.game-top' : '.game-bottom'
        let gameIndex     = $self.parent().parent().children(classToSearch).index($self.parent())
        let roundIndex    = $self.parent().parent().parent().index()

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
