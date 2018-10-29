var gulp = require('gulp'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    reload = browserSync.reload;
    //autoprefixer = require('gulp-autoprefixer');

var path = {
    build: {
        html: './build',
        js: './build/js',
        css: './build/css',
        img: './build/img',
        fonts: './build/fonts'
    },

    src: {
        html: './src/template/index.html',
        js: './src/js/main.js',
        style: './src/style/main.scss',
        img: './src/img/**/*.*',
        fonts: './src/fonts/**/*.*'
    },
    watch: {
        html: './src/template/*.html',
        js: './src/js/**/*.js',
        style: './src/style/**/*.scss'
    },

    clean: './build'
};

gulp.task('webserver', function(){
    browserSync({
        server: {
            baseDir: 'build'
        },
        notify: false 
    });
});

gulp.task('html:build', function(){
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('libs:build', function(){
    gulp.src([
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/wow/dist/wow.min.js',
        './bower_components/magnific-popup/dist/magnific-popup.min.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'))
});

gulp.task('js:build',['libs:build'], function(){
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function(){
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('css:build', ['style:build'], function() {
    gulp.src('src/style/libs.scss') // Выбираем файл для минификации
        .pipe(sass())
        .pipe(cssmin()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest(path.build.css)); // Выгружаем в папку app/css
});

gulp.task('img:build', function(){
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
});
gulp.task('fonts:build', function(){
    gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});
gulp.task('build', [
    'html:build',
    'js:build',
    'css:build',
    'img:build',
    'fonts:build'
]);

gulp.task('watch', function(){
    watch([path.watch.js], function(ev, callback){
        gulp.start('js:build');
    });
    watch([path.watch.html], function(ev, callback){
        gulp.start('html:build');
    });
    watch([path.watch.style], function(ev, callback){
        gulp.start('style:build');
    });
});

gulp.task('clean', function(callback){
    rimraf(path.clean, callback);
});

gulp.task('default', ['build', 'webserver', 'watch']);