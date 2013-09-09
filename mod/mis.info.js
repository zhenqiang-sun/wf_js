//定义info操作类
var _info = {
    box: {},
    info: '',
    data: '',
    label: ''
};

//info操作类的初始化函数
_info.init = function() {
    var arr;

    _i_.mod = _wf.app.mod;
    _i_.act = _wf.url.get('act');
    _i_.xid = _wf.url.get('xid');
    _i_.name = _wf.app.name;
    _i_.admin = _wf.url.get('admin');
    _i_.list_xid = _wf.url.get('list_xid');
    _i_.user_id = _wf.url.get('user_id');

    if (_i_.user_id == 'self') {
        _i_.user_id = _wf.local.get('user_id');
    }

    //如果为add操作，赋值xid为-1。
    if ('add' == _i_.act) {
        _i_.xid = -1;
    //如果不为add操作，且xid不存在，则操作错误，关闭。
    } else if ('' == _i_.xid) {
        alert('对不起，信息不存在，正在关闭！');
        _wf.url.close();
    }

    //处理url，生成info的url
    arr = [];
    for (i in _wf.url.arr) {
        switch (i) {
            case 'act':
            case 'xid':
                break;
            default :
                arr.push(i + '=' + _wf.url.arr[i]);
                break;
        }
    }
    _info.info_url = '?' + arr.join('&');

    //配置ck编辑器
    if (typeof CKEDITOR == 'object') {
        CKEDITOR.disableAutoInline = true;
    }

    //执行相应初始化
    _info.admin_init();
    _info.btn_init();

    if (typeof _info.init_plug == 'function') {
        _info.init_plug();
    }

    _info.get();
};

//管理权限初始化函数
_info.admin_init = function() {
    if (_i_.admin == 'admin') {
        $('#btn_del, #btn_edit, #btn_view, #btn_show').show();
    } else {
        $('#btn_del, #btn_edit, #btn_view, #btn_show').hide();
    }
};

//按钮事件初始化函数
_info.btn_init = function() {
    $('.info_val').each(function() {
        $(this).addClass(this.id);
    });

    $('.info_val.required').each(function() {
        tmp = this.id.substr(2);
        $('.info_key.k_' + tmp).addClass('required');
    });

    $('#btn_close').click(function() {
        _wf.url.close();
    });

    $('#btn_refresh').click(function() {
        _wf.url.refresh();
    });

    $('#btn_add').click(function() {
        _wf.url.open(_info.info_url + '&act=add', '新增信息');
    });

    $('#btn_del').click(function() {
        _info.del();
    });

    $('#btn_edit').click(function() {
        _info.edit();
    });

    $('#btn_view').click(function() {
        _info.view();
    });

    $('#btn_list').click(function() {
        _info.list_page_open();
    });

    $('#btn_save').click(function() {
        _info.save();
    });

    $('#btn_show').click(function() {
        _info.show_page_open();
    });

    $('#btn_cancel').click(function() {
        _info.cancel();
    });

    $('#btn_reset').click(function() {
        _info.info_set();
    });

    if (typeof _info.btn_plug == 'function') {
        _info.btn_plug();
    }
};

_info.show_page_open = function() {
    var i;
    var arr;

    //处理url，生成show的url
    if (!_info.show_url) {
        arr = [];
        for (i in _wf.url.arr) {
            switch (i) {
                case 'act':
                    break;
                case 'name':
                    arr.push(i + '=' + _wf.url.arr[i].replace(/info$/, 'show'));
                    break;
                default :
                    arr.push(i + '=' + _wf.url.arr[i]);
                    break;
            }
        }
        _info.show_url = '?' + arr.join('&');
    }

    _wf.url.open(_info.show_url, '展示信息');
};


