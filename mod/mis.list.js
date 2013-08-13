//定义list操作类
var _list = {
    label: '',
    key: {},
    query: [],
    search: [],
    order: ''
};

//info操作类的初始化函数
_list.init = function() {
    var arr;
    var i;

    //获取url参数
    _i_.mod = _wf.app.mod;
    _i_.act = _wf.url.get('act');
    _i_.xid = _wf.url.get('xid');
    _i_.name = _wf.app.name;
    _i_.admin = _wf.url.get('admin');
    _i_.user_id = _wf.url.get('user_id');

    if (_i_.user_id == 'self') {
        _i_.user_id = _wf.local.get('user_id');
    }

    if (_i_.user_id) {
        _list.query[0] = {};
        _list.query[0]['name'] = 'user_id';
        _list.query[0]['type'] = 'in';
        _list.query[0]['info'] = ['', _i_.user_id];
    }

    //处理url，生成info的url
    arr = [];
    for (i in _wf.url.arr) {
        switch (i) {
            case 'act':
                break;
            case 'xid':
                arr.push('list_xid=' + _wf.url.arr[i]);
                break;
            case 'name':
                arr.push(i + '=' + _wf.url.arr[i].replace(/list$/, 'info'));
                break;
            default :
                arr.push(i + '=' + _wf.url.arr[i]);
                break;
        }
    }
    _list.info_url = '?' + arr.join('&');

    //执行相应初始化
    _list.admin_init();
    _list.btn_init();
    _list.page_init();

    //获取box和dom对象
    _list.box = $('#box_list tbody');
    _list.dom = _list.box.find('tr:eq(0)').clone(true);
    _list.box.html('');

    //执行初始化扩展
    if (typeof _list.init_plug == 'function') {
        if (_list.init_plug() == false) {
            return;
        }
    }

    //获取列表数据
    _list.get();
};

//管理权限初始化函数
_list.admin_init = function() {
    if (_i_.admin == 'admin') {
        $('#btn_type_admin, .btn_edit, .btn_del').show();
    } else {
        $('#btn_type_admin, .btn_edit, .btn_del').hide();
    }
};

//按钮事件初始化函数
_list.btn_init = function() {
    //关闭按钮
    $('#btn_close').click(function() {
        _wf.url.close();
    });

    //刷新按钮
    $('#btn_refresh').click(function() {
        _wf.url.refresh();
    });

    //新增按钮
    $('#btn_add').click(function() {
        _wf.url.open(_list.info_url + '&act=add', '新增信息');
    });

    //配置栏目按钮
    $('#btn_type_admin').click(function() {
        _list.type_page_open();
    });

    //搜索按钮
    $('#btn_search').click(function() {
        _list.search_get();
    });

    //搜索输入框
    $('#box_search .search_txt').keypress(function(event) {
        if (event.keyCode == 13 || event.which == 13) {
            _list.search_get();
        }
    });

    //内容查看按钮
    $('.btn_view').click(function() {
        var xid = $(this).parent().parent().attr('data-xid');
        _wf.url.open(_list.info_url + '&act=view&xid=' + xid, '查看信息');
    });

    //内容展示按钮
    $('.btn_show').click(function() {
        var xid = $(this).parent().parent().attr('data-xid');
        _list.show_page_open(xid);
    });

    //内容修改按钮
    $('.btn_edit').click(function() {
        var xid = $(this).parent().parent().attr('data-xid');
        _wf.url.open(_list.info_url + '&act=edit&xid=' + xid, '修改信息');
    });

    //内容删除按钮
    $('.btn_del').click(function() {
        var i = $(this).parent().parent().index();
        _list.del(i);
    });
        
    $('.btn_order_up').click(function(){
        var i = $(this).parent().parent().index();
        _list.order_up(i);
    });

    $('.btn_order_down').click(function(){
        var i = $(this).parent().parent().index();
        _list.order_down(i);
    });
};

