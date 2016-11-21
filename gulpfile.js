/**
 * Created by steve on 22/09/2016.
 */
'use strict';
const fs = require('fs');
const glob = require('glob');
const del = require('del');
const gulp = require('gulp');
const gulpCopy = require('gulp-copy');
const eslint = require('gulp-eslint');
const inject = require('gulp-inject');
const rollup = require('rollup').rollup;
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const rollupJson = require('rollup-plugin-json');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task('clean:dist', function () {
  return del([
    'dist/**/*.js',
    'dist/**/*.css',
    'dist/**/*.html'
  ]);
});

gulp.task('copyFavicon', () => {
  return gulp.src(['src/images/favicon*'])
    .pipe(gulpCopy('dist', {
      prefix: 2
    }));
});

gulp.task('copyManifest', () => {
  return gulp.src(['src/caller/manifest.json'])
    .pipe(gulpCopy('dist/caller', {
      prefix: 2
    }));
});

gulp.task('copyImages', ['copyFavicon', 'copyManifest'], () => {
  return gulp.src(['src/images/**/*'])
    .pipe(gulpCopy('dist', {
      prefix: 1
    }));
});

gulp.task('html', () => {
  const target = gulp.src('./src/**/index.html');

  return target.pipe(gulp.dest('./dist/'));
});

gulp.task('includeTemplates', ['html'], () => {
  let fileContents = fs.readFileSync('./dist/caller/index.html').toString();
  const templateFiles = glob.sync('./src/templates/**/*.html');
  const templateString = templateFiles.map(file => {
    return fs.readFileSync(file);
  }).join('\n');

  fileContents = fileContents.replace('<!--INCLUDE_TEMPLATES-->', templateString);
  fs.writeFileSync('./dist/caller/index.html', fileContents);

  fileContents = fs.readFileSync('./dist/display/index.html').toString();
  fileContents = fileContents.replace('<!--INCLUDE_TEMPLATES-->', templateString);
  fs.writeFileSync('./dist/display/index.html', fileContents);

  fileContents = fs.readFileSync('./dist/cast_receiver/index.html').toString();
  fileContents = fileContents.replace('<!--INCLUDE_TEMPLATES-->', templateString);
  fs.writeFileSync('./dist/cast_receiver/index.html', fileContents)
});

gulp.task('lint', () =>
  gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('script-display', ['typescript'], () => {
  return rollup({
    entry: 'tmp/display/index.js',
    plugins: [
      nodeResolve({ jsnext: true }),
      commonjs()
    ]
  }).then((bundle) => {
    return bundle.write({
      format: 'iife',
      dest: 'dist/display/index.js',
      sourceMap: true
    });
  });
});

gulp.task('script-caller', ['typescript'], () => {
  return rollup({
    entry: 'tmp/caller/js/index.js',
    plugins: [
      nodeResolve({ jsnext: true }),
      commonjs(),
      rollupJson({})
    ]
  }).then((bundle) => {
    return bundle.write({
      format: 'iife',
      dest: 'dist/caller/index.js',
      sourceMap: true
    });
  });
});

gulp.task('script-cast_receiver', ['typescript'], () => {
  return rollup({
    entry: 'tmp/cast_receiver/index.js',
    plugins: [
      nodeResolve({ jsnext: true }),
      commonjs(),
      rollupJson({})
    ]
  }).then((bundle) => {
    return bundle.write({
      format: 'iife',
      dest: 'dist/cast_receiver/index.js',
      sourceMap: true
    });
  });
});

gulp.task('script-customElements', () => {
  return rollup({
    entry: 'src/customElements/index.js',
    plugins: [
      nodeResolve({ jsnext: true }),
      commonjs(),
      rollupJson({})
    ]
  }).then((bundle) => {
    return bundle.write({
      format: 'iife',
      dest: 'dist/customElements.js',
      sourceMap: true
    });
  });
});

gulp.task('script-serviceWorker', () => {
  return rollup({
    entry: 'src/caller/serviceWorker/index.js',
    plugins: [
      nodeResolve({ jsnext: true }),
      commonjs(),
      rollupJson({})
    ]
  }).then((bundle) => {
    return bundle.write({
      format: 'iife',
      dest: 'dist/caller/serviceWorker.js',
      sourceMap: true
    });
  });
});

gulp.task('typescript', () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('tmp'));
});

gulp.task('watch', () => {
  gulp.watch(['src/**/*.js', 'src/**/*.ts', 'src/**/*.html'], ['build']);
});

// TODO minify all the things
// TODO pull in material design from npm

gulp.task('build', ['copyImages', 'script-display', 'script-caller', 'script-customElements', 'script-cast_receiver', 'script-serviceWorker', 'includeTemplates']);
gulp.task('test', ['lint'], () => {});
gulp.task('default', ['test']);