_info.list_page_open = function() {
    var i;
    var arr;

    //处理url，生成list的url
    if (!_info.list_url) {
        arr = [];
        for (i in _wf.url.arr) {
            switch (i) {
                case 'act':
                case 'xid':
                    break;
                case 'list_xid':
                    arr.push('xid=' + _wf.url.arr[i]);
                    break;
                case 'name':
                    arr.push(i + '=' + _wf.url.arr[i].replace(/info$/, 'list'));
                    break;
                default :
                    arr.push(i + '=' + _wf.url.arr[i]);
                    break;
            }
        }
        _info.list_url = '?' + arr.join('&');
    }

    _wf.url.open(_info.list_url, '信息列表');
};

_info.cancel = function() {
    if ('view' == _i_.act) {
        _info.view();
    } else if ('edit' == _i_.act || 'add' == _i_.act) {
        _wf.url.close();
    }
};
//从后台读取数据
_info.get = function() {
    _wf.ajax({
        'loading': '读取...',
        'data': {
            'mod': _i_.mod,
            'act': _i_.name + '_read',
            'xid': _i_.xid,
            'list_xid': _i_.list_xid,
            'user_id': _i_.user_id
        },
        'func': function(data) {
            _info.data = data;
            
            switch (_i_.act) {
                case 'add':
                    _info.add();
                    break;
                case 'del':
                    _info.del();
                    break;
                case 'edit':
                    _info.edit();
                    break;
                case 'view':
                    _info.view();
                    break;
            }
        }
    });
};

//给页面对象赋值
_info.set = function() {
    if (_i_.act != 'add' && !_info.data['xid']) {
        alert('对不起，信息已不存在！');
        _wf.url.close();
    }
    
    _i_.xid = _info.data['xid'];

    if (_info.data['label']) {
        _info.label = _info.data['label'];
        _wf.val('#box_label', _info.label);
        _wf.url.title('', _info.label);
    }

    if (typeof _info.set_plug == 'function') {
        if (_info.set_plug() == false) {
            return;
        }
    }

    if (_info.data['info']) {
        _info.info = _info.data['info'];
        _info.info_set();

        if (_info.data['info']['user_id'] && _info.data['info']['user_id'] == _wf.url.get('user_id')) {
            $('#btn_del, #btn_edit, #btn_view, #btn_show').show();
        }
    }

    if (_info.data['file']) {
        _info.file['arr'] = _info.data['file'];
        _info.file.set();
    }
};

//给页面对象赋值
_info.info_set = function() {
    var key, val, tmp;

    if (_i_.act == 'add') {
        _wf.url.refresh();
    } else {
        $('.info_val').each(function() {
            key = this.id.substr(2);

            if (_info.info[key]) {
                val = _info.info[key];
                tmp = $(this).attr('class');

                if (/editor/.test(tmp)) {
                    val = _wf.decode(val);                    
                    tmp = new RegExp('="\/doc\/20', "g");
                    val = val.replace(tmp, '="' + _wf.app.doc + '/20');
                }

                _wf.val(this, val);
            }
        });
    }
};

_info.state_name = 'viwe';
_info.state_label = {
    'add': '新增',
    'del': '删除：',
    'edit': '修改：',
    'view': ''
};
//页面状态改变事件
_info.state = function(state) {
    if (state) {
        _info.state_name = state;
    }

    _wf.val('#box_state', _info.state_label[_info.state_name]);

    $('.tb_title').attr('class', 'tb_title tb_title_' + _info.state_name);

    _wf.url.title('', _info.state_label[_info.state_name] + _info.label);

    _info.file.state();

    if (typeof _info.state_plug == 'function') {
        _info.state_plug();
    }
};

//新增事件
_info.add = function() {
    _info.set();

    _wf.dom.disable('#btn_add, #btn_del, #btn_edit, #btn_view, #btn_show');

    _info.state('add');
    _info.editable(true);

    if (_i_.user_id) {
        _wf.val('#v_user_id', _i_.user_id);
    }

    _info.file.state();
};