//列表分页初始化函数
_list.page_init = function() {
    var tmp;

    _list.page_num = 0;
    _list.page_now = 0;
    _list.info_num = 0;
    _list.info_now = 0;
    _list.show_num = 10;

    tmp = _wf.local.get(_i_.mod + '_' + _i_.name + '_show_num');
    if (tmp && !isNaN(tmp)) {
        _list.show_num = tmp;
    }

    _list.page_box = $('.pagination_box');
    if (_list.page_box.length == 0) {
        _list.page_creat();
        _list.page_box = $('.pagination_box');
    }

    _list.page_box.find('.btn_page_first').click(function() {
        _list.page_now = 1;
        _list.get();
    });

    _list.page_box.find('.btn_page_last').click(function() {
        _list.page_now = _list.page_num;
        _list.get();
    });

    _list.page_box.find('.btn_page_prev').click(function() {
        _list.page_now--;
        _list.get();
    });

    _list.page_box.find('.btn_page_next').click(function() {
        _list.page_now++;
        _list.get();
    });

    _list.page_box.find('.show_num').change(function() {
        _list.show_num = $(this).val();
        _wf.local.set(_i_.mod + '_' + _i_.name + '_show_num', _list.show_num);
        _list.page_now = Math.ceil(_list.info_now / _list.show_num);
        _list.info_num = 0;
        _list.get();
    });

    _list.page_box.find('.show_num').val(_list.show_num);
};

_list.type_page_open = function() {
    var i;
    var arr;

    //处理url，生成type的url
    if (!_list.type_url) {
        arr = [];
        for (i in _wf.url.arr) {
            switch (i) {
                case 'act':
                    break;
                case 'mod':
                    arr.push(i + '=' + 'sys');
                    break;
                case 'name':
                    arr.push(i + '=' + 'type_list');
                    break;
                default :
                    arr.push(i + '=' + _wf.url.arr[i]);
                    break;
            }
        }
        _list.type_url = '?' + arr.join('&');
    }

    _wf.url.open(_list.type_url, '配置栏目');
};

_list.show_page_open = function(xid) {
    var i;
    var arr;

    //处理url，生成show的url
    if (!_list.show_url) {
        arr = [];
        for (i in _wf.url.arr) {
            switch (i) {
                case 'act':
                    break;
                case 'xid':
                    arr.push('list_xid=' + _wf.url.arr[i]);
                    break;
                case 'name':
                    arr.push(i + '=' + _wf.url.arr[i].replace(/_list$/, '_show'));
                    break;
                default :
                    arr.push(i + '=' + _wf.url.arr[i]);
                    break;
            }
        }
        _list.show_url = '?' + arr.join('&');
    }

    _wf.url.open(_list.show_url + '&xid=' + xid, '展示信息');
};

_list.get = function() {
    if (_list.page_now == 0) {
        _list.page_now = 1;
    }

    _wf.ajax({
        'loading': '读取...',
        'data': {
            'mod': _i_.mod,
            'act': _i_.name + '_read',
            'xid': _i_.xid,
            'page': _list.page_now,
            'show': _list.show_num,
            'query': _list.query.concat(_list.search)
        },
        'func': function(data) {
            _list.set(data);
        }
    });
};

_list.set = function(data) {
    if (!data) {
        _wf.log('No info return.', 'error');
        return;
    }

    var i, j, info, tmp;

    _list.list = data['list'];

    if (data['num'] != _list.info_num) {
        _list.info_num = data['num'];
        _list.page_now = data['page'];
        _list.page_num = Math.ceil(_list.info_num / _list.show_num);
        _list.page_box.find('.info_num').html(_list.info_num);
        _list.page_box.find('.page_num').html(_list.page_num);
        _list.page_box.find('.page_now').html(_list.page_now);

        if (_list.info_num == 0) {
            _list.page_now = 0;
        }
    }

    _list.page_box.find('.page_now').html(_list.page_now);
    _list.info_now = _list.show_num * (_list.page_now - 1) + 1;

    if (0 == _list.page_num || 1 == _list.page_num) {
        _list.page_box.find('.btn_page_first, .btn_page_last, .btn_page_prev, .btn_page_next').attr("disabled", "disabled");
    } else if (1 == _list.page_now) {
        _list.page_box.find('.btn_page_first, .btn_page_prev').attr("disabled", "disabled");
        _list.page_box.find('.btn_page_last, .btn_page_next').removeAttr("disabled");
    } else if (_list.page_num == _list.page_now) {
        _list.page_box.find('.btn_page_first, .btn_page_prev').removeAttr("disabled");
        _list.page_box.find('.btn_page_last, .btn_page_next').attr("disabled", "disabled");
    } else {
        _list.page_box.find('.btn_page_first, .btn_page_last, .btn_page_prev, .btn_page_next').removeAttr("disabled");
    }

    _list.box.html('');
    for (i in _list.list) {
        info = _list.list[i];
        _list.dom.attr('data-xid', info['id']);
        _list.dom.find('.i').html(_list.info_now + i * 1);
        
        for (j in _list.key) {
            if (typeof info[_list.key[j]] != 'undefined') {                
                _list.dom.find('.' + _list.key[j]).html(info[_list.key[j]]);
            }
        }

        if (_i_.admin) {
            _list.dom.find('.btn_edit, .btn_del').removeAttr('disabled');
        }

        if (_i_.user_id) {
            if (_i_.user_id != info['user_id']) {
                _list.dom.find('.btn_edit, .btn_del').attr('disabled', 'true');
            }
        }
    
        if (_list.order) {
            _list.dom.find('.btn_order_up, .btn_order_down').show().removeAttr('disabled');

            if (info[_list.order] != _i_.oid_type || i == 0) {        
                _list.dom.find('.btn_order_up').attr('disabled', 'true');
                if (i > 0) {
                    _list.box.find('tr:eq(' + (i-1) + ') .btn_order_down').attr('disabled', 'true');
                }
            }

            if (!_list.list[i*1+1]) {
                _list.dom.find('.btn_order_down').attr('disabled', 'true');
            }

            _i_.oid_type = info[_list.order];
        }

        if (typeof _list.set_info_plug == 'function') {
            _list.set_info_plug(info, i);
        }

        _list.box.append(_list.dom.clone(true));
    }

    if (_list.box.html() == '') {
        _list.box.html('<tr><td colspan="100" class="tb_notice">对不起，无相应信息！</td></tr>');
    }

    if (!_list.label) {
        if (data['label']) {
            _list.label = data['label'];
        } else {
            _list.label = '信息列表';
        }
    }

    $('#box_label').html(_list.label);
    _wf.url.title('', _list.label);

    _list.search_set();
};

