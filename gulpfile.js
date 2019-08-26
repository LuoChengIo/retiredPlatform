/* = Gulp组件
-------------------------------------------------------------- */
// 引入gulp
var gulp = require('gulp'); // 基础库

// 引入我们的gulp组件
var uglify = require('gulp-uglify'), // JS文件压缩
  imagemin = require('gulp-imagemin'), // imagemin 图片压缩
  pngquant = require('imagemin-pngquant'), // imagemin 深度压缩
  livereload = require('gulp-livereload'), // 网页自动刷新（服务器控制客户端同步刷新）
  webserver = require('gulp-webserver'), // 本地服务器
  rename = require('gulp-rename'), // 文件重命名
  sourcemaps = require('gulp-sourcemaps'), // 来源地图
  changed = require('gulp-changed'), // 只操作有过修改的文件
  concat = require("gulp-concat"), // 文件合并
  clean = require('gulp-clean'), // 文件清理
  spritesmith = require('gulp.spritesmith'), //图片合并
  postcss = require('gulp-postcss'), //postcss
  autoprefixer = require('gulp-autoprefixer'), // css3样式兼容
  sass = require('gulp-sass');

/* = 全局设置
-------------------------------------------------------------- */
var srcPath = {
  html: 'src',
  styles: 'src/styles',
  fonts: 'src/fonts',
  script: 'src/js',
  image: 'src/images'
};
var destPath = {
  html: 'dist',
  css: 'dist/css',
  fonts: 'dist/fonts',
  script: 'dist/js',
  image: 'dist/images'
};
/* = 开发环境( Ddevelop Task )
-------------------------------------------------------------- */
// HTML处理
gulp.task('html', function () {
  return gulp.src(srcPath.html + '/**/*.html')
    .pipe(gulp.dest(destPath.html));
});

gulp.task('styles', function() {
  gulp.src([srcPath.styles + '/**/*.scss'])
      .pipe(sass({
        outputStyle: 'compact'
      }))//把scss转为css
      .pipe(sass().on('error', sass.logError))//插入sass日志错误函数，更改默认行为，以便统一修改
      .pipe(autoprefixer())
      .pipe(gulp.dest(destPath.css));//把转好的css文件存入css文件夹
})
// JS文件压缩&重命名
gulp.task('script', function () {
  return gulp.src([srcPath.script + '/*.js', '!' + srcPath.script + '/*.min.js']) // 指明源文件路径、并进行文件匹配，排除 .min.js 后缀的文件
    // .pipe(sourcemaps.init()) // 执行sourcemaps
    // .pipe(rename({
    //   suffix: '.min'
    // })) // 重命名
    // .pipe(uglify({
    //   warnings: 'verbose',
    //   mangle: true, //类型：Boolean 默认：true 是否修改变量名
    //   toplevel: false, //（默认false） - true如果要启用顶级变量和函数名称修改并删除未使用的变量和函数，。
    //   keep_fnames: false // (默认值:) false- 传递true以防止丢弃或损坏函数名称。对于依赖的代码很有用
    // })) // 使用uglify进行压缩，并保留部分注释
    // .pipe(sourcemaps.write('maps')) // 地图输出路径（存放位置）
    .pipe(gulp.dest(destPath.script)); // 输出路径
});
// 把一些插件直接复制过去
gulp.task('copy', function () { // 复制css文件
  gulp.src(srcPath.script + '/plugins/**')
  .pipe(gulp.dest(destPath.script+'/plugins'));
  gulp.src(srcPath.fonts + '/*')
    .pipe(gulp.dest(destPath.fonts));
});
// imagemin 图片压缩
gulp.task('images', function () {
  return gulp.src(srcPath.image + '/**/*') // 指明源文件路径，如需匹配指定格式的文件，可以写成 .{png,jpg,gif,svg}
    .pipe(changed(destPath.image)) // 对应匹配的文件
    .pipe(imagemin({
      progressive: true, // 无损压缩JPG图片
      svgoPlugins: [{
        removeViewBox: false
      }], // 不要移除svg的viewbox属性
      use: [pngquant()] // 深度压缩PNG
    }))
    .pipe(gulp.dest(destPath.image)); // 输出路径
});
// 文件合并
gulp.task('concat', function () {
  return gulp.src(srcPath.script + '/libs/*.js') // 要合并的文件
    .pipe(concat('libs.js')) // 合并成libs.js
    .pipe(rename({
      suffix: '.min'
    })) // 重命名
    .pipe(gulp.dest(destPath.script)); // 输出路径
});

// 本地服务器
gulp.task('webserver', function () {
  gulp.src(destPath.html) // 服务器目录（.代表根目录）
    .pipe(webserver({ // 运行gulp-webserver
      livereload: true, // 启用LiveReload
      open: true // 服务器启动时自动打开网页
    }));
});
// 监听任务
gulp.task('watch', function () {
  // 监听 html
  gulp.watch(srcPath.html + '/**/*.html', ['html'])
  // 监听 styles
  gulp.watch(srcPath.styles + '/**/*.scss', ['styles']);
  // 监听 images
  gulp.watch(srcPath.image + '/**/*', ['images']);
  // 监听 js
  gulp.watch(srcPath.script + '/plugins/**', ['copy']);
  gulp.watch([srcPath.script + '/*.js', '!' + srcPath.script + '/*.min.js'], ['script']);
  gulp.watch(srcPath.script + '/libs/*.js', ['concat']);
});
// 默认任务
gulp.task('default', ['copy','webserver', 'watch']);

/* = 发布环境( Release Task )
-------------------------------------------------------------- */
// 清理文件
gulp.task('clean', function () {
  return gulp.src([destPath.css + '/maps', destPath.script + '/maps'], {
      read: false
    }) // 清理maps文件
    .pipe(clean());
});
// 脚本压缩&重命名
gulp.task('scriptRelease', function () {
  return gulp.src([srcPath.script + '/*.js', '!' + srcPath.script + '/*.min.js']) // 指明源文件路径、并进行文件匹配，排除 .min.js 后缀的文件
    .pipe(rename({
      suffix: '.min'
    })) // 重命名
    .pipe(uglify({
      preserveComments: 'some'
    })) // 使用uglify进行压缩，并保留部分注释
    .pipe(gulp.dest(destPath.script)); // 输出路径
});
// 打包发布
gulp.task('release', ['clean'], function () { // 开始任务前会先执行[clean]任务
  return gulp.start('scriptRelease', 'images'); // 等[clean]任务执行完毕后再执行其他任务
});