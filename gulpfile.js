'use strict';

const
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    babel = require('rollup-plugin-babel'),
    uglifyOptions = {output: {comments: /^!/}},
    browsers = ['ie >= 10', 'Firefox >= 24', 'Chrome >= 26', 'iOS >= 6', 'Safari >= 6', 'Android > 4.0'],
    copyright = '/*! QChart | © 2018 Denis Seleznev | MIT License | https://github.com/hcodes/qchart/ */\n';

gulp
    .task('js', function() {
        return gulp.src('src/*.js')
            .pipe($.rollup({
                input: 'src/qchart.js',
                output: {
                    format: 'umd',
                    name: 'QChart'
                },
                plugins: [babel()]
            }))
            .pipe($.replace(/^/, copyright))
            .pipe($.rename('qchart.js'))
            .pipe(gulp.dest('dist/'));
    })
    .task('js.min', ['js'], function() {
        return gulp.src('dist/qchart.js')
            .pipe($.rename('qchart.min.js'))
            .pipe($.uglify(uglifyOptions))
            .pipe(gulp.dest('dist/'));
    })
    .task('es6', function() {
        return gulp.src('src/qchart.js')
            .pipe($.rename('qchart.es6.js'))
            .pipe($.replace(/^/, copyright))
            .pipe(gulp.dest('dist/'));
    })
    .task('css', function() {
        return gulp.src('src/*.css')
            .pipe(gulp.dest('dist/'));
    })
    .task('css.min', ['css'], function() {
        return gulp.src('dist/qchart.css')
            .pipe($.cleancss())
            .pipe($.autoprefixer({ browsers }))
            .pipe($.rename('qchart.min.css'))
            .pipe(gulp.dest('dist/'));
    })
    .task('watch', function() {
        gulp.watch(['src/**/*', 'examples/**/*']);
    })
    .task('default', ['js.min', 'es6', 'css.min']);
