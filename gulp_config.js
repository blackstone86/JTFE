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

// 当前浏览视图
let currview = "menu";
exports.currview = currview;
