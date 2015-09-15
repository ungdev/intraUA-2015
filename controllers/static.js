'use strict'

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/{param*}',
        handler: {
            directory: {
                path: 'public'
            }
        }
    })
}
