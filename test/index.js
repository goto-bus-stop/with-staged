var test = require('tape')
var fs = require('fs')
var path = require('path')
var exec = require('child_process').execSync
var spawn = require('child_process').spawn
var concat = require('simple-concat')
var withStaged = require('..')
var cli = require.resolve('../bin')
var tmp = require('tmp')

function createRepo () {
  var dir = tmp.dirSync()
  process.on('exit', dir.removeCallback)

  return dir.name
}

test('nothing staged', function (t) {
  t.plan(3)
  var repo = createRepo()

  exec('git init', { cwd: repo })

  withStaged({ cwd: repo }, function (err, files) {
    t.ifError(err)
    t.ok(Array.isArray(files))
    t.equal(files.length, 0)
  })
})

test('list staged files', function (t) {
  t.plan(3)
  var repo = createRepo()

  exec('git init', { cwd: repo })
  exec('touch index.js README.md unstaged.txt', { cwd: repo })
  exec('git add index.js README.md', { cwd: repo })

  withStaged({ cwd: repo }, function (err, files) {
    t.ifError(err)
    t.ok(Array.isArray(files))
    t.deepEqual(files.sort(), ['README.md', 'index.js'])
  })
})

test('filter staged files', function (t) {
  t.plan(3)
  var repo = createRepo()

  exec('git init', { cwd: repo })
  exec('touch index.js README.md unstaged.txt', { cwd: repo })
  exec('git add index.js README.md unstaged.txt', { cwd: repo })

  withStaged(['*.js', 'unstaged.txt'], { cwd: repo }, function (err, files) {
    t.ifError(err)
    t.ok(Array.isArray(files))
    t.deepEqual(files.sort(), ['index.js', 'unstaged.txt'])
  })
})

test('run a successful command', function (t) {
  t.plan(1)
  var repo = createRepo()

  exec('git init', { cwd: repo })
  fs.writeFileSync(path.join(repo, 'a.js'), 'module.exports = 1\n')
  fs.writeFileSync(path.join(repo, 'b.js'), 'module.exports = 2\n')
  fs.writeFileSync(path.join(repo, 'index.js'), 'module.exports = require(\'./a\') + require(\'./b\')\n')
  exec('git add index.js a.js b.js', { cwd: repo })

  var proc = spawn(cli, ['*.js', '--', 'standard'], { cwd: repo })
  proc.on('error', t.error)
  proc.on('exit', function (status) {
    t.equal(status, 0)
  })
})

test('run a failing command', function (t) {
  t.plan(3)
  var repo = createRepo()

  exec('git init', { cwd: repo })
  fs.writeFileSync(path.join(repo, 'a.js'), 'module.exports = 1;')
  fs.writeFileSync(path.join(repo, 'b.js'), 'module.exports = 2;')
  fs.writeFileSync(path.join(repo, 'index.js'), 'module.exports = require(\'./a\') + require(\'./b\');')
  exec('git add index.js a.js b.js', { cwd: repo })

  var proc = spawn(cli, ['*.js', '--', 'standard'], { cwd: repo })
  proc.on('error', t.error)
  concat(proc.stderr, function (err, buf) {
    t.ifError(err)
    t.ok(buf.toString().length > 100, 'piped `standard` output')
  })
  proc.on('exit', function (status) {
    t.equal(status, 1)
  })
})

test('filters on the cli', function (t) {
  t.plan(3)
  var repo = createRepo()

  exec('git init', { cwd: repo })
  exec('touch index.js README.md package.json', { cwd: repo })
  exec('git add .', { cwd: repo })

  var proc = spawn(cli, ['*.js', '--', 'echo'], { cwd: repo })
  concat(proc.stdout, function (err, buf) {
    t.ifError(err)
    t.equal(buf.toString().trim(), 'index.js')
  })
  proc.on('error', t.error)
  proc.on('exit', function (status) {
    t.equal(status, 0)
  })
})
