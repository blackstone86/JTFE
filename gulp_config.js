// 输出目标目录
let outputDir = "public";
exports.outputDir = outputDir;

// 压缩包目录
let packageDir = "package";
exports.packageDir = packageDir;

// 不迁移的文件夹
let excludeDirs = [
    ".idea"
    ,"node_modules"
    ,outputDir
    ,packageDir
];
exports.excludeDirs = excludeDirs;

// 不迁移的文件
let ignoreFilesPatterns = [
    "**/*.js"
    ,"**/*.css"
    ,"**/*.less"
    ,"**/*.sass"
    ,"**/*.ejs"
];
exports.ignoreFilesPatterns = ignoreFilesPatterns;

// 迁移但不处理的文件夹
let nocompressDirs = [];
exports.nocompressDirs = nocompressDirs;

// 迁移资源内容（文件夹、文件）
let transfesrc = 
[
    // 项目公共字体图标
    "./components/common/**",
    "!./components/common/**/*.less",
    "!./components/common/**/*.sass",
    "!./components/common/**/*.js",
    // 甘特图自带字体图标
    "./components/gantt/**",
    "!./components/gantt/css",
    "!./components/gantt/css/**",
    "!./components/gantt/i18n",
    "!./components/gantt/i18n/**",
    "!./components/gantt/imgs",
    "!./components/gantt/imgs/**",
    "!./components/gantt/tpls",
    "!./components/gantt/tpls/**",
    "!./components/gantt/**/*.json",
    "!./components/gantt/**/*.js",
];
exports.transfesrc = transfesrc;

// 当前浏览视图
// let currview = "aim-menu";
let currview = "ali-menu";
// let currview = "icon";
// let currview = "gantt";
exports.currview = currview;
