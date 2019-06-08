'use strict';

const
    gulp = require('gulp'),
    babel = require('rollup-plugin-babel'),
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    autoprefixer = require('autoprefixer'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    rollup = require('gulp-rollup'),
    uglify = require('gulp-uglify'),
    uglifyOptions = {output: {comments: /^!/}},
    copyright = '/*! QChart | © 2019 Denis Seleznev | MIT License | https://github.com/hcodes/qchart/ */\n';

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
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(rename('qchart.min.css'))
        .pipe(gulp.dest('dist/'));
}));

gulp.task('watch', function() {
    gulp.watch(['src/**/*', 'examples/**/*']);
});

gulp.task('default', gulp.parallel('js.min', 'css.min'));
