'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('styles', function () {
    return gulp.src('./dev/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/styles'))
        .pipe(reload({ stream: true }));
});

gulp.task('watch', () => {
    gulp.watch('./dev/styles/**/*.scss', ['styles']);
    gulp.watch('./dev/scripts/*.js', ['scripts']);
    gulp.watch('*.html', reload);
});

gulp.task('js', () => {
    gulp.src('./dev/scripts/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./public/scripts'))
        .pipe(reload({ stream: true }));
});

gulp.task('bs', () => {
    browserSync.init({
        server: '.'
    })
});

gulp.task('default', ['js', 'bs', 'styles'], () => {
    gulp.watch('dev/**/*.js', ['js']);
    gulp.watch('dev/**/*.scss', ['styles']);
    gulp.watch('./public/styles/style.css', reload);
});