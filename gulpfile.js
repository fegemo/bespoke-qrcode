var gulp = require('gulp'),
  del = require('del'),
  jshint = require('gulp-jshint'),
  map = require('vinyl-map'),
  istanbul = require('istanbul'),
  karma = require('karma'),
  autoprefixer = require('gulp-autoprefixer'),
  coveralls = require('gulp-coveralls'),
  csso = require('gulp-csso'),
  header = require('gulp-header'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  pkg = require('./package.json'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  merge = require('merge-stream'),
  path = require('path');

gulp.task('default', ['clean', 'lint', 'test', 'compile']);
gulp.task('dev', ['compile', 'lint', 'test', 'watch']);

gulp.task('watch', function() {
  gulp.watch('lib/**/*.js', ['test', 'lint', 'compile']);
  gulp.watch('test/spec/**/*.js', ['test']);
});

gulp.task('clean', function() {
  return del([
    'dist',
    'lib-instrumented',
    'test/coverage',
    'lib/bespoke-qrcode.min.css'
  ]);
});

gulp.task('lint', function() {
  return gulp.src(['gulpfile.js', 'lib/**/*.js', 'specs/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('styles', function() {
  return gulp.src('lib/bespoke-qrcode.css')
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(csso())
    .pipe(rename('bespoke-qrcode.min.css'))
    .pipe(gulp.dest('lib'));
});

gulp.task('instrument', ['styles'], function() {
  var tasks = [];
  tasks.push(gulp.src('lib/bespoke-qrcode.js')
    .pipe(map(function(code, filename) {
      var instrumenter = new istanbul.Instrumenter(),
        relativePath = path.relative(__dirname, filename);
      return instrumenter.instrumentSync(code.toString(), relativePath);
    }))
    .pipe(gulp.dest('lib-instrumented')));
  tasks.push(gulp.src('lib/bespoke-qrcode.min.css')
    .pipe(gulp.dest('lib-instrumented')));
  return merge(tasks);
});

gulp.task('test', ['instrument'], function(done) {
  var server = new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function() { done(); });
  server.start();
});

gulp.task('coveralls', ['test'], function() {
  return gulp.src(['test/coverage/**/lcov.info'])
    .pipe(coveralls());
});

gulp.task('compile', ['clean', 'styles'], function() {
  return browserify({/*debug: true,*/ standalone: 'bespoke.plugins.qrcode'})
    .add('./lib/bespoke-qrcode.js')
    .transform('brfs')
    .bundle()
    .pipe(source('bespoke-qrcode.js'))
    .pipe(buffer())
    .pipe(header([
      '/*!',
      ' * <%= name %> v<%= version %>',
      ' *',
      ' * Copyright <%= new Date().getFullYear() %>, <%= author.name %>',
      ' * This content is released under the <%= license %> license',
      ' */\n\n'
    ].join('\n'), pkg))
    .pipe(gulp.dest('dist'))
    .pipe(rename('bespoke-qrcode.min.js'))
    .pipe(uglify())
    .pipe(header([
      '/*! <%= name %> v<%= version %> ',
      '© <%= new Date().getFullYear() %> <%= author.name %>, ',
      '<%= license %> License */\n'
    ].join(''), pkg))
    .pipe(gulp.dest('dist'));
});
