/**
 * 文件名称：_wf.js
 * 功能描述：WF_JS框架入口文件。
 * 代码作者：孙振强
 * 创建日期：2011-07-09
 * 修改日期：2013-01-04
 * 当前版本：4
 */

//定义：_i_，局部类，如果已被定义，则跳过
if (typeof _i_ != 'object') {
    var _i_ = {};
}

//定义: _wf, 框架类
//function _wf(str) {
//    return $(str);
//}

var _wf = {};

//定义：cfg，子类，框架基本信息
_wf.cfg = {
    //定义：框架版本
    ver: '5',
    //定义：开发模式，为true时有错误报告并可输出log，从_cfg中取值
    dev: '',
    //定义：框架访问路径，动态生成
    url: '',
    //定义：框架发布域名，用来判断是否加载jquery等cdn文件
    domain: 'wfjs_no',
    //定义：点击事件的处理方式，根据设备判断
    click: 'click',
    //定义：loading过门，从_cfg中取值
    loading: '',
    //定义方法：初始化_wf.cfg
    init: function() {
        var str, arr;

        //判断是否为开发者模式，仅在开发者模式报错显示错误报告
        if (_cfg.dev) {
            _wf.cfg.dev = _cfg.dev;
        } else {
            window.onerror = function() {
                return true;
            };
        }

        //动态获取wf库的访问路径
        arr = document.getElementsByTagName("script");
        str = arr[arr.length - 1]['src'];
        _wf.cfg.url = str.substring(0, str.lastIndexOf('/'));

        str = arr[arr.length - 2]['src'];
        str = str.substring(0, str.lastIndexOf('/'));
        _wf.app.url = str.substring(0, str.lastIndexOf('/'));

        _wf.cfg.loading = _cfg.loading;
        _wf.cfg.loading_diy = _cfg.loading_diy;

        //判断设备点击事件处理方式
        if (/phone|android|ipad|wp7/i.test(navigator.userAgent)) {
            _wf.cfg.click = 'touchend';
        }
    }
};


//定义子类：app，应用基本信息
_wf.app = {
    //定义：app的版本
    ver: '',
    //定义：app的标识
    id: '',
    //定义：app的名称
    label: '',
    //定义：app的访问路径
    url: '',
    //定义：app的附件URL
    doc: '',
    //定义：app的附件上传接口
    doc_upload: '',
    //定义：是否加载控制的独立js文件
    js: '',
    //定义：是否加载ui的独立js文件
    ui_js: '',
    //定义：是否加载ui的独立css文件
    ui_css: '',
    //定义：当前html的ui
    ui: '',
    //定义：当前html的mod
    mod: '',
    //定义：当前html的name
    name: '',
    //定义：访问来源，动态生成，判断是否外部访问，当为'self'时为内部访问。
    from: '',
    //定义：应用全局初始化函数，来自_cfg.func
    func: '',
    //定义：页面生成时间
    time: '',
    //定义方法：初始化_wf.app
    init: function() {
        _wf.app.host = _wf.app.url.substring(0, _wf.app.url.indexOf('/', 10));
        _wf.app.ver = _cfg.ver;
        _wf.app.id = _cfg.id;
        _wf.app.label = _cfg.label;
        _wf.app.doc = _cfg.doc;
        _wf.app.doc_upload = _cfg.doc_upload;
        _wf.app.js = _cfg.js;
        _wf.app.ui = _cfg.ui;
        _wf.app.mod = _cfg.mod;
        _wf.app.name = _cfg.name;
        _wf.app.time = _cfg.time;
        _wf.app.make = _cfg.make;
        _wf.app.master = _cfg.master;
        _wf.app.func = _cfg.init;
        _wf.app.ui_js = _cfg.ui_js;
        _wf.app.ui_css = _cfg.ui_css;
        _wf.app.type = 'act';

        if (!_wf.app.name) {
            _wf.app.type = 'htm';
            _wf.app.ui = document.URL.substring(_wf.app.url.length + 1);
            _wf.app.ui = _wf.app.ui.substring(0, _wf.app.ui.indexOf('/'));
            _wf.app.mod = document.URL.substring(_wf.app.url.length + _wf.app.ui.length + 2);
            _wf.app.mod = _wf.app.mod.substring(0, _wf.app.mod.indexOf('/'));
            _wf.app.name = document.URL.substring(document.URL.lastIndexOf('/') + 1, document.URL.lastIndexOf('.'));
        }

        //判断访问来源
        if (document.referrer) {
            if (document.referrer.indexOf(_wf.app.host) === 0) {
                _wf.app.from = 'self';
            } else {
                _wf.app.from = document.referrer;
            }
        }

        if (_wf.app.doc) {
            if (0 == _wf.app.doc.indexOf('/')) {
                _wf.app.doc = _wf.app.host + _wf.app.doc;
            } else if (0 == _wf.app.doc.indexOf('./')) {
                _wf.app.doc = _wf.app.url + _wf.app.doc.substring(1);
            }
        }        

        if (_wf.app.doc_upload) {
            if (0 == _wf.app.doc_upload.indexOf('/')) {
                _wf.app.doc_upload = _wf.app.host + _wf.app.doc_upload;
            } else if (0 == _wf.app.doc_upload.indexOf('./')) {
                _wf.app.doc_upload = _wf.app.url + _wf.app.doc_upload.substring(1);
            }
        }
    }
};

