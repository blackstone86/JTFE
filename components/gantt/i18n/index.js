/*
 Copyright (c) 2012-2017 Open Lab
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// 语言包
var langs = {
    // 英文
    "en": {
        date: require("./en/date")
        ,i18n: require("./en/i18n")
        ,msg: require("./en/msg")
    }
    // 简体中文
    ,"zh-CN": {
        date: require("./zh-CN/date")
        ,i18n: require("./zh-CN/i18n")
        ,msg: require("./zh-CN/msg")
    }
}

/**
 * 设置语言
 * @param {String} language 语言 可选值 "en" 英文；"zh-CN" 简体中文
 */
function seti18n(language){
    // 语言总包
    var lang = langs[language];
    // 日期语言包
    var _date = lang.date;
    var _monthNames = _date.monthNames;
    var _monthAbbreviations = _date.monthAbbreviations;
    var _dayNames = _date.dayNames;
    var _dayAbbreviations = _date.dayAbbreviations;
    var _timeDiff = _date.timeDiff;
    var _today = _date.today;
    // 文案语言包
    var _i18n = lang.i18n;
    // ganttMaster.messages 文案语言包
    var _msg = lang.msg;

    function dateToRelative(localTime){
        var diff=new Date().getTime()-localTime;
        var ret="";

        var min=60000;
        var hour=3600000;
        var day=86400000;
        var wee=604800000;
        var mon=2629800000;
        var yea=31557600000;

        if (diff<-yea*2)
            ret = _timeDiff["in ## years"].replace("##",(-diff/yea).toFixed(0));

        else if (diff<-mon*9)
            ret = _timeDiff["in ## months"].replace("##",(-diff/mon).toFixed(0));

        else if (diff<-wee*5)
            ret = _timeDiff["in ## weeks"].replace("##",(-diff/wee).toFixed(0));

        else if (diff<-day*2)
            ret = _timeDiff["in ## days"].replace("##",(-diff/day).toFixed(0));

        else if (diff<-hour)
            ret = _timeDiff["in ## hours"].replace("##",(-diff/hour).toFixed(0));

        else if (diff<-min*35)
            ret = _timeDiff["in about one hour"];

        else if (diff<-min*25)
            ret = _timeDiff["in about half hour"];

        else if (diff<-min*10)
            ret = _timeDiff["in some minutes"];

        else if (diff<-min*2)
            ret = _timeDiff["in few minutes"];

        else if (diff<=min)
            ret = _timeDiff["just now"];

        else if (diff<=min*5)
            ret = _timeDiff["few minutes ago"];

        else if (diff<=min*15)
            ret = _timeDiff["some minutes ago"];

        else if (diff<=min*35)
            ret = _timeDiff["about half hour ago"];

        else if (diff<=min*75)
            ret = _timeDiff["about an hour ago"];

        else if (diff<=hour*5)
            ret = _timeDiff["few hours ago"];

        else if (diff<=hour*24)
            ret = _timeDiff["## hours ago"].replace("##",(diff/hour).toFixed(0));

        else if (diff<=day*7)
            ret = _timeDiff["## days ago"].replace("##",(diff/day).toFixed(0));

        else if (diff<=wee*5)
            ret = _timeDiff["## weeks ago"].replace("##",(diff/wee).toFixed(0));

        else if (diff<=mon*12)
            ret = _timeDiff["## months ago"].replace("##",(diff/mon).toFixed(0));

        else
            ret = _timeDiff["## years ago"].replace("##",(diff/yea).toFixed(0));

        return ret;
    }
    window.dateToRelative = dateToRelative;

    //override date format i18n

    Date.monthNames = _monthNames;
    // Month abbreviations. Change this for local month names
    Date.monthAbbreviations = _monthAbbreviations;
    // Full day names. Change this for local month names
    Date.dayNames = _dayNames;
    // Day abbreviations. Change this for local month names
    Date.dayAbbreviations = _dayAbbreviations;
    // Used for parsing ambiguous dates like 1/2/2000 - default to preferring 'American' format meaning Jan 2.
    // Set to false to prefer 'European' format meaning Feb 1
    Date.preferAmericanFormat = false;

    Date.firstDayOfWeek = 0;
    Date.defaultFormat = "M/d/yyyy";
    Date.masks = {
        fullDate:       "EEEE, MMMM d, yyyy",
        shortTime:      "h:mm a"
    };
    Date.today = _today;

    Number.decimalSeparator = ".";
    Number.groupingSeparator = ",";
    Number.minusSign = "-";
    Number.currencyFormat = "###,##0.00";

    window.millisInWorkingDay = 28800000;
    window.workingDaysPerWeek = 5;

    function isHoliday(date) {
        var friIsHoly =false;
        var satIsHoly =true;
        var sunIsHoly =true;

        var pad = function (val) {
            val = "0" + val;
            return val.substr(val.length - 2);
        };

        var holidays = "##";

        var ymd = "#" + date.getFullYear() + "_" + pad(date.getMonth() + 1) + "_" + pad(date.getDate()) + "#";
        var md = "#" + pad(date.getMonth() + 1) + "_" + pad(date.getDate()) + "#";
        var day = date.getDay();

        return  (day == 5 && friIsHoly) || (day == 6 && satIsHoly) || (day == 0 && sunIsHoly) || holidays.indexOf(ymd) > -1 || holidays.indexOf(md) > -1;
    }

    window.isHoliday = isHoliday;
    
    window.i18n = _i18n;

    GanttMaster.messages = _msg;
}

module.exports = seti18n;