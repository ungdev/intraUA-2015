'use strict'

var bcrypt = require('bcryptjs')

module.exports = function (server) {
    server.route({
        method : 'get',
        path   : '/',
        handler: function (request, reply) {
            if (request.session.get('auth') === true) {
                return reply.redirect('/home')
            }

            reply.file('views/login.html')
        }
    })

    server.route({
        method : 'post',
        path   : '/login',
        handler: function (request, reply) {
            var login = request.payload.login
            var pwd  = request.payload.pwd

            if (!login || !pwd) {
                return reply('Invalid input').code(400)
            }

            console.log('Trying ' + login + '/' + pwd)

            var users = server.db('users')
                .toJSON()
                .filter(function (user) {
                    return user.login === login
                })

            console.log(users.length + ' matches')

            if (users.length === 0) {
                return reply(false)
            }

            bcrypt
                .compare(pwd, users[0].password, function (err, res) {
                    console.log('ERR', err, 'RES', res);
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