//定义：html的head区dom
_wf.head = document.head || document.getElementsByTagName('head')[0];

//定义子类：加载js的类
_wf.js = {
    //定义数组：已加载的js文件列表
    list: [],
    //定义变量：浏览器对js加载方式
    type: 'onload',
    //定义方法：动态加载单个js文件，func为加载成功后需执行的函数
    get: function(url, func) {
        var obj;

        //判断该js是否被加载，如被加载，则执行func，退出
        if (this.list[url]) {
            if (typeof func == 'function') {
                setTimeout(func, 500);
            }
            return;
        }

        //将该js文件定义为已加载
        this.list[url] = true;

        //创建html的script实体为obj
        obj = document.createElement('script');
        obj.src = url;

        //附加到htm页面
        _wf.head.appendChild(obj);

        //判断func是否存在，如存在则等js加载完毕执行func。
        if (typeof func == 'function') {
            obj.onreadystatechange = function() {
                if (_wf.js.type == 'onload') {
                    _wf.js.type = 'onreadystatechange';
                }

                if (this.readyState == 'loaded' || this.readyState == 'complete') {
                    func(obj);
                }

                _wf.head.removeChild(obj);
            };

            obj.onload = function() {
                if (_wf.js.type == 'onload') {
                    func(obj);
                }

                _wf.head.removeChild(obj);
            };
        }
    },
    //定义方法：初始加载一个或一组js文件
    load: function(url) {
        var i;
//        var j;
//        var arr;

        switch (typeof url) {
            case 'string':
                if (!this.list[url]) {
//                    arr = document.getElementsByTagName("script");
//                    for (j in arr) {
//                        if (arr[j]['src'] == url) {
//                            this.list[url] = true;                
//                            return;
//                        }
//                    }
                    //将该js文件定义为已加载
                    this.list[url] = true;
                    //附加到htm页面
                    document.write('<script src="' + url + '"><\/script>');
                }
                break;
            case 'array':
            case 'object':
                for (i in url) {
                    this.load(url[i]);
                }
                break;
        }
    },
    //定义方法：初始加载lib类
    load_lib: function(str) {
        this.load(_wf.cfg.url + '/lib/' + str + '/' + str + '.js');
    },
    //定义方法：初始加载mod类
    load_mod: function(str) {
        this.load(_wf.cfg.url + '/mod/' + str + '.js');
    }
};

//定义子类：加载css的类
_wf.css = {
    //定义数组：已加载的js文件列表
    list: [],
    //定义方法：动态加载单个css文件
    get: function(url) {
        var obj;

        //判断该css是否被加载，如被加载，则退出
        if (this.list[url]) {
            return;
        }

        this.list[url] = true;

        //创建html的link实体为obj
        obj = document.createElement('link');
        obj.rel = 'stylesheet';
        obj.href = url;

        //附加到htm页面
        _wf.head.appendChild(obj);

        //释放obj
        obj = null;
    },
    //定义方法：初始加载一个或一组css文件
    load: function(url) {
        var i;

        switch (typeof url) {
            case 'string':
                if (!this.list[url]) {
                    //将该js文件定义为已加载
                    this.list[url] = true;
                    document.write('<link rel="stylesheet" href="' + url + '">');
                }
                break;
            case 'array':
            case 'object':
                for (i in url) {
                    this.load(url[i]);
                }
                break;
        }
    },
    //定义方法：初始加载lib类样式
    load_lib: function(str) {
        this.load(_wf.cfg.url + '/lib/' + str + '/' + str + '.css');
    }
};


//定义方法：log，在console输出log信息
_wf.log = function(log, type) {
    if (_wf.cfg.dev == true && typeof console == 'object') {
        if (!type) {
            type = 'log';
        }
        
        console[type](log);
    }
};

