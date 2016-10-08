'use strict';

const gulp = require('gulp'),
tslint = require('gulp-tslint'),
Config = require('./gulpfile.config')
;

const config = new Config();

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
  return gulp
    .src( config.allTypeScript )
    .pipe( tslint({ formatter: 'verbose' }) )
    .pipe(tslint.report());
});



gulp.task('watch', function() {
  gulp.watch([config.allTypeScript], ['ts-lint']);
});


gulp.task('default', ['ts-lint']);