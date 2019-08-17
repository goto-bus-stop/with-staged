var spawn = require('child_process').spawn
var mm = require('micromatch')

function getStagedFiles (opts, cb) {
  var proc = spawn('git', ['diff', '--cached', '--name-only', '--diff-filter=d'], { cwd: opts.cwd })
  var stdout = ''
  proc.stdout.on('data', function (chunk) { stdout += chunk })
  proc.on('error', cb)
  proc.on('exit', function () {
    var list = stdout.split('\n').filter(Boolean)
    cb(null, list)
  })
}

module.exports = function withStaged (patterns, opts, cb) {
  // withStaged({ cwd: '' }, function () {})
  if (typeof patterns === 'object' && !Array.isArray(patterns)) {
    cb = opts
    opts = patterns
    patterns = ['**']
  }
  // withStaged(['**'], function () {})
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  // withStaged(function () {})
  if (typeof patterns === 'function') {
    cb = patterns
    opts = {}
    patterns = ['**']
  }

  getStagedFiles(opts, function (err, list) {
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
