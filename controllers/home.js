'use strict'

module.exports = function (server) {
    server.route({
        method : 'get',
        path   : '/home',
        handler: function (request, reply) {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            server.render(reply, 'home', {
                admin: request.session.get('admin')
            })
        }
    })
}