//删除事件
_info.del = function() {
    _info.set();

    $('.add_hide').show();    
    _info.state('del');

    if (true != confirm('确定删除“' + _info.label + '”吗？')) {
        if ('del' == _i_.act) {
            _wf.url.close();
        } else {
            _info.view();
        }
    } else {
        _info.del_ajax();
    }
};

//修改事件
_info.edit = function() {
    _info.set();

    $('.add_hide').show();
    _wf.dom.disable('#btn_edit');
    _wf.dom.enable('#btn_view');

    _info.box.find('tfoot').show();
    _info.state('edit');
    _info.editable(true);

    _info.file.state();
};

//修改查看事件
_info.view = function() {
    _info.set();

    $('.add_hide').show();
    _wf.dom.enable('#btn_edit');
    _wf.dom.disable('#btn_view');

    _info.box.find('tfoot').hide();
    _info.state('view');
    _info.editable(false);

    _info.file.state();
};

//设置是否只读状态
_info.editable = function(state) {
    if (true == state) {
        //        $('.info_val:not(.readonly, select)').attr('contenteditable', 'true');
        $('div.info_val:not(.readonly)').attr('contenteditable', 'true');
        $('input.info_val:not(.readonly), textarea.info_val:not(.readonly)').removeAttr('readonly');
        $('select.info_val:not(.readonly)').removeAttr('disabled');
        $('.info_val.editor').each(function() {
            if (typeof CKEDITOR == 'object' && typeof CKEDITOR.instances[this.id] != 'object') {
                CKEDITOR.inline(this);
            }
        });
        $('.info_val:not(.readonly):first').focus();
    } else {
        $('div.info_val').removeAttr('contenteditable');
        $('input.info_val, textarea.info_val').attr('readonly', 'true');
        $('select.info_val').attr('disabled', 'true');
        $('.info_val.editor').each(function() {
            if (typeof CKEDITOR == 'object' && typeof CKEDITOR.instances[this.id] == 'object') {
                CKEDITOR.instances[this.id].destroy(this);
            }
        });
    }
    
    if (typeof _info.editable_plug == 'function') {
        _info.editable_plug(state);
    }
};

//保存后台交互事件
_info.del_ajax = function() {
    _wf.ajax({
        'loading': '删除...',
        'data': {
            'mod': _i_.mod,
            'act': _i_.name + '_del',
            'xid': _i_.xid
        },
        'func': function(data) {
            if (data == '1') {
                _wf.url.close();
            } else {
                alert('删除失败！');
                if ('del' == _i_.act) {
                    _wf.url.close();
                } else {
                    _info.view();
                }
            }
        }
    });
};

//保存事件
_info.save = function() {
    var tmp, key, val, required;

    required = true;
    $('.info_val.required').each(function() {
        val = _wf.val(this);
        if (!val) {
            key = this.id.substr(2);
            tmp = _wf.val('.info_key.k_' + key);
            tmp = tmp.replace(/[　：\s]/g, '');
            alert('“' + tmp + '”不能为空！');
            required = false;
            return false;
        }
    });

    if (false == required) {
        return;
    }

    if (false == confirm('确定保存？')) {
        return;
    }

    _info.arr = {};
    
    if (typeof _info.save_plug == 'function') {
        if (_info.save_plug() == false) {
            return;
        }
    }

    $('.info_val').each(function() {
        key = this.id.substr(2);
        val = _wf.val(this);
        tmp = $(this).attr('class');

        if (/editor/.test(tmp)) {
            tmp = new RegExp('="' + _wf.app.doc + '\/20', "g");
            val = val.replace(tmp, '="/doc/20');
            val = _wf.encode(val);
        }

        _info.arr[key] = val;
    });

    if ('edit' == _i_.act || 'view' == _i_.act) {
        for (key in _info.arr) {
            if (_info.arr[key] == _info.info[key]) {
                delete(_info.arr[key]);
            }
        }

        tmp = '对不起，请修改相应信息后再进行保存。';
    } else if ('add' == _i_.act) {
        for (key in _info.arr) {
            if (!_info.arr[key]) {
                delete(_info.arr[key]);
            }
        }

        tmp = '对不起，请输入相应信息后再进行保存。';
    }

    if ($.isEmptyObject(_info.arr)) {
        alert(tmp);
        _wf.loading.hide();
        return;
    }
    
    _info.save_ajax();
};

