var gulp = require('gulp'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	jade = require('gulp-jade');

gulp.task('jade', function(){
	return gulp.src('src/jade/*.jade')
		.pipe(plumber())
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest('app/html'));
});

gulp.task('scss', function(){
	return gulp.src('src/scss/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true,
			remove: true
		}))
		.pipe(gulp.dest('app/css'));
});

gulp.task('script', function(){
	return gulp.src('src/js/*.js')
		.pipe(plumber())
		.pipe(gulp.dest('app/js'));
});


gulp.task('watch', function(){
	gulp.watch('src/jade/*.jade', ['jade','scss']);
	gulp.watch('src/scss/*.scss', ['scss']);
	gulp.watch('src/js/*.js', ['script']);
});

gulp.task('default', ['scss', 'jade', 'script', 'watch']);