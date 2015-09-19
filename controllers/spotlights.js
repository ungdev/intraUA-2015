'use strict'

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/spotlights',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            let spotlights = server.reloadDB().db('spotlights')
                .toJSON()
                .map((spotlight, i) => {
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
                spotlights
            })
        }
    })
}
