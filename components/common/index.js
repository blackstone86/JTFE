var toString = Object.prototype.toString;

/**
 * 是否是对象
 * @param  {Object}  val  要判断的对象
 * @return {Boolean}      判断结果
 */
function isObject (obj) {
    return toString.call(obj) === "[object Object]";
}

module.exports.isObject = isObject;

function isNumber(val){
    return !(val === null || isNaN(+val));
}

module.exports.isNumber = isNumber;

function isArray(obj){
    return toString.call(obj) === "[object Array]";
}

module.exports.isArray = isArray;

function isString(str){
    return (typeof(str) == 'string');
}

module.exports.isString = isString;

function getRandom(){
    return (Math.random()*10000).toFixed(0)+"."+(Math.random()*10000);
}

module.exports.getRandom = getRandom;

/**
 * 转换对象为JS Date对象
 * @param  {Mix}    date   <可选> 日期数据(时间戳, 字符串, Date对象, 空)
 * @param  {Number} offset 修正偏移的秒数
 * @return {Date}          返回JS Date对象 / NULL 日期格式错误
 */
var date_regx = /[^\d]+/;
function toDate(date, offset){
    var ts;
    if (date instanceof Date){
        ts = date;
    }else if (isNaN(+date)){
        if (isString(date)){
            date = date.split(date_regx);
            if (date.length === 3){
                ts = new Date(+date[0], date[1]-1, +date[2], 0, 0, 0, 0);
                if (isNaN(+ts)){
                    ts = null;
                }
            }
        }else {
            return null;
        }
    }
    if (!ts){
        if (!date){ return null; }
        ts = new Date();
        if (date > 5e8){
            // 时间戳
            ts.setTime(date * 1000);
        }else{
            // 时间偏移(秒数)
            ts.setTime(ts.getTime() + date * 1000);
        }
    }
    if (!isNaN(+offset)){
        ts.setTime(ts.getTime() + offset * 1000);
    }
    return ts;
}
module.exports.toDate = toDate;

// 转换 YYYYMMDD 的日期格式转换为标准的日期格式
module.exports.dateNumberToDate = function(date, spliter){
    date = "" +date;
    return [date.substr(0,4), date.substr(4,2), date.substr(6,2)].join(spliter || '-');
}

/**
 * 格式化数字, 自动补0前续
 * @param  {Number} number 要格式化的数字
 * @param  {Number} size   格式化后出来的数字位数
 * @return {String}        格式化结果
 */
function fix0(number, size){
    number = number.toString();
    while (number.length < size){
        number = "0" + number;
    }
    return number;
}
module.exports.fix0 = fix0;
/**
 * 保留指定位数的小数点
 * 因有浏览器兼容问题，所以不能直接采用原生的办法
 * @param  {Number} num     要转化的数字
 * @param  {Int}    howmuch 要保留的位数
 * @return {Number}         处理完的数字
 */
function toFixed(num,howmuch){
    howmuch = +howmuch;
    if (isNaN(howmuch)){ return num; }
    howmuch = Math.pow(10,howmuch);
    return Math.round(num*howmuch)/howmuch;
}
module.exports.toFixed = toFixed;

module.exports.round0 = function(val, num, return_arr){
    val = +val;
    if (num <= 0){ return Math.round(+val || 0); }
    val = isNaN(val)? 0 : toFixed(val, num);
    var arr = val.toString().split(".");
    if (!arr[1]){ arr[1] = "0"; }
    if (arr[1].length > num){
        arr[1] = arr[1].substr(0, num);
    }else {
        while (arr[1].length < num){
            arr[1] += "0";
        }
    }
    return (return_arr ? arr : arr.join("."));
}
module.exports.numberFormat = function(val, separator, size){
    if (!isNumber(val)){ return "0"; }
    if (!separator){ separator = ","; }
    if (!size){ size = 3; }
    var last = size;

    val = val.toString();
    var pos = val.indexOf(".");
    var res = "";
    if (pos === -1){
        pos = val.length;
    }else {
        res = val.substr(pos);
    }
    if (val.charAt(0) === "-"){
        last++;
    }
    while (pos > last){
        pos -= size;
        res = separator + val.substr(pos, size) + res;
    }
    if (pos){
        res = val.substr(0, pos) + res;
    }
    return res;
}


