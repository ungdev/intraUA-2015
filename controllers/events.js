'use strict'

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/events',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            reply.file('views/events.html')
        }
    })
}
