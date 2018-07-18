var spawn = require('child_process').spawn
var mm = require('micromatch')

function getStagedFiles (cb) {
  var proc = spawn('git', ['diff', '--cached', '--name-only'])
  var stdout = ''
  proc.stdout.on('data', function (chunk) { stdout += chunk })
  proc.on('error', cb)
  proc.on('exit', function () {
    var list = stdout.split('\n').filter(Boolean)
    cb(null, list)
  })
}

module.exports = function withStaged (patterns, cb) {
  if (typeof patterns === 'function') {
    cb = patterns
    patterns = ['**']
  }

  getStagedFiles(function (err, list) {
    if (err) return cb(err)
    var files
    try {
      files = mm(list, patterns)
    } catch (err) {
      return cb(err)
    }
    cb(null, files)
  })
}
