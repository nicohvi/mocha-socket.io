/*jslint node: true */
"use strict";

let gulp = require('gulp');
let mocha = require('gulp-mocha');
let gutil = require('gulp-util');

gulp.task('mocha', () => {
  return gulp.src(['*.test.js'], { read: false })
          .pipe(mocha({reporter: 'list'}))
          .on('error', gutil.log);
});

gulp.task('watch', () => gulp.watch(['*.js'], ['mocha']));
