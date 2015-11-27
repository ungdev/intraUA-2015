'use strict'

module.exports = function (server) {
    server.route({
        method : 'get',
        path   : '/events',
        handler: function (request, reply) {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            var now = new Date()

            var events = server.reloadDB().db('events')
                .toJSON()
                .map(function (event) {
                    event.start = new Date(event.start)
                    event.end   = new Date(event.end)

                    return event
                })

            var eventsToCome = events.filter(function (event) {
                return event.start > now
            })
            var eventsNow    = events.filter(function (event) {
                return event.start <= now && now <= event.end
            })

            console.log(eventsToCome)
            console.log(eventsNow)

            server.render(reply, 'events', {
                admin: request.session.get('admin'),
                eventsToCome: eventsToCome,
                eventsNow: eventsNow
            })
        }
    })
}
