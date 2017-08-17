// 工具集
var util = require("../common");

function Storage(config) {
    this.config = Object.assign({
        // 能保存的数据最大数量
        cache_limit: 100,
        preFix: "METRO_CLOUD_PLATFORM",
        // 存储已缓存数据的key,
        cache_m_key: "CACHE_KEYS",
        // 默认缓存时间,
        def_cache_time: 1800000,
        // 最小缓存时间。小于这个时间的缓存设置都将被替换成该数值。,
        min_cache_time: 60000
    }, config);

    this.config.cache_m_key = "__" + this.config.preFix + "_" + this.config.cache_m_key;
    this.config.cache_m_key = this.config.cache_m_key.toUpperCase();

    var cache_map = {};
    var cache_keys = localStorage.getItem(this.config.cache_m_key);
    cache_keys = JSON.parse(cache_keys);
    cache_keys = cache_keys || [];

    cache_keys.forEach(function (item, index) {
        cache_map[item] = index;
    });

    this.data = {};
    this.cache_map = cache_map;
    this.cache_keys = cache_keys;
}
Storage.prototype = {
    /**
     * 获取存储的key
     * @param  {String} key 原始名称
     * @return {String}     格式化后的名称
     */
    getKey: function (key) {
        return "__" + this.config.preFix.toUpperCase() + "_" + key;
    },
    /**
     * 检测数据是否存在
     * @param  {String} key   数据键
     * @return {Mix}          对应的数据
     */
    check: function (key, justChk) {
        key = this.getKey(key);
        var tmp;
        tmp = this.data[key] || localStorage.getItem(key);
        if (!tmp) {
            return null;
        }
        if (util.isString(tmp)) {
            try {
                tmp = JSON.parse(tmp);
            } catch (e) {
                tmp = null;
            }
        }
        if (justChk) {
            return tmp;
        }
        if (Date.now() >= tmp.expire) {
            // 已过期
            localStorage.removeItem(key);
            tmp = this.cache_map[key];
            this.cache_map[key] = null;
            this.cache_keys.splice(tmp, 1);
            return null;
        }
        if (!this.data[key]) {
            this.data[key] = tmp;
        }
        return tmp;
    },
    /**
     * 获取数据
     * @param  {String} key 要获取数据的键
     * @return {Mix}        数据
     */
    get: function (key) {
        var tmp = this.check(key);
        if (tmp) {
            tmp = tmp.data;
        }
        return tmp;
    },
    /**
     * 存储一个数据
     * @param {String} key    数据键
     * @param {Mix}    value  数据值
     * @param {Int}    expire 过期时间<ms>
     */
    set: function (key, value, expire, will) {
        var tmp = this.check(key, will),
            conf = this.config;

        if (tmp && !will) {
            // console.log("Key [ %s ] already exists",key);
            return tmp;
        }

        // 处理过期时间，30min
        if (!expire) {
            expire = conf.def_cache_time;
        } else {
            expire = +expire;
            expire = isNaN(expire) ? conf.def_cache_time : expire < conf.min_cache_time ? conf.def_cache_time : expire;
        }
        expire = Date.now() + expire;
        key = this.getKey(key);
        // 生成数据结构
        var dat = {
            data: value,
            expire: expire
        };
        // 写入模块内存缓存
        this.data[key] = dat;

        // 写入ls并处理key
        localStorage.setItem(key, JSON.stringify(dat));
        this.cache_keys.push(key);
        this.cache_map[key] = this.cache_keys.length - 1;

        if (this.cache_keys.length > conf.cache_limit) {
            // 超出缓存限制
            tmp = this.cache_keys.shift();
            this.del(tmp);
        }

        localStorage.setItem(conf.cache_m_key, JSON.stringify(this.cache_keys));
        return dat;
    },
    /**
     * 删除数据
     * @param  {String} key 数据键
     * @return {Mix}        被删除的数据
     */
    del: function (key) {
        key = this.getKey(key);
        var tmp = this.data[key] || localStorage.getItem(key);
        this.cache_map[key] = null;
        this.data[key] = null;
        localStorage.removeItem(key);
        return tmp;
    },
    /**
     * 丢弃整个数据仓库
     * @return {Undefined} 无返回值
     */
    drop: function () {
        this.cache_keys.forEach(function(key){
            this.del(key);
        });
        this.data = null;
        this.cache_map = null;
        this.cache_keys = null;
    }
};

module.exports = new Storage();
