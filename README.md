# with-staged

run a command (like linting) on git staged files

[Install](#install) - [Usage](#usage) - [Node API](#node-api) - [License: Apache-2.0](#license)

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/with-staged.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/with-staged
[travis-image]: https://img.shields.io/travis/goto-bus-stop/with-staged.svg?style=flat-square
[travis-url]: https://travis-ci.org/goto-bus-stop/with-staged
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install with-staged
```

## Usage

```
with-staged [PATTERNS] -- <COMMAND>
  Run a command on git staged files.

  PATTERNS - only run COMMAND for files matching one of the PATTERNS globs. When
             no PATTERNS are given, run COMMAND on all staged files.
  COMMAND - the command to execute. File names of matching files are appended as
            separate arguments.

Example:

  $ with-staged '**/*.js' -- standard
  runs `standard index.js test.js etc.js`

  $ with-staged '**/*.js' -- prettier --write
  runs `prettier --write index.js test.js etc.js`
```

You can use it with `pre-commit` for very lightweight linting on `git commit`:

```json
{
  "devDependencies": {
    "pre-commit": "^1.0.0",
    "standard": "^11.0.0",
    "with-staged": "^1.0.0"
  },
  "scripts": {
    "lint": "standard"
  },
  "pre-commit": [
    "with-staged '*.js' -- npm run lint --"
  ]
}
```

## Node API

### `withStaged(patterns=['**'], cb)`

Get a filtered list of staged files.

`patterns` is an array of [micromatch v2](https://github.com/micromatch/micromatch/tree/2.3.11) glob patterns.

`cb` is a Node-style `(err, files)` callback. `files` is an array of file names.

## License

[Apache-2.0](LICENSE.md)
