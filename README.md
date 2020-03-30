# taskr-standard 

> Standard plugin for [Taskr](https://github.com/lukeed/taskr).


[![Build Status](https://travis-ci.org/elmasse/taskr-standard.svg?branch=master)](https://travis-ci.org/elmasse/taskr-standard)

## Install

```
$ npm install --save-dev taskr-standard
```

## Usage

```js
exports.lint = function * (task) {
  yield task.source('test/**/*.js')
    .standard()
    // ...
    .target('dist');
}
```
