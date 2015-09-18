'use strict'

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/home',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            server.render(reply, 'home', {
                admin: request.session.get('admin')
            })
        }
    })
}
