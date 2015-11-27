'use strict'

var $tree = $('.tree')

// Tree builder
$tree.each(function () {
    var $self    = $(this)
    var treeData = $self.data('tree')

    var $tournament = $('<div>').addClass('tournament')

    if (treeData.length === 0) {
        return
    }

    treeData.forEach(function (round, roundNumber) {
        var $round  = $('<ul>').addClass('round').addClass('round-' + (roundNumber + 1)).attr('data-round', roundNumber)
        var $spacer = $('<li>').addClass('spacer').html('&nbsp;')

        $round.append($spacer)

        round.forEach(function (match, matchNumber) {
            var $top    = $('<li>').addClass('game').addClass('game-top').attr('data-game', matchNumber)
            var $mid    = $('<li>').addClass('game').addClass('game-spacer')
            var $bot    = $('<li>').addClass('game').addClass('game-bottom').attr('data-game', matchNumber)
            var $spacer = $('<li>').addClass('spacer')

            $top
                .append('<span class="name" title="' + match.team1 + '">' + match.team1 + '</span>')
                .append('<span class="score">' + match.score1 + '</span>')
            $bot
                .append('<span class="name" title="' + match.team2 + '">' + match.team2 + '</span>')
                .append('<span class="score">' + match.score2 + '</span>')
            $mid.html('&nbsp;')
            $spacer.html('&nbsp;')

            if (match.score1 > match.score2) {
                $top.addClass('winner')
            } else if (match.score2 > match.score1) {
                $bot.addClass('winner')
            }

            $round.append($top).append($mid).append($bot).append($spacer)
        })

        $tournament.append($round)
    })

    $self.append($tournament)
})

