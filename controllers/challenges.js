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
                admin: request.session.get('admin'),
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
            let team  = request.payload.team

            let challenges = server.reloadDB().db('challenges').toJSON()

            if (!token || !index || !team || !challenges[index]) {
                return reply('Invalid input').code(400)
            }

            let amount = challenges[index].points

            server.db('scores').toJSON()[team] += amount

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