//删除事件
_list.del = function(i) {
    var tmp = '';
    if (_list.list[i]['label']) {
        tmp = '“' + _list.list[i]['label'] + '”';
    }

    if (true != confirm('确定要删除' + tmp + '吗？')) {
        return;
    }

    _wf.ajax({
        'loading': '删除...',
        'data': {
            'mod': _i_.mod,
            'act': _i_.name + '_del',
            'xid': _list.list[i]['id']
        },
        'func': function() {
            _list.get();
        }
    });
};

_list.search_set = function() {
    if (_list.search.length == 0) {
        return;
    }

    var i;
    var reg;

    for (i in _list.search) {
        if (_list.search[i]['info']) {
            reg = new RegExp("(" + _list.search[i]['info'] + ")", "igm");
            _list.box.find('.' + _list.search[i]['name']).each(function() {
                this.innerHTML = this.innerHTML.replace(reg, '<B class="tb_focus">$1</B>');
            });
        }
    }
};

//搜索事件
_list.search_get = function() {
    _list.search = [];
    var val;
    var i = 0;

    $('#box_search .search_txt').each(function() {
        val = _wf.val(this);
        if ('' != val) {
            _list.search[i] = {};
            _list.search[i]['name'] = $(this).attr('data-key');
            _list.search[i]['info'] = val;
            _list.search[i]['type'] = $(this).attr('data-xeq');
            i++;
        }
    });

    _list.page_now = 1;

    _list.get();
};

_list.page_creat = function() {
    var tmp = '<div class="pagination_box"><button class="btn_page_first">首页</button><button class="btn_page_prev">上一页</button><div class="separator"></div><div>第&nbsp;<span class="page_now">1</span>&nbsp;页&nbsp;/&nbsp;共&nbsp;<span class="page_num">1</span>&nbsp;页</div><div class="separator"></div><button class="btn_page_next">下一页</button><button class="btn_page_last">尾页</button><div class="separator"></div><div>共有&nbsp;<span class="info_num">1</span>&nbsp;条信息。</div><div class="separator"></div><div class="show_num_box">每页显示：<select class="show_num"><option value="1">1</option><option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20">20</option><option value="30">30</option><option value="50">50</option></select>条</div></div>';
    $('body').append(tmp);
};

_list.order_up = function (i) {
    _wf.ajax({
        'loading' : '……',
        'data' : {
            'mod' : _i_.mod,
            'act' : _i_.name + '_order_up',
            'xid' : _list.list[i]['id']
        },
        'func' : function() {
            _list.get();
        }
    });
};

_list.order_down = function (i) {
    _wf.ajax({
        'loading' : '……',
        'data' : {
            'mod' : _i_.mod,
            'act' : _i_.name + '_order_down',
            'xid' : _list.list[i]['id']
        },
        'func' : function() {
            _list.get();
        }
    });
};