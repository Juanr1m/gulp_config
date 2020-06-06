"use strict"

// Load plagins
const gulp = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    pug = require('gulp-pug'),
    browsersync = require ('browser-sync');
browsersync.create()


// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./build"
        },
        port: 3000
    });
    done();
}

//preprocess + minify
function prepros() {
    return gulp.src('./src/static/style/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/css'))
        .pipe(browsersync.stream())
}

function prepPug(){
    return gulp.src('src/pug/pages/*.pug')
        .pipe(pug({
            pretty:true
        }))
        .pipe(gulp.dest('build'))
}

// Watch changes
function watchFiles(done) {
    gulp.watch('./src/static/style/**/*', prepros)
    gulp.watch('./src/pug/**/*.pug', prepPug)
    gulp.watch('./**/*.html', browserReload)
    gulp.watch('./**/*.php', browserReload)
    gulp.watch('./**/*.js', browserReload)
}

function browserReload(done) {
    browsersync.reload()
    done()
}

gulp.task('default', gulp.parallel(browserSync, watchFiles))
