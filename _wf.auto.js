//定义子类：MD5加密
_wf.md5 = function(str) {
    var str_md5;

    if (typeof str != 'string') {
        _wf.log('error:md5, str is not a string.');
        str_md5 = '';
    }

    str_md5 = hex_md5(str);

    if (typeof str_md5 != 'string') {
        _wf.log('error:md5, result is not a string.');
        str_md5 = '';
    }

    return str_md5;
};

//取值、赋值方法，当key和val同时存在则赋值，否则取值
_wf.val = function(key, val) {
    if (!val && val != '') {
        //val不存在时取值
        return _wf.dom.get(key);
    } else {
        //val存在时赋值
        return _wf.dom.set(key, val);
    }
};

//DOM对象操作类
_wf.dom = {
    //取值
    get: function(key) {
        var obj = $(key);
        var tmp = '';

        //判断是否存在，不存在则退出
        if (!obj[0]) {
            return '';
        }

        if (/text|number|select-one|hidden|button|password/.test(obj[0].type)) {
            return obj.val();
        } else if ('radio' == obj[0].type) {
            obj.each(function() {
                if ($(this).prop('checked')) {
                    tmp = $(this).val();
                    return tmp;
                }
            });

            return tmp;
        } else if ('checkbox' == obj[0].type) {
            if (obj.prop('checked')) {
                tmp = obj.val();
            }

            return tmp;
        } else if ('textarea' == obj[0].type) {
            if (obj.ckeditor) {
                return obj.html();
            } else {
                return obj.val();
            }
        } else if (obj['0'] == '[object HTMLImageElement]') {
            return obj.attr('src');
        } else {
            return obj.html();
        }
    },
    //赋值
    set: function(key, val) {
        var obj = $(key);

        //判断是否存在，不存在则退出
        if (!obj[0]) {
            return;
        }

        if (/text|number|select-one|hidden|button|password|textarea/.test(obj[0].type)) {
            obj.val(val);
        } else if ('radio' == obj[0].type) {
            obj.each(function() {
                if ($(this).val() == val) {
                    $(this).attr('checked', true);
                } else {
                    $(this).removeAttr('checked');
                }
            });
        } else if ('checkbox' == obj[0].type) {
            if (obj.val() == val) {
                obj.prop('checked', true);
            } else {
                obj.prop('checked', false);
            }
        } else if (obj['0'] == '[object HTMLImageElement]') {
            obj.attr('src', val);
        } else {
            obj.html(val);
        }
    },
    //禁用odm对象
    disable: function(key) {
        $(key).attr('disabled', true);
    },
    //启用odm对象
    enable: function(key) {
        $(key).removeAttr('disabled');
    },
    //显示odm对象
    show: function(key) {
        $(key).show();
    },
    //隐藏odm对象
    hide: function(key) {
        $(key).hide();
    }
};

//文件操作类
_wf.file = {
    upload: function(cfg) {
        if (typeof $.fn.uploadify != 'function') {
            _wf.log('error: not import uploadify lib');
        }

        _wf.css.get(_wf.cfg.url + '/lib/uploadify/uploadify.css');

        cfg.data = _wf.encode({
            'mod': 'file',
            'act': 'upload',
            'xid': _i_.xid,
            'arr': cfg.data
        });

        $(cfg.key).uploadify({
            'swf': _wf.cfg.url + '/lib/uploadify/uploadify.swf',
            'uploader': _wf.app.doc_upload,
            'formData': {
                '_data': cfg.data
            },
            'buttonText': cfg.btn_label ? cfg.btn_label : '添加附件',
            'width': cfg.width,
            'height': cfg.height,
            'auto': cfg.auto,
            'multi': cfg.multi,
            'fileSizeLimit': cfg.size_limit,
            'fileTypeExts': cfg.type_ext,
            'fileTypeDesc': cfg.type_label,
            'removeCompleted': cfg.remove,
            'onSelect': cfg.onSelect,
            'onUploadComplete': cfg.onComplete,
            'onUploadSuccess': cfg.onSuccess,
            'onUploadError': cfg.onError
        });
    },
    size: function(tmp) {
        var lgth = String(tmp).length;
        if (9 < lgth) {
            tmp = Math.ceil(tmp / 1024 / 1024 / 1024) + 'GB';
        } else if (6 < lgth) {
            tmp = Math.ceil(tmp / 1024 / 1024) + 'MB';
        } else {
            tmp = Math.ceil(tmp / 1024) + 'KB';
        }
        return tmp;
    },
    audio_player: function(key, src) {
        var htm;
        htm = '<embed type="application/x-shockwave-flash" src="' + _wf.cfg.url + '/lib/jwplayer/jwplayer.swf" flashvars="file=' + src + '" width="470" height="20"></embed>';
        $(key).html(htm);
    },
    video_player: function(key, src) {
        var htm;
        htm = '<embed type="application/x-shockwave-flash" src="' + _wf.cfg.url + '/lib/jwplayer/jwplayer.swf" flashvars="file=' + src + '" width="470" height="320" wmode="opaque" allowscriptaccess="always" allowfullscreen="true" quality="high" bgcolor="#000000"></embed>';
        $(key).html(htm);
    }
};

