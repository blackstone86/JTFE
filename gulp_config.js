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
];
exports.ignoreFilesPatterns = ignoreFilesPatterns;

// 迁移但不处理的文件夹
let nocompressDirs = [];
exports.nocompressDirs = nocompressDirs;

// 迁移资源内容（文件夹、文件）
let transfesrc = 
[
    "./components/common/**",
    "!./components/common/**/*.less",
    "!./components/common/**/*.sass",
    "!./components/common/**/*.js",
];
exports.transfesrc = transfesrc;

// 当前浏览视图
// let currview = "aimenu";
let currview = "icon";
exports.currview = currview;
