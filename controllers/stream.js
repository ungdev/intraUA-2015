'use strict'

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/stream',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            server.render(reply, 'stream', {
                admin: request.session.get('admin')
            })
        }
    })
}
