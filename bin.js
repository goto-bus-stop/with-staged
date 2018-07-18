#!/usr/bin/env node

var spawn = require('child_process').spawn
var withStaged = require('.')

var argv = require('minimist')(process.argv.slice(2), { '--': true })
var patterns = argv._
var cmd = argv['--']

if (argv.h || argv.help) {
  help()
  process.exit(0)
}

if (cmd.length === 0) {
  help()
  process.exit(1)
}

if (patterns.length === 0) patterns = ['**']

withStaged(patterns, function (err, files) {
  if (err) throw err

  if (files.length > 0) {
    var result = spawn(cmd[0], cmd.slice(1).concat(files), { stdio: 'inherit' })
    result.on('exit', function (status) {
      process.exit(status)
    })
  } else {
    // nothing to do
    process.exit(0)
  }
})

function help () {
  console.log('with-staged [PATTERNS] -- <COMMAND>')
  console.log('  Run a command on git staged files.')
  console.log('')
  console.log('  PATTERNS - only run COMMAND for files matching one of the PATTERNS globs. When')
  console.log('             no PATTERNS are given, run COMMAND on all staged files.')
  console.log('  COMMAND - the command to execute. File names of matching files are appended as')
  console.log('            separate arguments.')
  console.log('')
  console.log('Example:')
  console.log('')
  console.log('  $ with-staged \'**/*.js\' -- standard')
  console.log('  runs `standard index.js test.js etc.js`')
  console.log('')
  console.log('  $ with-staged \'**/*.js\' -- prettier --write')
  console.log('  runs `prettier --write index.js test.js etc.js`')
  console.log('')
}
