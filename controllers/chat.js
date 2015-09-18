'use strict'

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/chat',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            server.render(reply, 'chat', {
                admin: request.session.get('admin')
            })
        }
    })
}
