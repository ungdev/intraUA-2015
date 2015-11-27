'use strict'

var fs       = require('fs')
var path     = require('path')
var mustache = require('mustache')

module.exports = function (reply, filePath, data) {
    filePath = path.resolve('views', filePath + '.html')

    fs.readFile(filePath, function (err, fileContent) {
        if (err) {
            return reply(err.message).code(500);
        }

        var rendered = mustache.render(fileContent.toString(), data)
        return reply(rendered)
    })
}
