'use strict';

const join = require('path').join;
const Taskr = require('taskr');
const test = require('tape');
const sinon = require('sinon');

const dir = join(__dirname, 'fixtures');
const tmp = join(dir, 'tmp');

test('@taskr/standard', t => {

	t.plan(3);

	const taskr = new Taskr({
		plugins: [
			require('../'),
			require('@taskr/clear')
		],
		tasks: {
			* foo(f) {
				yield f.source(`${dir}/*`).standard().target(tmp);
				t.pass('allow `standard` to be chainable');
				const arr = yield f.$.expand(`${tmp}/*`);
				t.equal(arr.length, 3, 'pass `standard` files on to `target()`');
				yield f.clear(tmp);
			}
		}
	});

	t.ok('standard' in taskr.plugins, 'attach `standard` plugin to Taskr');

	taskr.start('foo');
});

test('@taskr/standard failing messages', t => {
	t.plan(3);

	const error = 'standard found 8 errors in 1 file:\n   test/fixtures/failling-a.js 1: 1: Expected space(s) after "if".\n test/fixtures/failling-a.js 1: 1: Unexpected constant condition.\n test/fixtures/failling-a.js 1: 9: Missing space before opening brace.\n test/fixtures/failling-a.js 2: 2: Unexpected tab character.\n test/fixtures/failling-a.js 2: 2: Expected indentation of 2 spaces but found 1 tab.\n test/fixtures/failling-a.js 2: 14: Strings must use singlequote.\n test/fixtures/failling-a.js 2: 19: Extra semicolon.\n test/fixtures/failling-a.js 3: 2: Newline required at end of file but not found.\n';

	const taskr = new Taskr({
		plugins: [
			require('../'),
			require('@taskr/clear')
		],
		tasks: {
			* foo(f) {
				taskr.emit = sinon.spy();

				const r = yield f.source(`${dir}/failling-*`).standard().target(tmp);
				t.pass('allow `standard` to be chainable');
				yield f.clear(tmp);

				t.ok(taskr.emit.calledWithMatch('plugin_error', {
					plugin: '@taskr/standard',
					error: error
				}), 'reports errors with file name, line and column number');
			}
		}
	});

	t.ok('standard' in taskr.plugins, 'attach `standard` plugin to Taskr');

	taskr.start('foo');
});
