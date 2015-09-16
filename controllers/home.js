'use strict'

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/home',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            reply.file('views/home.html')
        }
    })
}
