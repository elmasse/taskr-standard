'use strict';

const join = require('path').join;
const Taskr = require('taskr');
const test = require('tape');

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
				t.equal(arr.length, 2, 'pass `standard` files on to `target()`');
				yield f.clear(tmp);
			}
		}
	});

	t.ok('standard' in taskr.plugins, 'attach `standard` plugin to Taskr');

	taskr.start('foo');
});