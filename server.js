'use strict'

let fs    = require('fs')
let path  = require('path')
let hapi  = require('hapi')
let inert = require('inert')
let yar   = require('yar')
let low   = require('lowdb')

let server = new hapi.Server()

server.db       = low('db.json')
server.config   = require('./config.json')
server.render   = require('./mustache')
server.reloadDB = () => {
    server.db = low('db.json')
    return server
};

server.connection({ port: server.config.port })

// Register plugins
server.register(inert, () => {})
server.register({
    register: yar,
    options: {
        cookieOptions: {
            password: server.config.secret,
            isSecure: false
        }
    }
}, () => {})

// Controllers
let controllers = fs.readdirSync('controllers')
    .filter(file => file.slice(-3) === '.js')
    .map(file => path.resolve('controllers', file))
    .map(file => require(file))
    .forEach(controller => controller(server))

// Static serving
server.route({
    method : 'get',
    path   : '/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
})

server.start(() => {
    console.log('Server running at :', server.info.uri)
})
