'use strict'

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/challenges',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            let challenges = server.reloadDB().db('challenges')
                .toJSON()
                .filter(challenge => {
                    return !challenge.validated
                })

            let scores = server.reloadDB().db('scores').toJSON()

            server.render(reply, 'challenges', {
                challenges,
                blue: scores.blue,
                red : scores.red
            })
        }
    })

    server.route({
        method : 'post',
        path   : '/challenges/submit',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            let token = request.payload.token
            let index = request.payload.index
            let challenges = server.reloadDB().db('challenges').toJSON()

            if (!token || !index || !challenges[index]) {
                return reply('Invalid input').code(400)
            }

            if (token === challenges[index].token) {
                challenges[index].validated = true
                server.db.save()
                reply(true)
            } else {
                reply(false)
            }
        }
    })
}
