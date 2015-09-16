'use strict'

/* globals flowplayer */

const url      = 'ua_test'
const provider = 'ua'
const host     = 'caterino.ua'

flowplayer('player', 'http://releases.flowplayer.org/swf/flowplayer-3.2.18.swf', {
    clip: {
        url     : 'ua_test',
        scaling : 'fit',
        provider: 'ua'
    },
    plugins: {
        url             : 'components/flowplayer/flowplayer.rtmp-3.2.13.swf',
        netConnectionUrl: `rtmp://${host}/live/`
    }
})
