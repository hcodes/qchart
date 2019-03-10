'use strict';

const
    gulp = require('gulp'),
    babel = require('rollup-plugin-babel'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    rollup = require('gulp-rollup'),
    uglify = require('gulp-uglify'),
    uglifyOptions = {output: {comments: /^!/}},
    browsers = ['ie >= 10', 'Firefox >= 24', 'Chrome >= 26', 'iOS >= 6', 'Safari >= 6', 'Android > 4.0'],
    copyright = '/*! QChart | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/qchart/ */\n';

gulp.task('js', function() {
    return gulp.src('src/*.js')
        .pipe(rollup({
            input: 'src/qchart.js',
            output: {
                format: 'umd',
                name: 'QChart'
            },
            plugins: [babel()]
        }))
        .pipe(replace(/^/, copyright))
        .pipe(rename('qchart.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('js.min', gulp.series('js', function() {
    return gulp.src('dist/qchart.js')
        .pipe(rename('qchart.min.js'))
        .pipe(uglify(uglifyOptions))
        .pipe(gulp.dest('dist/'));
}));

gulp.task('css', function() {
    return gulp.src('src/*.css')
        .pipe(gulp.dest('dist/'));
});

gulp.task('css.min', gulp.series('css', function() {
    return gulp.src('dist/qchart.css')
        .pipe(cssnano())
        .pipe(autoprefixer({ browsers }))
        .pipe(rename('qchart.min.css'))
        .pipe(gulp.dest('dist/'));
}));

gulp.task('watch', function() {
    gulp.watch(['src/**/*', 'examples/**/*']);
});

gulp.task('default', gulp.parallel('js.min', 'css.min'));
