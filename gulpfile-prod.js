var gulp = require('gulp'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    cssmin = require('gulp-minify-css'),
    cssver = require('gulp-make-css-url-version'),
    rev = require('gulp-rev-append'),
    replace = require('gulp-replace'),
    watch = require('gulp-watch'),
   // sass = require('gulp-sass'),
    less=require('gulp-less'),
    //imagemin = require('gulp-imagemin'),
    //pngquant = require('imagemin-pngquant'),
    runSequence = require('run-sequence'),
    webserver = require('gulp-webserver'),
    autoprefixer = require('gulp-autoprefixer'),
    fs = require("fs"); 

//读取页面的公共部分header, menu, footer
var headerHTML = fs.readFileSync('./src/views/template/header.html', 'utf8'),// 头部模板内容
    footerHTML = fs.readFileSync('./src/views/template/footer.html', 'utf8'),
    sidebarHTML = fs.readFileSync('./src/views/template/navigations.html', 'utf8'); 



//清除文件
gulp.task('build-clean',function () {
    return del(['./dist/*'])
})

//压缩js
gulp.task('build-scripts',function () {
    // return watch(['./src/views/**/*.js','./src/source/scriptes/**/*.js'], { ignoreInitial: false },function () {
        gulp.src(['./src/views/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./dist/src/views'))

    gulp.src(['./src/source/scriptes/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./dist/src/source/scriptes'))
    // })
    

})
//压缩公共js
gulp.task('build-common-scripts-css',function () {

    // gulp.src(['./common/css/*.css'])
    //     .pipe(uglify())
    //     .pipe(gulp.dest('./dist/common/css'))

})
//sass编译
// gulp.task('build-sass',function () {
//     gulp.src(['./src/source/themes/*.scss'])
//         .pipe(autoprefixer({
//             browsers: ['last 2 versions'],
//             cascade: false
//         }))
//         .pipe(sass())
//         .pipe(gulp.dest('./src/source/themes'))

// })
//less编译
gulp.task('build-less',function () {
    gulp.src(['./src/source/themes/*.less'])
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(less())
        .pipe(gulp.dest('./src/source/themes'))

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

   // return watch(['./src/views/**/*.html'], { ignoreInitial: false },function () {
            gulp.src(['./src/views/**/*.html'])
        .pipe(replace('<gulp-replace-header></gulp-replace-header>', headerHTML)) // 填充顶部栏
        .pipe(replace('<gulp-replace-sidebar></gulp-replace-sidebar>', sidebarHTML)) // 填充侧边栏
        .pipe(replace('<gulp-replace-footer></gulp-replace-footer>', footerHTML)) // 填充底部
        
        //.pipe(replace('@common', commonPath)) // 替换路径
        //.pipe(replace('@ace', acePath)) // 替换路径
        .pipe(rev())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/src/views'));
   // })
    
});
//css压缩
gulp.task('build-styles',function () {

   // return watch(['./src/views/**/*.css','./src/views/**/*.css'], { ignoreInitial: false },function () {
            gulp.src(['./src/views/**/*.css'])
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
        .pipe(gulp.dest('./dist/src/views'))


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
        .pipe(gulp.dest('./dist/src/source/themes'))
  //  })




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
    // return watch(['./src/source/libs/**/*','./src/source/images/**/*'], function () {
        gulp.src(['./src/source/libs/**/*'])
        .pipe(gulp.dest('./dist/src/source/libs'))
        gulp.src(['./src/source/images/**/*'])
        .pipe(gulp.dest('./dist/src/source/images'))
        gulp.src(['./src/source/scriptes/plugins/**/*'])
        .pipe(gulp.dest('./dist/src/source/scriptes/plugins'))
    // })

})


//编译
gulp.task('build',['build-clean'], function() {
  runSequence(['build-less'],'build-moveAll',['build-scripts','build-styles','build-html']);
});


//默认任务
gulp.task('default',['build']);
