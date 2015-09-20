'use strict'

let bcrypt = require('bcryptjs')

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
            let login = request.payload.login
            let pwd  = request.payload.pwd

            if (!login || !pwd) {
                return reply('Invalid input').code(400)
            }

            console.log(`Trying ${login}/${pwd}`)

            let users = server.db('users')
                .toJSON()
                .filter(user => {
                    return user.login === login
                })

            console.log(`${users.length} matches`)

            if (users.length === 0) {
                return reply(false)
            }

            bcrypt
                .compare(pwd, users[0].password, function (err, res) {
                    if (err || !res) {
                        return reply(false)
                    }

                    users[0].lastLogin = new Date()
                    server.db.save()

                    request.session.set('auth', true)
                    request.session.set('login', users[0].login)

                    if (users[0].admin) {
                        request.session.set('admin', true)
                    }

                    return reply(true)
                })
        }
    })
}
