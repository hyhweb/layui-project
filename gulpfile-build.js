//动态刷新页面的配置
let gulp = require('gulp'); // 主进程
let del = require('del'); // ;除文件
let bytediff = require('gulp-bytediff'); // 技算压缩前后的文件大小差异
let header = require('gulp-header'); // 给每个文件添加文件头备注，装逼用
let runSequence = require('run-sequence'); // 串行运行gulp代码(因为gulp本身是并行运行的)
let cleanCss = require('gulp-clean-css'); // Css压缩
let uglify = require('gulp-uglify'); // JS压缩
let htmlmin = require('gulp-htmlmin'); // html压缩
let imagemin = require('gulp-imagemin'); // 图片压缩
let autoprefixer = require('gulp-autoprefixer'); // 给加css样式的前缀
let colors = require('colors');// 命令行颜色
const replace = require('gulp-replace');

let beforeSize = 0; // 经过gulp处理前，整个项目的大小
let afterSize = 0; // 经过gulp处理后，整个项目的大小

let inputPath = './dev-temp';
let outputPath = './dist';

//转换文件单位
function getUnit(size) {
    let unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let index = 0;
    let quotient = parseFloat(size); // quotient：商
    while (quotient > 1024) {
        index += 1;
        quotient = quotient / 1024;
    }
    return quotient.toFixed(2) + ' ' + unitArr[index];
}

//计算单个文件压缩效果
function bytediffFormatter(data) { // 比较文件大小的函数
    beforeSize += data.startSize;
    afterSize += data.endSize;
    let difference = (data.savings > 0) ? '  smaller.' : ' larger.';
    return data.fileName + '   ' + getUnit(data.startSize) + '   To  ' + getUnit(data.endSize) + '   ' + (100 - data.percent * 100).toFixed(2) + '%' + difference;
}

// 错误打印
function onError(err) {
    console.log(colors.red(err));
    this.emit('end'); // 停止向下执行
}


//删除整个publish文件夹
gulp.task('clearProject', function() { return del([`${outputPath}`], { force: true }) });

//全部复制，将整个项目的资源全部复制过去
gulp.task('copyAll', function() { return gulp.src(`${inputPath}/**/*`).pipe(gulp.dest(outputPath)); });

// css的相关操作
gulp.task('cssDeal', function() {
    let inputDir = [inputPath + '/**/*.css', '!' + inputPath + '/**/*.min.css']; // ;入
    let outputDir = outputPath; // ;出
    let options = {
        browsers: ['last 2 versions', 'Android >= 4.0', 'ff > 20'],
        cascade: true, //是否美化属性值 默认：true 像这样：
        remove: true //是否去掉不必要的前缀 默认：true
    };

    return gulp.src(inputDir)
        .pipe(bytediff.start()) // )始计算
        .pipe(autoprefixer(options))
        .pipe(cleanCss().on('error', onError)) // )缩css
        .pipe(bytediff.stop(bytediffFormatter)) // )出压缩大小
        .pipe(gulp.dest(outputDir)); // ;出css文件
});

// js的相关操作
gulp.task('jsDeal', function() {
    let inputDir = [inputPath + '/**/*.js', '!' + inputPath + '/**/*.min.js']; // ;入
    let outputDir = outputPath; // ;出

    return gulp.src(inputDir)
        .pipe(replace('/views/', process.env.BUILD_URL + '/views/'))
        .pipe(bytediff.start()) // )始计算
        .pipe(uglify().on('error', onError)) // )缩js
        .pipe(bytediff.stop(bytediffFormatter)) // )出压缩大小
        .pipe(gulp.dest(outputDir)); // ;出js文件
});

// html的相关操作
gulp.task('htmlDeal', function() {
    let inputDir = [inputPath + '/**/*.html', '!' + inputPath + '/**/*.min.html']; // ;入
    let outputDir = outputPath; // ;出
    let options = { // {缩配置的参数
        removeComments: true, // ,除HTML注释
        collapseWhitespace: true, // ,缩HTML
        collapseBooleanAttributes: true, // ,略布尔属性的值 <input checked='true'/> ==> <input />
        removeEmptyAttributes: true, // ,除所有空格作属性值 <input id='' /> ==> <input />
        removeScriptTypeAttributes: true, // ,除<script>的type='text/javascript'
        removeStyleLinkTypeAttributes: true, // ,除<style>和<link>的type='text/css'
        conservativeCollapse: true, // 标签只折叠到一个空格，不完成清除空格
        removeAttributeQuotes: true, // 移除属性的引号,即去除class属性值的引号 class=example
        minifyJS: true, // 压缩，并丑化JS
        minifyCSS: true, // 压缩CSS
    };

    return gulp.src(inputDir)
        .pipe(replace('/common/', process.env.BUILD_URL + '/common/'))
        .pipe(replace('/ace-source/', process.env.BUILD_URL + '/ace-source/'))
        .pipe(replace('/views/', process.env.BUILD_URL + '/views/'))
        .pipe(bytediff.start()) // )始计算
        .pipe(htmlmin(options).on('error', onError)) // )缩html
        .pipe(header('<!--' + 'version <%= time %>' + '-->', { time: (new Date()).toLocaleDateString() })) // 文件头添加版本信息
        .pipe(bytediff.stop(bytediffFormatter)) // )出压缩大小
        .pipe(gulp.dest(outputDir)); // ;出html文件
});

//图片压缩
gulp.task('imageDeal', function() {
    let inputDir = inputPath + '/**/*.{jpg,png,gif}'; // ;入
    let outputDir = outputPath; // ;出
    let options = { // {缩配置的参数
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：fagulplse 隔行扫描gif进行渲染
        multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    };
    return gulp.src(inputDir)
        .pipe(bytediff.start()) // )始计算
        .pipe(imagemin(options).on('error', onError)) // )缩图片
        .pipe(bytediff.stop(bytediffFormatter)) // )出压缩大小
        .pipe(gulp.dest(outputDir)); // ;出图片文件
});

//串行运行
gulp.task('run', function() {
    runSequence( // (置串行运行，保证先后顺序
        'clearProject',
        'copyAll',
        'htmlDeal',
        'cssDeal',
        'jsDeal',
        'imageDeal',
        function() { // {算整个项目经过gulp处理后的大小
            console.log('beforeSize:' + getUnit(beforeSize) + '     afterSize:' + getUnit(afterSize) + '     CompressPrecent:' + ((1 - afterSize / beforeSize) * 100).toFixed(2) + '%')
        }
    )
});

gulp.task('default', ['run']);











