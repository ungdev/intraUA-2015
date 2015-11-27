'use strict'

var settingsAuthorized = ['events', 'challenges', 'users', 'spotlights']

module.exports = function (server) {
    server.route({
        method : 'get',
        path   : '/admin',
        handler: function (request, reply) {
            if (!request.session.get('auth') || !request.session.get('admin')) {
                return reply.redirect('/')
            }

            server.render(reply, 'admin', {
                events: JSON.stringify(server.reloadDB().db('events').toJSON(), null, 4).trim(),
                challenges: JSON.stringify(server.reloadDB().db('challenges').toJSON(), null, 4).trim(),
                users: JSON.stringify(server.reloadDB().db('users').toJSON(), null, 4).trim(),
                spotlights: JSON.stringify(server.reloadDB().db('spotlights').toJSON()).trim(),
            })
        }
    })

    server.route({
        method : 'post',
        path   : '/admin',
        handler: function (request, reply) {
            if (!request.session.get('auth') || !request.session.get('admin')) {
                return reply(false)
            }

            if (!request.payload.target || settingsAuthorized.indexOf(request.payload.target) === -1) {
                return reply(false)
            }

            server.reloadDB().db(request.payload.target).assign(request.payload.val)

            server.db.save()

            return reply(true)
        }
    })
}
