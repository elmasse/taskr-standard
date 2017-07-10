'use strict';

const p = require('path');
const standard = require('standard');

module.exports = function (task, utils) {
	task.plugin('standard', { every:false, files:false }, function * (globs, opts) {
		opts = Object.assign({ quiet:false }, opts);

		standard.lintFiles(globs, opts, (err, report) => {

            if (err) {
                throw new Error(err)
            }

            // report.results.forEach(function (result) {
            //     result.messages.forEach(function (message) {
            //         log(
            //         '  %s:%d:%d: %s%s',
            //         result.filePath, message.line || 0, message.column || 0, message.message,
            //         argv.verbose ? ' (' + message.ruleId + ')' : ''
            //         )
            //     })
            // })

            let results = report.results
                .map((obj) => {
                    obj.filePath = p.relative(task.root, obj.filePath);
                    obj.output = obj.messages
                        .reduce( (prev, msg) => {
                            return `${prev} ${obj.filePath}: ${msg.message}\n`
                        }, '')
                    return obj;
                });

            if (report.errorCount > 0) {
                const num = results.filter(el => el.errorCount > 0).length;
                const noun = (num > 1) ? 'files' : 'file';
                const msg = results.reduce((prev, curr) => `${prev} ${curr.output}`, '')

                task.emit('plugin_error', {
                    plugin: '@taskr/standard',
                    error: `standard found ${report.errorCount} errors in ${num} ${noun}:\n ${msg}`
                });
            }            
        });
	});
};