//cookie操作类
_wf.cookie = {
    //cookie赋值
    //@param: key，键名
    //@param: val，键值
    //@param: day，有效天数
    //@param: path，作用路径
    set: function(key, val, day, path) {
        var str, obj;

        if (!key) {
            return;
        }

        str = key + '=' + escape(val);

        if (day && !isNaN(day)) {
            obj = new Date();
            obj.setTime(obj.getTime() + day * 24 * 60 * 60 * 1000);
            str += ';expires=' + obj.toGMTString();
        }

        if (path) {
            str += ';path=' + path;
        }

        document.cookie = str;
    },
    //cookie取值
    //@param: key，键名  
    get: function(key) {
        var str;

        if (!key) {
            return '';
        }

        str = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));

        if (str) {
            str = unescape(str[2]);
            if (str == 'undefined') {
                str = '';
            }
            return str;
        } else {
            return '';
        }
    },
    //cookie删除    
    //@param: key，键名
    //@param: path，作用路径
    del: function(key, path) {
        this.set(key, '', '-1', path);
    }
};

_wf.ajax = function(cfg) {
    if (typeof cfg != 'object') {
        _wf.log('error:ajax, ajax param is error.');
        return;
    }

    if (!cfg.type) {
        cfg.type = _wf.ajax.type;
    }

    if (cfg.type == 'static') {
        cfg.url = _wf.app.url + '/data/' + cfg.data['mod'] + '.' + cfg.data['act'] + '.' + cfg.data['xid'] + '.json';
    }

    if (!cfg.url) {
        cfg.url = _wf.ajax.url;
    }

    if (!cfg.url || typeof cfg.url != 'string') {
        _wf.log('error:ajax, ajax url is error.');
        return;
    }

    if (!cfg.encode) {
        cfg.encode = _wf.ajax.encode;
    }

    if (_wf.ajax.dev) {
        _wf.log('ajax_input=' + _wf.json.encode(cfg.data, null, '    '));
    }

    //判断url，如'/int/?'则转化
    if (cfg.data && cfg.encode == '_wf') {
        cfg.data = '_data=' + _wf.encode(cfg.data);
    }

    if (typeof cfg.data != 'string') {
        cfg.data = '';
    }

    if (typeof cfg.loading == 'string') {
        _wf.loading.show(cfg.loading);
    }

    switch (cfg.type) {
        case 'host':
            cfg.type = 'post';
            _wf.ajax.xmlhttp(cfg);
            break;
        case 'domain':
            _wf.ajax.script(cfg);
            break;
        case 'static':
        default:
            _wf.ajax.xmlhttp(cfg);
            break;
    }
};

_wf.ajax.dev = '';
_wf.ajax.url = '';
_wf.ajax.type = '';
_wf.ajax.data = {};
_wf.ajax.local = '';
_wf.ajax.encode = '';

// create xhr
_wf.ajax.init = function() {
    _wf.ajax.dev = _cfg.ajax_dev;
    _wf.ajax.url = _cfg.ajax_url;
    _wf.ajax.type = _cfg.ajax_type;
    _wf.ajax.encode = _cfg.ajax_encode;

    if (0 == _wf.ajax.url.indexOf('/')) {
        _wf.ajax.url = _wf.app.host + _wf.ajax.url;
    } else if (0 == _wf.ajax.url.indexOf('./')) {
        _wf.ajax.url = _wf.app.url + _wf.ajax.url.substring(1);
    }

    if (_cfg.ajax_local) {
        _wf.js.load_lib('md5');
        _wf.ajax.local = _cfg.ajax_local;
    }
};
// create xhr
_wf.ajax.xhr_standard = function() {
    try {
        return new window.XMLHttpRequest();
    } catch (e) {
    }
};

