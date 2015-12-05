'use strict'

var fs    = require('fs')
var path  = require('path')
var hapi  = require('hapi')
var inert = require('inert')
var yar   = require('yar')
var low   = require('lowdb')

var server = new hapi.Server()

server.db       = low('db.json')
server.config   = require('./config.json')
server.render   = require('./mustache')
server.reloadDB = function () {
    server.db = low('db.json')

    server.db.object.spotlights = server.db.object.spotlights.map(function (s) {
        var tree = s.tree;

        if (typeof s.tree === 'object') {
            return s;
        }

        var actual = s.tree;
        var isJSON = false;
        do {
            console.log('decode once', actual);
            actual = decodeURIComponent(s.tree);
            try {
                actual = JSON.parse(actual);
                isJSON = true;
            } catch (e) {
            }
        } while (!isJSON);

        s.tree = actual;

        return s;
    });

    return server
};

server.connection({ port: server.config.port, host: server.config.host })

// Register plugins
server.register(inert, function () {})
server.register({
    register: yar,
    options: {
        cookieOptions: {
            password: server.config.secret,
            isSecure: false
        }
    }
}, function () {})

// Controllers
var controllers = fs.readdirSync('controllers')
    .filter(function (file) { return file.slice(-3) === '.js' })
    .map(function (file) { return path.resolve('controllers', file) })
    .map(function (file) { return require(file) })
    .forEach(function (controller) { return controller(server) })

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

server.start(function () {
    console.log('Server running at :', server.info.uri)
})
