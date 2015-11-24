'use strict'

let $as      = $('.nav-pills a')
let $pages   = $('.page')
let $pools   = $('th[colspan="2"]')

// Tabs
$as.click(function (e) {
    e.preventDefault()

    let $self = $(this)
    $self.tab('show')

    $pages.removeClass('active').eq($self.parent().index()).addClass('active')

    return false
})

// Pools number
$pools.each(function () {
    let $self = $(this)
    $self.children('span').text($self.parents('table').index() + 1)
})
