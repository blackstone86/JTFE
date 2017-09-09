let config = require("./gulp_config");
let outputDir = config.outputDir;

/**
 * 文件类型
 */
const FILE_TYPE = [
    "js"
    ,"css"
    ,"html"
    ,"tpl"
];

let _getAll = function(dir){
    let ret = {};
    let base_dir = dir ? (dir + '/') : '';
    FILE_TYPE.length && FILE_TYPE.map(function(filetype){
        ret[filetype] = base_dir + '**/*.' + filetype;
    });
    return ret;
}
/**
 * 范式
 */
let PATTENS = {
    all: _getAll()
    ,output_all: _getAll(outputDir)
    ,all_source: "**/*"
}
exports.PATTENS = PATTENS;

/**
 * 是否数组
 * @param  {Mix} arr 待检测参数
 * @return {Boolean} 是否数组
 */
function isArray(arr){
    return Object.prototype.toString.apply(arr) === '[object Array]';
}
exports.isArray = isArray;

/**
 * 是否字符串
 * @param  {Mix} text 待检测参数
 * @return {Boolean} 是否字符串
 */
function isString(text){
    return typeof text === "string";
}
exports.isString = isString;

/**
 * 是否后缀文件名范式
 * @param  {String}  fileName 文件夹范式
 * @return {Boolean} 是否后缀文件名范式
 */
function isSuffix(fileName){
    return isString(fileName) ? (/^\./).test(fileName) : false;
}
exports.isSuffix = isSuffix;

/**
 * 获取排除文件夹名称范式
 * @param  {Array/String} excludeDirs 排除文件夹名称
 * @param  {String}       customDir   根目录下的指定文件夹下排除 非必填（不填时，默认在根目录下排除文件夹）
 * @return {Array} 排除文件夹名称范式
 */
function getExcludeDirs(excludeDirs, customDir){
    let ret = [];
    let base_dir = customDir ? (customDir + '/') : ''; 
    function getExclude(dir){
        return ['!' + base_dir + dir + '/**', '!' + base_dir + dir]
    }
    if(isArray(excludeDirs) && excludeDirs.length){
        excludeDirs.forEach(function(dir){
            ret = ret.concat(getExclude(dir));
        })
    }else if(typeof excludeDirs === 'string'){
        ret = getExclude(excludeDirs);
    }
    return ret;
}
exports.getExcludeDirs = getExcludeDirs;

/**
 * 获取排除文件名称范式
 * @param  {Array} ignoreFiles 排除文件名范式
 * @return {Array} 排除文件名称范式
 */
function getIgnoreFiles(ignoreFiles){
    let ret = [];
    ignoreFiles.length && (ret = ignoreFiles.map(function(file){
        return '!' + (isSuffix(file) ? '**/*' : '') + file;
    }));
    return ret;
}
exports.getIgnoreFiles = getIgnoreFiles;