_wf.ajax.xhr_active = function() {
    try {
        return new window.ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {
    }
};

//定义方法：加载单个js文件，func为加载成功后需执行的函数
_wf.ajax.xmlhttp = function(cfg) {
    var xhr;

    cfg.data_send = null;
    if (cfg.type == 'post') {
        cfg.data_send = cfg.data;
    } else {
        cfg.type = 'get';
        cfg.url += cfg.data;
    }

    xhr = _wf.ajax.xhr_standard() || _wf.ajax.xhr_active();

    xhr.open(cfg.type, cfg.url, true);

    xhr.setRequestHeader('Accept', 'text/plain');
    xhr.setRequestHeader('If-Modified-Since', '0');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                _wf.ajax.success(cfg, xhr.responseText);
            } else {
                _wf.ajax.error(cfg);
            }
        }
    };

    xhr.send(cfg.data_send);
};

//定义方法：加载单个js文件，func为加载成功后需执行的函数
_wf.ajax.script = function(cfg) {
    var script;

    cfg.key = 'k' + new Date().getTime() + Math.floor(Math.random() * 1000);
    cfg.url += 'key=' + cfg.key + '&' + cfg.data;

    if (typeof _data != 'object') {
        _data = {};
    }

    //创建html的script实体为obj
    script = document.createElement('script');
    script.src = cfg.url;

    //判断func是否存在，如存在则等js加载完毕执行func。
    script.onreadystatechange = function() {
        if (_wf.js.type == 'onload') {
            _wf.js.type = 'onreadystatechange';
        }

        if (this.readyState == 'loaded' || this.readyState == 'complete') {
            script.func();
        }
    };


    script.onload = function() {
        if (_wf.js.type == 'onload') {
            script.func();
        }
    };

    script.func = function() {
        if (typeof _data == 'object' && _data[cfg.key]) {
            script.data = _data[cfg.key];
            delete _data[cfg.key];
        } else if (typeof _data == 'string') {
            script.data = _data;
        }

        _wf.ajax.success(cfg, script.data);
        _wf.head.removeChild(script);
    };

    script.onerror = function() {
        _wf.ajax.error(cfg);
        _wf.head.removeChild(script);
    };

    //附加到htm页面
    _wf.head.appendChild(script);
};

//定义方法：ajax执行成功的函数
_wf.ajax.success = function(cfg, obj) {
    if (typeof cfg.loading == 'string') {
        _wf.loading.hide();
    }

    if (typeof cfg.func == 'function') {
        if (_wf.ajax.local == true) {
            _wf.local.set(_wf.md5(cfg.data), obj);
        }

        if (obj) {
            if (cfg.encode == '_wf') {
                obj = _wf.decode(obj);
            } else if (cfg.encode == 'json') {
                obj = _wf.json.decode(obj);
            }
        }

        if (_wf.ajax.dev) {
            if (typeof obj == 'string') {
                _wf.log('ajax_output=' + obj);
            } else if (typeof obj == 'object') {
                _wf.log('ajax_output=' + _wf.json.encode(obj, null, '    '));
            }
        }

        cfg.func(obj, cfg);
    }
};

//定义方法：ajax执行失败的函数
_wf.ajax.error = function(cfg) {
    var obj;

    if (typeof cfg.loading == 'string') {
        _wf.loading.hide();
    }

    if (_wf.ajax.local == true) {
        obj = _wf.local.get(_wf.md5(cfg.data));
        if (obj) {
            _wf.ajax.success(cfg, obj);
        }
    }

    if (typeof cfg.func_error == 'function') {
        cfg.func_error(cfg);
    }
};


