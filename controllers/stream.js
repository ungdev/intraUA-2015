'use strict'

module.exports = function (server) {
    server.route({
        method : 'get',
        path   : '/stream',
        handler: function (request, reply) {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            server.render(reply, 'stream', {
                admin: request.session.get('admin')
            })
        }
    })
}