//保存后台交互事件
_info.save_ajax = function() {
    var tmp;

    if ('edit' == _i_.act || 'view' == _i_.act) {
        tmp = _i_.name + '_update';
    } else if ('add' == _i_.act) {
        tmp = _i_.name + '_creat';
    }

    _wf.ajax({
        'loading': '保存...',
        'data': {
            'mod': _i_.mod,
            'act': tmp,
            'xid': _i_.xid,
            'info': _info.arr
        },
        'func': function(data) {
            alert(1);
            if (data) {          
                _info.save_ok(data);
            } else {
                if (typeof _info.save_error_plug == 'function') {
                    if (_info.save_error_plug() == false) {
                        return;
                    }
                } else {
                    alert('保存失败！');
                }
            }
        }
    });
};

//保存成功后事件
_info.save_ok = function(data) {
    if (_i_.act == 'add') {
        _i_.xid = data
    }      
    
    _wf.loading.show('信息保存成功！');
    _info.info_url = _info.info_url + '&act=view&xid=' + _i_.xid;
    _wf.url.open(_info.info_url, '查看信息', 1);
};

//定义file操作类
_info.file = {
    i: '', //当前操作的文件的index值，用来获取更多的属性
    box: '',
    dom: '',
    xid: '',
    arr: '',
    info_box: '',
    upload: '',
    upload_box: '',
    upload_key: ''
};

//file操作类的初始化函数
_info.file.init = function() {
    _info.file.box = $('#box_file tbody');
    _info.file.dom = _info.file.box.find('tr:eq(0)').clone(true);
    _info.file.upload_box = $('.upload_box');
    _info.file.upload_box.hide();
    _info.file.upload_key = '#upload_file';

    if (_info.file.box == '' || _info.file.dom == '') {
        _wf.log('error: not _file.box or _file.dom.');
        return;
    }

    if (_info.file.upload_box && _info.file.upload_key) {
        if (!_info.file.upload) {
            _info.file.upload = {
                'key': _info.file.upload_key,
                //                'size_limit' : '20MB',
                'data': {
                    'xtb': _i_.mod,
                    'xid': _i_.xid,
                    'user_id': _wf.local.get('user_id'),
                    'site_id' : _wf.local.get('site_id')
                },
                'onSuccess': function(file, data_src, response) {
                    var data = _wf.decode(data_src);
                    if (data) {
                        _info.file.upload_set(data);
                    } else {
                        _wf.log(data_src);
                        alert('文件“' + file['name'] + '”上传失败，请重试。');
                    }
                }
            };
        }

        _wf.file.upload(_info.file.upload);
    }

    _info.file.box.html('');
    _info.file.info_box = $('#box_file_info');
    _info.file.info_box.dialog({
        'autoOpen': false,
        'show': 'blind',
        'hide': 'explode',
        'width': $('body').width() * 0.9,
        'minWidth': '600',
        'minHeight': '200',
        'resizable': false,
        'draggable': false,
        'modal': true,
        'position': ['center', 50],
        'beforeClose': function() {
            _info.file.info_box.find('.show').html('');
        }
    });

    _info.file.init_btn();
};

