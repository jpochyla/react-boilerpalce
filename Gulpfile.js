var gulp = require('gulp')
var sass = require('gulp-sass')
var connect = require('gulp-connect')
var sourcemaps = require('gulp-sourcemaps')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')

gulp.task('sass', function() {
    gulp.src('./app/src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./app/dist'))
})

gulp.task('browserify', function() {
    var bundler = browserify({
        entries: ['./app/src/js/app.js'],
        debug: true
    }).transform('reactify', { es6: true })

    return bundler
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./app/dist'))
})

gulp.task('connect', function() {
    connect.server({
        root: 'app',
        port: 3000,
        livereload: true
    })
})

gulp.task('html', function () {
    gulp.src('./app/*.html').pipe(connect.reload())
})

gulp.task('js', function () {
    gulp.src('./app/dist/**/*.js').pipe(connect.reload())
})

gulp.task('css', function () {
    gulp.src('./app/dist/**/*.css').pipe(connect.reload())
})

gulp.task('watch', function() {
    gulp.watch('./app/index.html', ['html'])
    gulp.watch('./app/dist/**/*.js', ['js'])
    gulp.watch('./app/dist/**/*.css', ['css'])
    gulp.watch('./src/**/*.scss', ['sass'])
    gulp.watch('./src/**/*.js', ['browserify'])
})

gulp.task('default', ['browserify', 'sass'])
gulp.task('serve', ['browserify', 'sass', 'connect', 'watch'])
