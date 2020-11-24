 var gulp = require('gulp'),
     sass = require('gulp-sass'),
     concat = require('gulp-concat'),
     browserSync = require('browser-sync'),
     cssnano = require('gulp-cssnano'),
     del = require('del'),
     imagemin = require('gulp-imagemin'),
     pngquant = require('imagemin-pngquant'),
     cache = require('gulp-cache'),
     autoprefixer = require('gulp-autoprefixer'),
     uncss = require('gulp-uncss'),
     htmlhint = require("gulp-htmlhint"),
     plumber = require('gulp-plumber');
	 watch = require('gulp-watch');
	 minifyCss = require('gulp-minify-css');


//Watch для слежения ))
gulp.task('stream', function () {
    // Endless stream mode 
    return watch('./app/sass/*.scss', { ignoreInitial: false })
        .pipe(gulp.dest('watch-compact'));
});
 


//Автопрефиксы
gulp.task('default', function () {
    return gulp.src('./app/css/*.css')
        .pipe(autoprefixer({
          browsers: ['last 16 versions']
        }))
        .pipe(gulp.dest('app/css'));
});

 //Синхронизация обновления в браузере
 gulp.task('browser-sync', function() {
     browserSync({
         server: {
             baseDir: 'app'
         },
         notify: false
     });
 })

 //Компилирование sass файлов
    gulp.task('sass', function () {
      gulp.src('./app/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/css'));
    });
     
    gulp.task('sass:watch', function () {
      gulp.watch('./sass/**/*.scss', ['sass']);
    });

 // Проверка html на ошибки
 gulp.task('htmlhint', function() {
     gulp.src("./app/*.html")
         .pipe(htmlhint({
             "attr-lowercase": true,
             "tagname-lowercase": true,
             "attr-value-double-quotes": true,
             "attr-value-not-empty": true,
             "attr-no-duplication": true,
             "doctype-first": true,
             "tag-pair": true,
             "id-unique": true,
             "src-not-empty": true,
             "title-require": true,
             "head-script-disabled": true,
             "alt-require": true,
             "doctype-html5": true,
             "inline-style-disabled": true,
             "inline-script-disabled": true,
             "space-tab-mixed-disabled": true,
             "id-class-ad-disabled": true,
             "href-abs-or-rel": true,
             "style-disabled": true,
             "img-alt-require": true,
             "spec-char-escape": true
         }))
         .pipe(htmlhint.reporter())
 });

 //Запуск сервера
 gulp.task('watch', ['browser-sync', 'htmlhint', 'img',], function() {

     gulp.watch('app/sass/**/*.sass', ['sass'], browserSync.reload);
     gulp.watch('app/*.html', browserSync.reload);
     gulp.watch('app/js/**/*.js', browserSync.reload);
 });

 //сжатие картинок
 gulp.task('img', function() {
     return gulp.src('./app/images/**/*')
         .pipe(cache(imagemin({
             interlaced: true,
             progresive: true,
             svgoPlugins: [{ removeViewBox: false }],
             use: [pngquant({quality: '65-80'})]

         })))
         .pipe(gulp.dest('dist/images'));
 });

 //Cжатие css
 gulp.task('css-libs', function() {
     return gulp.src([
             'app/css/**/*.css',
         ])
         .pipe(cssnano(''))
         .pipe(gulp.dest('app/css'));
 });

 //Чистка папки dist
 gulp.task('clean', function() {
     return del.sync('dist');
 });

 //Чистка кэша
 gulp.task('clear', function() {
     return cache.clearAll('');
 });

 //билд всего в папку dist
 gulp.task('build', ['clean', 'stream', 'clear', 'img', 'sass', 'css-libs', 'watch','default',], function() {

     var buildFonts = gulp.src(['app/fonts/**/*', ])
         .pipe(gulp.dest('dist/fonts'));

     var buildJs = gulp.src(['app/js/**/*', ])
         .pipe(gulp.dest('dist/js'));

     var buildHtml = gulp.src(['app/*.html', ])
         .pipe(gulp.dest('dist/'));

     var buildImg = gulp.src(['app/images/**/*', ])
         .pipe(gulp.dest('dist/images'));

     var buildCss = gulp.src(['app/css/**/*.css', ])
         .pipe(gulp.dest('dist/css'));
 });
