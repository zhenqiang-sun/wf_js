//定义：配置对象，检查是否已定义
if (typeof _cfg != 'object') {
    var _cfg = {};
}


//配置：_wf框架url。
//_cfg._wf_url = 'http://wf.erlitech.com/v4/_wf.js';
_cfg._wf_url = '/_wf/_wf.js';

//配置：是否启用_wf全局ui。
//_cfg._wf_ui = true;

//配置：是否为开发模式
_cfg.dev = true;


//配置：是否启用loading，空值或不定义将不启用，启用为true
_cfg.loading = true;
//配置：是否自定义loading的样式
_cfg.loading_diy = true;


//配置：扩展框架，如：jquery，jquery_ui，jquery.mobile，sencha_touch
//配置：是否启用jquery
//_cfg.lib_jquery = false;
//配置：是否启用jquery_ui，不定义则不启用，启用可选：start，ui-darkness，ui-lightness。
//_cfg.lib_jquery_ui = 'start';
//配置：是否启用jquery_mobile
_cfg.lib_jquery_mobile = true;


//配置：ajax信息
//配置：ajax开发模式，如果为true，则log报文
//_cfg.ajax_dev = true;
//配置：ajax模式，可选：host, domain, staict, post, get
_cfg.ajax_type = 'host';
//配置：ajax数据加密
_cfg.ajax_encode = '_wf';
//配置：ajax离线模式
//_cfg.ajax_local = true;
//配置：ajax接口url
_cfg.ajax_url = './act/?';


//配置：app信息
//配置：app版本号
_cfg.ver = '5';
//配置：app标识
_cfg.id = 'my_app';
//配置：app名称
_cfg.label = 'My App';
//配置：app是否启用独立js控制文件
//_cfg.js = true;
//配置：app主题是否启用独立js文件
//_cfg.ui_js = true;
//配置：app主题是否启用独立css文件
//_cfg.ui_css = true;
//配置：app默认语言
_cfg.lang = 'cn';
//配置：app附件url
_cfg.doc = './doc/';
//配置：app附件上传接口
_cfg.doc_upload = './act/?';
//配置：app全局初始化函数
//_cfg.init = function() {}

document.write('<script src="'+ _cfg._wf_url +'"></'+'script>');
