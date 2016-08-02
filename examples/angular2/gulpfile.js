'use strict';

const gulp = require('gulp');
const jspm = require('jspm');
const Builder = jspm.Builder;

const builderOpts = {
	baseUrl: '.',
	transpiler: 'ts',
	typescriptOptions: {
		tsconfig: true,
		module: 'system',
		moduleResolution: 'classic',
		target: 'es6',
		targetLib: 'es6',
		typeCheck: true
	},

	packages: {
		'src': {
			'defaultExtension': 'ts'
		},
		'ts': {
			main: 'plugin.js'
		},
		typescript: {
			main: 'lib/typescript.js',
			meta: {
				'lib/typescript.js': {
					exports: 'ts'
				}
			}
		}
	}
};

const buildStaticOpts = {
	minify: false,
	mangle: false,
	rollup: false,
	sourceMaps: false,
	format: 'umd'
};

var buildCache;

gulp.task('default', function(cb) {
	// create builder instance from JSPM-generated config
	var builder = new Builder(builderOpts.baseUrl, './jspm.config.js');
	builder.config(builderOpts); // set fe-build opts

	if (buildCache) {
		builder.setCache(buildCache);
	}

	builder
	.buildStatic('src/index.ts', 'build.js', buildStaticOpts)
	.then(()=> {
		buildCache = builder.getCache();
	})
	.catch(err => {
		console.error('SystemJS Builder error:', err);

		builder.reset();
	}).finally(()=> {
		cb();
	});
});

gulp.task('watch', function() {
	return gulp.watch('**/*.ts', ['default']);
});
