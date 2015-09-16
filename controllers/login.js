'use strict'

const authSuccess = true

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/',
        handler: (request, reply) => {
            if (request.session.get('auth') === true) {
                return reply.redirect('/home')
            }

            reply.file('views/login.html')
        }
    })

    server.route({
        method : 'post',
        path   : '/login',
        handler: (request, reply) => {
            let user = request.payload.user
            let pwd  = request.payload.pwd

            setTimeout(() => {
                if (authSuccess) {
                    request.session.set('auth', true)
                }
            })

            request.session.set({ auth: true })
            return reply(authSuccess)
        }
    })
}
