var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var concat = require('gulp-concat');

var sassPaths = [
  'bower_components/normalize.scss/sass',
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src',
  'bower_components/font-awesome/scss'
];

var jsPath = [
  'bower_components/jquery/dist/jquery.js',
  'bower_components/foundation-sites/dist/js/foundation.js',
  'bower_components/wow/dist/wow.js'
];

gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'compressed' // if css compressed **file size**
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('joinjs', function() {

  return gulp.src(jsPath)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('default', ['sass', 'joinjs'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
});
