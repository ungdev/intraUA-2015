'use strict'

module.exports = function (server) {
    server.route({
        method : 'get',
        path   : '/challenges',
        handler: function (request, reply) {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            var challenges = server.reloadDB().db('challenges')
                .toJSON()
                .filter(function (challenge) {
                    return !challenge.validated
                })

            var scores = server.reloadDB().db('scores').toJSON()
            var users  = server.reloadDB().db('users')
                .toJSON()
                .sort(function (a, b) {
                    return a.score < b.score
                })
                .slice(0, 10)
                .map(function (user) {
                    user.isBlue = user.team === 'blue'

                    return user
                })

            server.render(reply, 'challenges', {
                admin: request.session.get('admin'),
                challenges: challenges,
                blue: scores.blue,
                red : scores.red,
                rank: users
            })
        }
    })

    server.route({
        method : 'post',
        path   : '/challenges/submit',
        handler: function (request, reply) {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            var token = request.payload.token
            var index = request.payload.index
            var team  = request.payload.team

            var challenges = server.reloadDB().db('challenges').toJSON()
                .filter(function (challenge) {
                    return !challenge.validated
                })

            if (!token || !index || !team || !challenges[index]) {
                return reply('Invalid input').code(400)
            }

            var amount = challenges[index].points

            server.db('scores').toJSON()[team] += amount
            var users = server.db('users').toJSON();

            users = users.map(function (user) {
                if (user.login === request.session.get('login')) {
                    user.score += amount
                }

                return user
            })

            if (token === challenges[index].token) {
                challenges[index].validated = true
                server.db.saveSync()
                reply(true)
            } else {
                reply(false)
            }
        }
    })
}
