_i_.data = {};

//定义_register操作类
var _register = {
    form: '',
    form_val: '',
    form_dom: '',
    form_msg: '',
    form_old: '',
    form_btn: ''
};

//_register操作类的初始化函数
_register.init = function() {
    _form.exist = 'register_exist';

    if (!_register.form_dom) {
        _register.form_dom = $('#box_form');
    }

    if (!_register.form_btn) {
        _register.form_btn = $('#btn_register');
    }

    _register.form_old = _wf.local.get('_register');

    _register.form_get();
};

//按钮事件触发器
_register.init_btn = function() {
    //增加“登陆”按钮事件
    _register.form_btn.click(function() {
        _register.submit();
    });
};

//_register操作类的初始化函数
_register.form_get = function() {
    _i_.data.mod = 'auth';
    _i_.data.act = 'register_init';
    _i_.data.xid = '';
    _i_.data.arr = '';

    _wf.ajax({
        'type': 'static',
        'encode': 'json',
        'loading': '读取...',
        'data': _i_.data,
        'func': function(data) {
            _register.form_set(data.arr);
        }
    });
};

//_register操作类的初始化函数
_register.form_set = function(arr) {
    var i;

    _i_.data.mod = 'auth';
    _i_.data.act = 'register';

    if (arr['form']) {
        _register.form = arr['form'];

        _form.set(_register.form, _register.form_dom, _register.form_old, _register.form_msg);

        for (i in _register.form_val) {
            _wf.val('#field_' + _register.form_val[i]['name'] + ' .' + _register.form_val[i]['name'], _register.form_val[i]['info']);
            $('#field_' + _register.form_val[i]['name']).hide();
        }

        _register.init_btn();
    }

    if (typeof _register.form_set_plug == 'function') {
        _register.form_set_plug();
    }
};

_register.submit = function() {
    var tmp;
    tmp = _form.val(_register.form, _register.form_dom);

    if (!tmp) {
        return;
    }

    _i_.data.mod = 'auth';
    _i_.data.act = 'register';
    _i_.data.xid = '';
    _i_.data.arr = {
        'form': _register.form
    };

    _wf.ajax({
        'loading': '注册...',
        'data': _i_.data,
        'func': function(data) {
            _register.submit_func(data.arr);
        }
    });
};

_register.submit_func = function(arr) {
    switch (arr['register']) {
        case '0':
            alert('注册失败！存在重复注册信息。');
            break;
        case '1':
            _wf.loading('注册成功，正在登录……');
            _wf.local.set('_login', arr.user);
            _wf.url.go('?mod=main&name=main');
            break;
        case '2':
            alert('注册成功！请等待管理员审核。');
            _wf.url.go('?mod=auth&name=login');
            break;
        default:
            alert(arr['register']);
            break;
    }
};