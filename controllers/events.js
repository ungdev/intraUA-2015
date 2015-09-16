'use strict'

module.exports = server => {
    server.route({
        method : 'get',
        path   : '/events',
        handler: (request, reply) => {
            if (!request.session.get('auth')) {
                return reply.redirect('/')
            }

            let now = new Date()

            let events = server.db('events').toJSON()
                .map(event => {
                    event.start = new Date(event.start)
                    event.end   = new Date(event.end)

                    return event
                })

            let eventsToCome = events.filter(event => event.start > now)
            let eventsNow    = events.filter(event => event.start <= now && now <= event.end)

            console.log(eventsToCome)
            console.log(eventsNow)

            server.render(reply, 'events', {
                eventsToCome,
                eventsNow
            })
        }
    })
}
