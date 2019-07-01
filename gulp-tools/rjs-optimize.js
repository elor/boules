'use strict'

var through = require('through2')
var path = require('path')
var requirejs = require('requirejs')

module.exports = function (options) {
  let outDir = options.outDir || 'build'

  function scriptConfig (target, base) {
    return {
      baseUrl: 'scripts',
      mainConfigFile: [
        `${target}/scripts/${base}.js`,
        'scripts/core/config.js'
      ],
      name: path.posix.relative('scripts', `${target}/scripts/${base}`),
      out: `${outDir}/${target}/scripts/${base}.js`,
      preserveLicenseComments: false
    }
  }

  // Called for every file in the stream
  function processFile (file, encoding, callback) {
    var dir, base, dirParts, target, config

    dir = path.dirname(file.relative)
    base = path.basename(file.relative, '.js')

    dirParts = dir.split(path.sep)

    switch (false) {
      case dirParts.length === 2:
      case dirParts[1] === 'scripts':
      case base === 'main' || base === 'test':
        callback(new Error("input file does not match '<target>/scripts/{main,test}.js': " + file.relative))
    }

    target = dirParts[0]

    config = scriptConfig(target, base)

    requirejs.optimize(config, function (success) {
      callback()
    }, function (err) {
      callback(err)
    })
  }

  // Called after all files have been passed
  function finalize (callback) {
    callback()
  }

  return through.obj(processFile, finalize)
}