var timestamp = null;
var format_exp = /[YymndjNwaAghGHisT]/g;
function format_callback(tag){
    var t = timestamp;
    switch (tag){
        case "Y": return t.getFullYear();
        case "y": return t.getFullYear() % 100;
        case "m": return fix0(t.getMonth()+1, 2);
        case "n": return t.getMonth()+1;
        case "d": return fix0(t.getDate(), 2);
        case "j": return t.getDate();
        case "N": return t.getDay();
        case "w": return t.getDay() % 7;
        case "a": return t.getHours() < 12 ? "am":"pm";
        case "A": return t.getHours() < 12 ? "AM":"PM";
        case "g": return t.getHours() % 12 + 1;
        case "h": return fix0(t.getHours() % 12 + 1, 2);
        case "G": return t.getHours();
        case "H": return fix0(t.getHours(), 2);
        case "i": return fix0(t.getMinutes(), 2);
        case "s": return fix0(t.getSeconds(), 2);
        case "T": return Math.round(t.getTime()/1000);
    }
    return tag;
}
module.exports.date = function(format, date, offset){
    if (!format) {return "";}
    timestamp = toDate(date, offset);
    if (timestamp === null){ timestamp = new Date(); }
    return format.replace(format_exp, format_callback);
}

module.exports.time = function(){
    return Math.round((new Date()).getTime() / 1000);
}

/**
 * 带花括号标签检测正则
 * @type {RegExp}
 */
var labelReplaceExp = /\{(\w+)\}/g;
/**
 * 批量替换字符串中带花括号标签为指定数据
 * @param  {String} tpl  待处理的字符串
 * @param  {Object} data 替换数据
 * @return {String}      替换后端字符串
 */
function labelReplace (tpl, data) {
    return tpl.replace(labelReplaceExp, function (label, key) {
        return isObject(data) ? data[key] : data;
    });
}
module.exports.labelReplace = labelReplace;

/**
 * 获取超过两行的最后一行加省略号的字符串
 * @param str
 * @param maxlength
 * @param unit
 * @returns {*}
 */
module.exports.getLimitedText=function(str,maxlength,unit){
    var reg=/(\/[0-9\u4e00-\u9faf]{2})|<([^>\s]+)([^>]*)>|\s/g;
    var str1=str.replace(reg,"");
    //汉字及汉字标点正则
    var reg1 = /[0-9\u4e00-\u9faf|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
    var len= 0,cur= 0;
    for(var i=0;i<str1.length;i++){
        if(len<maxlength){
            var tmp=str1.substr(i,1);
            //汉字
            if(reg1.test(tmp)){
                len+=unit;
            }else{
                len+=1;
            }
            cur=i;
        }
    }

    if(len>=maxlength){
        str1=str1.substr(0,cur+1)+"...";
    }

    return str1;
}

function resetDateTime(date, data) {
    if (date && data) {
        var fnName;
        angular.forEach(data, function(val, key) {
            switch (key) {
                case "y":
                    fnName = "setYear";
                break;

                case "m":
                    fnName = "setMonth";
                break;

                case "d":
                    fnName = "setDate";
                break;

                case "H":
                    fnName = "setHours";
                break;

                case "i":
                    fnName = "setMinutes";
                break;

                case "s":
                    fnName = "setSeconds";
                break;

                case "M":
                    fnName = "setMilliseconds";
                break;
            }
            if (fnName) {
                date[fnName](val);
            }
        });
    }
    return date;
}
module.exports.resetDateTime = resetDateTime;
