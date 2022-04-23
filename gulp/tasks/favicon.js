const gulp = require('gulp');

module.exports = function favicon() {
  return gulp.src('src/favicon/*').pipe(gulp.dest('build/assets/favicon'));
};
