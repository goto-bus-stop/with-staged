var assert = require('assert')
var files = process.argv.slice(2).sort()
var expected = ['a.js', 'b.js', 'index.js']

files.forEach(function (f) {
  assert.equal(f, expected.shift())
})

console.log('that worked')
process.exit(0)
