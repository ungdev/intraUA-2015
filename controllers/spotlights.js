'use strict'

module.exports = function (server) {
    server.route({
        method : 'get',
        path   : '/spotlights',
        handler: function (request, reply) {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            var spotlights = server.reloadDB().db('spotlights')
                .toJSON()
                .map(function (spotlight, i) {
                    spotlight.first = (i === 0)

                    if (spotlight.hasPools) {
                        spotlight.pools = spotlight.pools
                    }

                    spotlight.tree   = JSON.stringify(spotlight.tree)
                    spotlight.looser = JSON.stringify(spotlight.looser)

                    return spotlight
                })

            server.render(reply, 'spotlights', {
                admin: request.session.get('admin'),
                spotlights: spotlights
            })
        }
    })

    server.route({
        method : 'post',
        path   : '/spotlights/{index}',
        handler: function (request, reply) {
            if (!request.session.get('auth') ||
                !request.session.get('admin')) {
                return reply(false)
            }

            var db = server.reloadDB().db

            console.log(request.params.index, request.payload)

            db.object.spotlights[request.params.index].tree = request.payload

            db.saveSync()

            return reply(true)
        }
    })
}
