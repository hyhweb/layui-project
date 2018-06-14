var gulp = require('gulp'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    cssmin = require('gulp-minify-css'),
    cssver = require('gulp-make-css-url-version'),
    rev = require('gulp-rev-append'),
    //imagemin = require('gulp-imagemin'),
    //pngquant = require('imagemin-pngquant'),
    runSequence = require('run-sequence'),
    webserver = require('gulp-webserver');

//清除文件
gulp.task('build-clean',function () {
    del(['./dist/*'])
})

//压缩js
gulp.task('build-scripts',function () {
    gulp.src(['./src/views/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./dist/src/views'))

    gulp.src(['./src/source/srcipts/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./dist/source/srcipts'))

})
//压缩公共js
gulp.task('build-common-scripts-css',function () {

    // gulp.src(['./common/css/*.css'])
    //     .pipe(uglify())
    //     .pipe(gulp.dest('./dist/common/css'))

})

//html文件压缩
gulp.task('build-html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        //collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
       // removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        //removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        //removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('./src/**/*.html')
        .pipe(rev())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/src'));
});
//css压缩
gulp.task('build-styles',function () {
    gulp.src(['./src/**/*.css'])
        .pipe(cssver())
        .pipe(cssmin(
            {
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }
        ))
        .pipe(gulp.dest('./src/views'))

    gulp.src(['./src/source/themes/**/*.css'])
        .pipe(cssver())
        .pipe(cssmin(
            {
                advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
                compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
                keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
                keepSpecialComments: '*'
                //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
            }
        ))
        .pipe(gulp.dest('./dist/source/themes'))
})
//图片压缩
// gulp.task('build-images', function () {
//     gulp.src('./common/**/*.{png,jpg,gif,ico}')
//         .pipe(imagemin({
//             optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
//             progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
//             interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
//             multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
//             svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
//             use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
//         }))
//         .pipe(gulp.dest('./dist/common'));
// });
//复制不需要处理的文件到dist的对应目录下
gulp.task('build-moveAll',function() {
    gulp.src(['./source/libs/**/*'])
        .pipe(gulp.dest('./dist/source/libs'))


})

//启动项目
gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      port: 8090,
      open: 'http://127.0.0.1:8090/src/views/login/index.html', // 服务器启动时自动打开网页

    }));
});

//编译
gulp.task('build', function() {
  runSequence('build-moveAll',['build-scripts','build-styles'],'build-html');
});

// 监听任务
gulp.task('watch',function(){
    gulp.watch(['./src/views/**/*.css','./src/source/themes/**/*.css'], ['build-styles']);
    gulp.watch(['../src/views/**/*.js','.//src/source/scriptes/**/*.js'], ['build-scripts']);
    gulp.watch('./src/views/**/*.html', ['build-html']) // 监听根目录下所有.html文件
});

//默认任务
gulp.task('default',['webserver','watch']);
