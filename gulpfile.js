const gulp = require('gulp'),
    browserify = require('gulp-browserify');

gulp.task('build', () => {
    gulp.src('client/index.html').pipe(gulp.dest('public'));

    gulp.src('client/style.css')
        .pipe(gulp.dest('public'));

    gulp.src('client/script.js')
        .pipe(browserify({}))
        .pipe(gulp.dest('public'));

    console.log('Frontend built');
});