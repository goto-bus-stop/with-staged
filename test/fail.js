var assert = require('assert')
var files = process.argv.slice(2).sort()
var expected = ['a.js', 'b.js', 'index.js']

try {
  files.forEach(function (f) {
    assert.equal(f, expected.shift())
  })
} catch (err) {
  console.log('that worked')
  process.exit(0)
}

console.error('that did not work')
process.exit(1)
