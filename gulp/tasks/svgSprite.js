const gulp = require('gulp');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');

module.exports = function svgSprite() {
  return gulp
    .src('src/images/**/*.svg')
    .pipe(
      svgmin({
        js2svg: {
          pretty: true
        }
      })
    )
    .pipe(
      svgstore({
        inlineSvg: true
      })
    )
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/images'));
};
