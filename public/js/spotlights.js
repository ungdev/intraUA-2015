'use strict'

var $as       = $('.nav-pills a')
var $pages    = $('.page')
var $pools    = $('th[colspan="2"]')
var $brackets = $('.tree[data-bracket]')

// Tabs
$as.click(function (e) {
    e.preventDefault()

    var $self = $(this)
    $self.tab('show')

    $pages.removeClass('active').eq($self.parent().index()).addClass('active')

    return false
})

// Pools number
$pools.each(function () {
    var $self = $(this)
    $self.children('span').text($self.parents('table').index() + 1)
})

$brackets.each(function () {
    var $bracket = $(this)
    var data     = JSON.parse($bracket.attr('data-bracket'))
    var admin    = $bracket.attr('data-admin') === 'true'
    var index    = $bracket.parent().parent().index()

    var save = admin ? function (data) {
        console.log(data, index)
        $.ajax({
            type   : 'post',
            url    : '/spotlights/' + index,
            data   : data,
            success: function (msg) {
                console.log(msg)
            }
        })
    } : undefined

    $bracket.bracket({
        init: data,
        save: save
    })

    $('.jQBracket.lr > .tools').remove()
})
