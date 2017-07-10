# taskr-standard 

> Standard plugin for [Taskr](https://github.com/lukeed/taskr).

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
