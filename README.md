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
    "lint": "standard",
    "lint-staged": "with-staged '**/*.js' -- npm run lint --"
  },
  "pre-commit": [
    "lint-staged"
  ]
}
```

## Node API

### `withStaged(patterns=['**'], opts={}, cb)`

Get a filtered list of staged files.

`patterns` is an array of [micromatch v2](https://github.com/micromatch/micromatch/tree/2.3.11) glob patterns.

`opts.cwd` can be set to use a different working directory. The default is `process.cwd()`.

`cb` is a Node-style `(err, files)` callback. `files` is an array of file names.

## Related

[lint-staged](https://github.com/okonet/lint-staged) is the inspiration for this module.

Differences:
- with-staged is not tested on Windows and probably doesn't work there while lint-staged does
- with-staged has a tiny dependency tree while lint-staged's is somewhat large
- with-staged works with older Node versions while lint-staged requires v6+
- with-staged is configured through command line arguments while lint-staged puts configuration in a separate package.json key
- with-staged just dumps subprocess output, lint-staged has its own sweet progress UI (may be unnecessary for your use case)

**lint-staged**

```json
{
  "lint-staged": {
    "**/*.js": [
      "prettier --write",
      "git add"
    ]
  }
}
```

**with-staged**

```bash
with-staged '**/*.js' -- prettier --write
with-staged '**/*.js' -- git add
```

## License

[Apache-2.0](LICENSE.md)