//定义子类：url操作的类
_wf.url = {
    //用local来传递参数
    local: '',
    url: '',
    //初始化
    init: function() {
        if (_wf.app.from == 'self' && parent._wf) {
            _wf.url.open = parent._wf.url.open;
        }

        //判断设备进行不同方式获取
//        if (navigator.userAgent.match(/phone|android|ipad|wp7/i)) {
//            _wf.url.local = true;
//            str = _wf.local.get(document.URL);
//            _wf.local.del(document.URL);
//        } else {
//            //获取url参数
//        }
        _wf.url.url = document.URL;
        _wf.url.arr = _wf.url.get_parms(_wf.url.url);
    },
    //获取url参数
    get_parms: function(url) {
        var arr;
        var tmp;
        var i;
        var parms = {};

        arr = url.split('?');

        if (arr[1]) {
            tmp = arr[1];
            tmp = tmp.replace(/&+/g, '&');
            tmp = tmp.replace(/^\s+|\s+$|&$/g, '');

            arr = tmp.split("&");
            arr.sort();

            for (i in arr) {
                tmp = arr[i].split("=");
                parms[tmp[0]] = decodeURIComponent(tmp[1]);
            }
        }

        return parms;
    },
    //parms存储池
    arr: {},
    get: function(key) {
        if (this.arr[key]) {
            return this.arr[key];
        } else {
            return '';
        }
    },
    set: function(key, val) {
        this.arr[key] = val;
    },
    go: function(url, title) {
        this.open(url, title, 1);
    },
    //打开url
    open: function(url, title, type) {
        var arr;

        if (_wf.app.type == 'htm') {
            arr = _wf.url.get_parms(url);
            if (arr['mod'] && arr['name']) {
                url = _wf.app.url + '/' + _wf.app.ui + '/' + arr['mod'] + '/' + arr['name'] + '.htm?' + url.substr(url.indexOf('?') + 1);
            }
        }

        if (_wf.url.local) {
            url = url.split('?', 2);
            if (url[1]) {
                _wf.local.set(url[0], url[1]);
            }
            url = url[0];
        }

        //0: _parent //用框架打开，默认
        //1: _self  //用当前页面打开
        //2: _must  //如果存在则刷新，不存在则打开
        //3: _blank  //用外部浏览器打开
        //4: _close  //如果存在则关闭
        //5: _refresh  //如果存在则刷新
        //6: _title  //修改title名称
        switch (type) {
            case 0:
                this.open_a(url, '_parent');
                break;
            case 2:
            case 3:
            default:
                this.open_a(url, '_blank');
                break;
            case 1:
                location.href = url;
                break;
            case 4:
                window.open('', '_parent', '');
                window.close();
                break;
            case 5:
                if (url == document.URL) {
                    location.reload();
                }
                break;
            case 6:
                if (url == document.URL) {
                    document.title = title;
                }
                break;
        }
    },
    //关闭页面
    close: function(url) {
        if (!url) {
            url = document.URL;
        }

        this.open(url, '', 4);
    },
    //刷新页面
    refresh: function(url, title) {
        if (!url) {
            url = document.URL;
        }

        this.open(url, title, 5);
    },
    //修改title信息
    title: function(url, title) {
        if (!url) {
            url = document.URL;
        }

        this.open(url, title, 6);
    },
    //模拟a标签点击打开
    open_a: function(url, target) {
        var obj, evt;

        evt = document.createEvent('MouseEvents');
        evt.initEvent('click', false, true);

        obj = document.createElement('a');
        obj.href = url;
        obj.target = target;
        obj.dispatchEvent(evt);
    }
};

//local操作类
_wf.local = {
    //赋值
    set: function(key, val) {
        if (typeof key != 'string' || typeof localStorage != 'object') {
            return;
        }

        localStorage.setItem(_wf.app.id + key, _wf.encode(val));
    },
    //取值
    get: function(key) {
        if (typeof key != 'string' || typeof localStorage != 'object') {
            return '';
        }

        return _wf.decode(localStorage.getItem(_wf.app.id + key));
    },
    //删除
    del: function(key) {
        if (typeof key != 'string' || typeof localStorage != 'object') {
            return;
        }

        localStorage.removeItem(_wf.app.id + key);
    },
    //清空
    clear: function() {
        if (typeof localStorage != 'object') {
            return;
        }

        localStorage.clear();
    }
};

_wf.set = function(key, val) {    
    if (typeof localStorage == 'object') {
        _wf.local.set(key, val);
    } else {
        _wf.cookie.set(key, val);
    }    
};

_wf.get = function(key) {    
    if (typeof localStorage == 'object') {
        return _wf.local.get(key);
    } else {
        return _wf.cookie.get(key);
    }
};

//定义子类：JSON编码和解码的类
_wf.json = {
    //将 JS对象 转换为 JSON字符串
    encode: function(obj, b, c) {
        var str;

        if (obj) {
            str = JSON.stringify(obj, b, c);
        }

        if (typeof str != 'string') {
            str = '';
        }

        return str;
    },
    //将 JSON字符串 转换为 JS对象
    decode: function(str) {
        var obj;

        if (!str || typeof str != 'string') {
            return '';
        }

        try {
            obj = JSON.parse(str);
        } catch (e) {
            _wf.log('error:json.decode');
            _wf.log(e, 'error');
            obj = str;
        }

        return obj;
    }
};

