var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    concatCss = require('gulp-concat-css'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('procss', function () {  
  return gulp.src('./src/css/page.css')
    .pipe(postcss([
      require('css-mqpacker'),
      ]))
    .pipe(concatCss('page.css'))
    .pipe(cssnano({
      reduceIdents: false,
      discardComments: {removeAll: true}
    }))
    .pipe(gulp.dest('./static/css/'));
});

gulp.task('projs', function () {
  return gulp.src('./src/page js/*.js')
  .pipe(concat('page.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./static/js/'));
});

gulp.task('watchcss', function() {
  gulp.watch('./src/css/*', ['procss'])
})

gulp.task('watchjs', function() {
  gulp.watch('./src/js/*', ['projs'])
})