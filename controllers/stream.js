'use strict'

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/stream',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            reply.file('views/stream.html')
        }
    })
}