_info.file.init_btn = function() {
    _info.file.dom.find('.btn_file_down').click(function() {
        var i = $(this.parentNode.parentNode).index();
        _info.file.down(_info.file.arr[i]['id']);
    });

    _info.file.dom.find('.btn_file_del').click(function() {
        var i = $(this.parentNode.parentNode).index();
        _info.file.del(i);
    });

    _info.file.dom.find('.btn_file_view').click(function() {
        var i = $(this.parentNode.parentNode).index();
        _info.file.view(i);
    });

    _info.file.dom.find('.btn_file_insert_use').click(function() {
        var i = $(this.parentNode.parentNode).index();
        _info.file.insert_use(i);
    });

    _info.file.dom.find('.btn_file_insert_down').click(function() {
        var i = $(this.parentNode.parentNode).index();
        _info.file.insert_down(i);
    });

    _info.file.info_box.find('.btn_file_down').click(function() {
        var i = $(this.parentNode.parentNode).index();
        _info.file.down(_info.file.arr[i]['id']);
    });

    _info.file.info_box.find('.btn_file_del').click(function() {
        var i = $(this.parentNode.parentNode).attr('i');
        _info.file.del(i);
        _info.file.info_box.dialog('close');
    });
};

_info.file.set = function() {
    var i, arr;

    if (!_info.file.arr || $.isEmptyObject(_info.file.arr)) {
        return;
    }

    _info.file.box.html('');
    for (i in _info.file.arr) {
        arr = _info.file.arr[i];
        _info.file.dom_set(arr);
    }

    _info.file.state();
};

_info.file.dom_set = function(arr) {
    var i, tmp;

    if (typeof arr != 'object') {
        return;
    }

    _info.file.dom.attr('xid', arr['id']);
    _info.file.dom.find('.file_ico').css('background-image', 'url(./1/img/ico/' + arr['type'] + '.gif)');
    for (i in arr) {
        tmp = arr[i];
        if (i == 'size') {
            tmp = _wf.file.size(tmp);
        }
        _info.file.dom.find('.file_' + i).html(tmp);
    }

    _info.file.box.append(_info.file.dom.clone(true));
};

_info.file.state = function() {
    if (_info.file.upload_box) {
        switch (_info.state_name) {
            case 'add':
            case 'edit':
                _info.file.upload_box.show();
                break;
            default :
                _info.file.upload_box.hide();
                break;
        }
    }

    if (_info.file.arr) {
        switch (_info.state_name) {
            case 'add':
            case 'edit':
                _info.file.box.find('.btn_file_del, .btn_file_insert_down, .btn_file_insert_use').show();
                break;
            default :
                _info.file.box.find('.btn_file_del, .btn_file_insert_down, .btn_file_insert_use').hide();
                break;
        }
    }
};

_info.file.upload_set = function(arr) {
    if (!_info.file.arr) {
        _info.file.arr = [arr];
    } else {
        _info.file.arr.push(arr);
    }

    _info.file.dom_set(arr);
};

_info.file.down = function(xid) {
    if (!xid || isNaN(xid)) {
        return;
    }
    
    var arr = {};
    arr['arr'] = new Date().getTime();
    arr['url'] = document.URL;
    _wf.url.open(_wf.app.doc + '/?down=' + _wf.encode(arr) + '&xid=' + xid, '', 3);
};

_info.file.del = function(i) {
    _info.file.box.children(':eq(' + i + ')').remove();
    _info.file.del_ajax(_info.file.arr[i]['id']);
    _info.file.arr.splice(i, 1);
};

//保存后台交互事件
_info.file.del_ajax = function(xid) {
    _wf.ajax({
        'loading': '删除...',
        'data': {
            'mod': 'file',
            'act': 'del',
            'xid': xid,
        },
        'func': function(data) {
            if (data.arr <= 0) {
                alert('删除失败！');
            }
        }
    });
};

