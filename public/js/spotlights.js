'use strict'

let $as      = $('.nav-pills a')
let $pages   = $('.page')
let $pools   = $('th[colspan="2"]')
let $tree    = $('.tree')

// Tabs
$as.click(function (e) {
    e.preventDefault()

    let $self = $(this)
    $self.tab('show')

    console.log($pages.eq(3))

    $pages.removeClass('active').eq($self.parent().index()).addClass('active')

    return false
})

// Pools number
$pools.each(function () {
    let $self = $(this)
    $self.children('span').text($self.parents('table').index() + 1)
})

// Tree builder
$tree.each(function () {
    let $self    = $(this)
    let treeData = $self.data('tree')

    let $tournament = $('<div>').addClass('tournament')

    if (treeData.length === 0) {
        return
    }

    treeData.forEach(function (round, roundNumber) {
        let $round  = $('<ul>').addClass('round').addClass(`round-${roundNumber + 1}`)
        let $spacer = $('<li>').addClass('spacer').html('&nbsp;')

        $round.append($spacer)

        round.forEach(function (match, matchNumber) {
            let $top    = $('<li>').addClass('game').addClass('game-top')
            let $mid    = $('<li>').addClass('game').addClass('game-spacer')
            let $bot    = $('<li>').addClass('game').addClass('game-bottom')
            let $spacer = $('<li>').addClass('spacer')

            $top
                .append(`<span class="name" title="${match.team1}">${match.team1}</span>`)
                .append(`<span class="score">${match.score1}</span>`)
            $bot
                .append(`<span class="name" title="${match.team2}">${match.team2}</span>`)
                .append(`<span class="score">${match.score2}</span>`)
            $mid.html('&nbsp;')
            $spacer.html('&nbsp;')

            if (match.score1 > match.score2) {
                $top.addClass('winner')
            } else {
                $bot.addClass('winner')
            }

            $round.append($top).append($mid).append($bot).append($spacer)
        })

        $tournament.append($round)
    })

    $self.append($tournament)
})
