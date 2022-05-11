const gulp = require('gulp');

module.exports = function data() {
	return gulp.src('src/data/*').pipe(gulp.dest('build/data'));
};
