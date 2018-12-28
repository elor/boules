const createcommonjs = require('./gulp-tools/create-common')
const createtestjs = require('./gulp-tools/create-test')
const filecount = require('./gulp-tools/filecount')
const gulp = require('gulp')
const run = require('gulp-run')
const build = require('./gulp-tools/build')
const release = require('./gulp-tools/release')
const checkdependencies = require('./gulp-tools/check-dependencies')
const libs = require('./gulp-tools/libs')
const mainstyle = require('./gulp-tools/mainstyle')
const sources = require('./gulp-tools/sources')
const template = require('./gulp-tools/template')

gulp.task('default', ['lib', 'update', 'lint', 'build', 'test'])
gulp.task('update', ['update-mainstyle', 'update-common-js', 'update-test-js', 'template'])
gulp.task('template', template.targets.map(target => template(target, sources)))
gulp.task('test', ['lib', 'lint'], function () {
  return run('node cli/test.js').exec()
})

gulp.task('lib', libs())
gulp.task('build', build())
gulp.task('release', release())

gulp.task('test-dependencies', ['lib'], function () {
  return gulp.src(sources.dependent_scripts, { base: 'scripts' })
    .pipe(filecount())
    .pipe(checkdependencies())
})

/**
 * update
 **/
gulp.task('update-mainstyle', ['lib-styles'], function () {
  return gulp.src(sources.styles, { base: 'style/' })
    .pipe(filecount())
    .pipe(mainstyle())
    .pipe(filecount())
    .pipe(gulp.dest('style'))
})

gulp.task('update-common-js', function () {
  return gulp.src(sources.scripts, { base: 'scripts/' })
    .pipe(filecount())
    .pipe(createcommonjs())
    .pipe(gulp.dest('scripts/core'))
})

gulp.task('update-test-js', function () {
  return gulp.src(sources.tests, { base: 'scripts/' })
    .pipe(filecount())
    .pipe(createtestjs())
    .pipe(gulp.dest('test/scripts'))
})

gulp.task('lint-standard', function () {
  const standard = require('gulp-standard')

  return gulp.src(sources.scripts_for_standardjs)
    .pipe(filecount())
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('lint', ['lint-standard'])

gulp.task('watch', function () {
  gulp.watch(sources.scripts, ['update-common-js'])
  gulp.watch(sources.scripts_for_jshint, ['lint-jshint'])
  gulp.watch(sources.scripts_for_standardjs, ['lint-standard'])
  gulp.watch(sources.scripts_and_tests, ['test'])
  gulp.watch(sources.dependent_scripts, ['test-dependencies'])
  gulp.watch(sources.styles, ['update-mainstyle'])
  gulp.watch(sources.templates, ['template'])
  gulp.watch(sources.tests, ['update-test-js'])
})
