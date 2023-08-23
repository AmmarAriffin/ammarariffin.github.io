// gulpfile.js

// Define variables.
var autoprefixer = require('autoprefixer');
var browserSync  = require('browser-sync').create();
var cleancss     = require('gulp-clean-css');
var concat       = require('gulp-concat');
var del          = require('del');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var imagemin     = require('gulp-imagemin');
var notify       = require('gulp-notify');
var postcss      = require('gulp-postcss');
var rename       = require('gulp-rename');
var run          = require('gulp-run');
var runSequence  = require('run-sequence');
var sass         = require('gulp-ruby-sass');
var uglify       = require('gulp-uglify');

// Include paths file.
var paths = require('./_assets/gulp_config/paths');

// Uses Sass compiler to process styles, adds vendor prefixes, minifies, then
// outputs file to the appropriate location.
gulp.task('build:styles:main', function() {
    return sass(paths.sassFiles + '/main.scss', {
        style: 'compressed',
        trace: true,
        loadPath: [paths.sassFiles]
    }).pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(cleancss())
        .pipe(gulp.dest(paths.jekyllCssFiles))
        .pipe(gulp.dest(paths.siteCssFiles))
        .pipe(browserSync.stream())
        .on('error', gutil.log);
});