//loading过门
_wf.loading = {
    //定义：loading的html代码
    box: '<div id="box_loading"><div class="bg"></div><div class="logo"></div><div class="info">Loading...</div></div>',
    //定义：loading显示状态
    state: '',
    //定义方法：初始化loading
    init: function() {
        if (!_wf.cfg.loading) {
            return;
        }

        //判断是否调用父级loading
        if (_wf.app.from == 'self' && _wf.cfg.loading === true && parent._wf && parent._wf.cfg.loading && parent._wf.cfg.loading != true) {
            //重新定义_wf.loading.show
            _wf.loading.show = parent._wf.loading.show;

            //重新定义_wf.loading.hide
            _wf.loading.hide = parent._wf.loading.hide;

            //显示loading
            _wf.loading.show();
        } else {
            //显示状态定义为show
            _wf.loading.state = 'show';

            //判断是否为自定义loading
            if (!_wf.cfg.loading_diy) {
                _wf.css.load(_wf.cfg.url + '/css/loading.css');
                document.write(_wf.loading.box);
            }
        }
    },
    //定义方法：显示loading
    show: function(info) {
        if (!_wf.cfg.loading || !_wf.loading.state) {
            return;
        }

        _wf.loading.state = 'show';

        if (!info) {
            info = 'Loading...';
        }

        _wf.loading.dom.find('.info').html(info);
        _wf.loading.show_act();
    },
    //定义方法：显示loading具体操作
    show_act: function() {
        if (!_wf.cfg.loading || !_wf.loading.state) {
            return;
        }

        _wf.loading.dom.show();
    },
    //定义方法：隐藏loading
    hide: function(time) {
        if (!_wf.cfg.loading || !_wf.loading.state) {
            return;
        }

        if ('0' == time) {
            _wf.loading.hide_act();
            return;
        }

        if (_wf.loading.state == 'hide' && time != 'abc') {
            return;
        }

        _wf.loading.state = 'hide';

        if (!time || isNaN(time)) {
            time = 400;
        }

        setTimeout(_wf.loading.hide_act, time);
    },
    //定义方法：隐藏loading具体操作
    hide_act: function() {
        if (!_wf.cfg.loading || !_wf.loading.state) {
            return;
        }

        if (_wf.loading.state == 'hide') {
            _wf.loading.hide_true();
        }
    },
    //定义方法：隐藏loading最终操作
    hide_true: function() {
        if (!_wf.cfg.loading || !_wf.loading.state) {
            return;
        }

        _wf.loading.dom.hide();
    }
};

//_g_对象初始化函数
_wf.init = function() {
    if (typeof _cfg != 'object') {
        alert('error: _cfg is error.');
        return;
    }

    //初始化_wf.cfg
    _wf.cfg.init();

    //初始化_wf.app
    _wf.app.init();    

    //加载：json。判断浏览器本身是否支持json，不支持则加载
    if (typeof window.JSON != 'object') {
        _wf.js.load_lib('json');
    }
    
    if (_wf.app.make == '1') {
        _wf.loading.init();
        return;
    }
    
    if (_wf.app.master == '1') {
        _wf.init_self();
        return;
    }

    //加载：判断加载框架css
    if (_cfg._wf_ui) {
        if (_cfg._wf_ui == true) {
            _wf.css.load(_wf.cfg.url + '/css/0.css');
        } else {
            _wf.css.load(_wf.cfg.url + '/css/' + _cfg._wf_ui + '.css');
        }
    }    
    
    _wf.init_self();

    //加载：jquery
    if (_cfg.lib_jquery != false) {
        if (_wf.cfg.url.indexOf(_wf.cfg.domain) > 0) {
            _wf.js.load('http://code.jquery.com/jquery-1.9.1.min.js');
        } else {
            _wf.js.load_lib('jquery');
        }
    }

    //加载：iscroll
    if (_cfg.lib_iscroll) {
        _wf.js.load_lib('iscroll');
    }

    //加载：jquery_ui
    if (_cfg.lib_jquery_ui) {
        if (_wf.cfg.url.indexOf(_wf.cfg.domain) > 0) {
            _wf.css.load('http://code.jquery.com/ui/1.10.2/themes/' + _cfg.lib_jquery_ui + '/jquery-ui.css');
            _wf.js.load('http://code.jquery.com/ui/1.10.2/jquery-ui.min.js');
        } else {
            _wf.css.load(_wf.cfg.url + '/lib/jquery-ui/' + _cfg.lib_jquery_ui + '/jquery-ui.css');
            _wf.js.load_lib('jquery-ui');
        }
    }

    //加载：jquery_mobile
    if (_cfg.lib_jquery_mobile) {
        if (_wf.cfg.url.indexOf(_wf.cfg.domain) > 0) {
            _wf.css.load('http://code.jquery.com/mobile/1.3.0/jquery.mobile-1.3.0.min.css');
            _wf.js.load('http://code.jquery.com/mobile/1.3.0/jquery.mobile-1.3.0.min.js');
        } else {
            _wf.css.load_lib('jquery.mobile');
            _wf.js.load_lib('jquery.mobile');
        }
    }

    //加载：框架组件
    _wf.js.load(_wf.cfg.url + '/_wf.auto.js');

    //loading效果初始化
    _wf.loading.init();
};

_wf.init_self = function() {
    //加载：ui独立css文件
    if (_wf.app.ui_css) {
        _wf.css.load(_wf.app.url + '/' + _wf.app.ui + '/' + _wf.app.mod + '/css/' + _wf.app.name + '.css');
    }
    
    //加载：ui独立js文件
    if (_wf.app.ui_js) {
        _wf.js.load(_wf.app.url + '/' + _wf.app.ui + '/' + _wf.app.mod + '/js/' + _wf.app.name + '.js');
    }

    //加载：控制独立js文件
    if (_wf.app.js) {
        _wf.js.load(_wf.app.url + '/js/' + _wf.app.mod + '/' + _wf.app.name + '.js');
    }
};

_wf.init();