'use strict'

let fs    = require('fs')
let path  = require('path')
let hapi  = require('hapi')
let inert = require('inert')
let yar   = require('yar')

let server = new hapi.Server()
server.config = require('./config.json')

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

// Cookies
server.state('auth', {
    ttl         : null,
    isSecure    : false,
    isHttpOnly  : true,
    encoding    : 'base64json',
    clearInvalid: false,
    strictHeader: true
})

// Controllers
let controllers = fs.readdirSync('controllers')
    .filter(file => file.slice(-3) === '.js')
    .map(file => path.resolve('controllers', file))
    .map(file => require(file))
    .forEach(controller => controller(server))

server.start(() => {
    console.log('Server running at :', server.info.uri)
})
