/* global require */

var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var streamqueue = require('streamqueue');

gulp.task('minify', function() {
  var stream = streamqueue({objectMode: true});
  stream.queue(
              gulp.src('./src/*.html')
                  .pipe(minifyHtml({
                    empty: true,
                    spare: true,
                    quotes: true
                  }))
                  .pipe(templateCache({
                    module: 'schemaForm',
                    root: 'static/views/_components/directives/fileUpload/'
                  }))
    );
  stream.queue(gulp.src('./src/*.js'));

  stream.done()
        .pipe(concat('file-upload.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('.'));

});

gulp.task('non-minified-dist', function() {
  var stream = streamqueue({objectMode: true});
  stream.queue(
              gulp.src('./src/*.html')
                  .pipe(templateCache({
                    module: 'schemaForm',
                    root: 'static/views/_components/directives/fileUpload/'
                  }))
    );
  stream.queue(gulp.src('./src/*.js'));

  stream.done()
        .pipe(concat('file-upload.js'))
        .pipe(gulp.dest('.'));

});

gulp.task('default', [
  'minify',
  'non-minified-dist'
]);

gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['default']);
});