_info.file.view = function(i) {
    var htm = '';
    var src = '';
    var arr = _info.file.arr[i];
    _info.file.info_box.find('.info').attr({
        'i': i,
        'xid': arr['id']
    });
    _info.file.info_box.find('.file_ico').attr('src', './1/img/ico/' + arr['type'] + '.gif');
    _info.file.info_box.find('.file_label').html(arr['label']);
    _info.file.info_box.find('.file_type').html(arr['type']);
    _info.file.info_box.find('.file_size').html(_wf.file.size(arr['size']));
    _info.file.info_box.find('.file_hits').html(arr['hits']);

    _info.file.info_box.find('.show').html('');
    if (arr['logo']) {
        src = _wf.app.doc + arr['logo'];
        switch (arr['type']) {
            case 'gif' :
            case 'jpg' :
            case 'jpeg' :
            case 'png' :
            case 'bmp' :
                htm = '<img class="img" src="' + src + '">';
                break;
            case 'acc' :
            case 'mp3' :
            case 'm4a' :
                htm = '<div id="file_player"></div>';
                _info.file.info_box.find('.show').html(htm);
                htm = '';
                _wf.file.audio_player('#file_player', src);
                break;
            case 'ogg' :
                htm = '<audio id="file_player" src="' + src + '" controls></audio>';
                break;
            case 'mp4' :
            case 'mov' :
            case 'f4v' :
            case 'flv' :
            case '3gp' :
            case '3g2' :
                htm = '<div id="file_player"></div>';
                _info.file.info_box.find('.show').html(htm);
                htm = '';
                _wf.file.video_player('#file_player', src);
                break;
            case 'webm' :
            case 'ogv' :
                htm = '<video id="file_player" src="' + src + '" controls></video>';
                break;
            case 'swf' :
                htm = '<embed id="file_player" src="' + src + '" allowfullscreen="true" allowscriptaccess="always" allownetworking="all" wmode="transparent"></embed>';
                break;
            default :
                htm = '对不起，该文件格式暂不支持预览。';
                break;
        }
    } else {
        htm = '对不起，该文件格式暂不支持预览。';
    }

    _info.file.info_box.dialog('open');
    _info.file.info_box.find('.show').html(htm);
};

_info.file.insert_use = function(i) {
    var htm = '';
    var src = '';
    var arr = _info.file.arr[i];

    if (arr['logo']) {
        src = _wf.app.doc + arr['logo'];
        switch (arr['type']) {
            case 'gif' :
            case 'jpg' :
            case 'jpeg' :
            case 'png' :
            case 'bmp' :
                htm = '<p class="doc_img"><img class="doc_img" src="' + src + '" alt="' + arr['label'] + '"></p>';
                break;
            case 'swf' :
                htm = '<embed id="file_player" src="' + src + '" allowfullscreen="true" allowscriptaccess="always" allownetworking="all" wmode="transparent"></embed>';
                break;
            default :
                alert('对不起，该文件格式不支持插入使用。');
                break;
        }
        
        if (htm) {            
            $('.info_file_insert').append(htm);
        }
    } else {
        alert('对不起，该文件格式不支持插入使用。');
    }
};

_info.file.insert_down = function(i) {
    var htm = '';
    var arr = _info.file.arr[i];
    htm = '<p class="doc_down"><span class="doc_down">附件下载：</span><a class="doc_down ' + arr['type'] + '" href="javascript:void(0);" onclick="down(this)" data-xid="' + arr['id'] + '">' + arr['label'] + '</a></p>';
    $('.info_file_insert').append(htm);
};

_info.exist = function(dom) {
    var tmp;
    tmp = _wf.val(dom);

    if (!tmp) {
        return;
    }

    _wf.ajax({
        'data': {
            'mod': _i_.mod,
            'act': _i_.name + '_exist',
            'xid': _i_.xid,
            'name': dom.id.substr(2),
            'info': tmp
        },
        'func': function(data) {
            _info.exist_func(data.arr);
        }
    });
};

_info.exist_func = function(arr) {
    var tmp;

    if (arr['type'] != 0) {
        tmp = $('.k_' + arr['name']).html();
        tmp = tmp.replace(/[　：\s]/g, '');
        tmp = '对不起，“' + arr['info'] + '”已经存在！';
        alert(tmp);
        $('#v_' + arr['name']).val('').focus();
    }
};

function down(dom) {    
    var xid = $(dom).attr('data-xid'); 
    _info.file.down(xid);
};