_wf.encode = function(data) {
    if (!data) {
        return '';
    }

    var a = {
        '%22': '0',
        '%2C': '1',
        '%3A': '2',
        '%5B': '3',
        '%5D': '4',
        '%7B': '5',
        '%7D': '6'
    };
    var b = _wf.str_shuffle('^`$<,>@:').split('');

//    data = _wf.json.encode(data);
//    data = encodeURIComponent(data);
//    data = data.replace(/\%22|\%2C|\%3A|\%5B|\%5D|\%7B|\%7D/g, function(c) {
//        return b[a[c]];
//    });
//    data = data.replace(/\%/g, b[7]);
//    data = data.split('').reverse().join('');
//    data = 'wf' + data + b.join('');
//    return data;

    try {
        return 'wf' + encodeURIComponent(_wf.json.encode(data)).replace(/\%22|\%2C|\%3A|\%5B|\%5D|\%7B|\%7D/g, function(c) {
            return b[a[c]];
        }).replace(/\%/g, b[7]).split('').reverse().join('') + b.join('');
    } catch (e) {
        _wf.log('error:_wf.encode', 'error');
        _wf.log(e, 'error');
    }
};

_wf.decode = function(data) {
    if (!data || typeof data != 'string' || data.indexOf('wf') != 0) {
        return '';
    }

    var i = '';
    var l = data.length;
    var a = ['%22', '%2C', '%3A', '%5B', '%5D', '%7B', '%7D'];
    var b = data.substring(l - 8).split('');

//    data = data.substring(2, l - 8);
//    data = data.split('').reverse().join('');
//    data = data.replace(new RegExp('\\' + b[7], "g"), '%');
//    data = data.replace(new RegExp('\\' + b.join('|\\'), "g"), function(c) {
//        for (i in b) {
//            if (b[i] == c) {
//                return a[i];
//            }
//        }
//    });
//    data = decodeURIComponent(data);
//    data = _wf.json.decode(data);
//    return data;

    try {
        return _wf.json.decode(decodeURIComponent(data.substring(2, l - 8).split('').reverse().join('').replace(new RegExp('\\' + b[7], "g"), '%').replace(new RegExp('\\' + b.join('|\\'), "g"), function(c) {
            for (i in b) {
                if (b[i] == c) {
                    return a[i];
                }
            }
        })));
    } catch (e) {
        _wf.log('error:_wf.decode', 'error');
        _wf.log(e, 'error');
    }
};

_wf.str_shuffle = function(str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: shuffled = str_shuffle("abcdef");
    // *     results 1: shuffled.length == 6
    if (arguments.length === 0) {
        throw 'Wrong parameter count for str_shuffle()';
    }

    if (str == null) {
        return '';
    }

    str += '';

    var newStr = '', rand, i = str.length;

    while (i) {
        rand = Math.floor(Math.random() * i);
        newStr += str.charAt(rand);
        str = str.substring(0, rand) + str.substr(rand + 1);
        i--;
    }

    return newStr;
};

_wf.id = function() {
    return Math.floor(Math.random() * 900000 + 100000) + '' + new Date().getTime();
}

//_g_对象初始化函数
_wf.auto = function() {
    //初始化_wf.url
    _wf.url.init();

    //初始化_wf.ajax
    _wf.ajax.init();

    //配置js自动执行脚本，整个项目
    if (typeof _wf.app.func == 'function') {
        _wf.app.func();
    }

    if (_wf.app.make == '1') {
        return;
    }

    //页面样式js自动执行脚本
    if (typeof _i_.load4master == 'function') {
        _i_.load4master();
    }

    //页面样式js自动执行脚本
    if (typeof _i_.load4ui == 'function') {
        _i_.load4ui();
    }

    if (typeof _i_.load == 'function') {
        _i_.load();
    }
    
    if (_wf.app.master == '1') {        
        return;
    }
    
    _wf.js.load(_wf.cfg.url + '/_wf.init.js');
};

_wf.func = function() {
    _cfg = null;
    _wf.loading.dom = $('#box_loading');
    _wf.loading.hide(700);
    if (typeof _i_.init4master == "function") {
        _i_.init4master();
    }
    if (typeof _i_.init4ui == "function") {
        _i_.init4ui();
    }
    if (typeof _i_.init == "function") {
        _i_.init();
    }
};

_wf.auto();