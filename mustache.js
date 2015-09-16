'use strict'

let fs       = require('fs')
let path     = require('path')
let mustache = require('mustache')

module.exports = (reply, filePath, data) => {
    filePath = path.resolve('views', `${filePath}.html`)

    fs.readFile(filePath, (err, fileContent) => {
        if (err) {
            return reply(err).code(500)
        }

        let rendered = mustache.render(fileContent.toString(), data)
        return reply(rendered)
    })
}
