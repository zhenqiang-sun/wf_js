//定义_login操作类
var _login = {
    form: '',
    form_val: '',
    form_dom: '',
    form_msg: '',
    form_old: ''
};

//_login操作类的初始化函数
_login.init = function() {
    if (typeof localStorage != 'object') {
        $('#box_login').hide();
        _wf.loading.show('对不起，浏览器版本过低，请使用新版本。');
        return;
    }

    _login.start();
};

_login.start = function() {
    _wf.ajax({
        'data': {
            'mod': 'auth',
            'act': 'start'
        },
        'func': function(data) {
            _login.start_func(data);
        },
        'func_error': function() {
            _wf.loading.show('对不起，服务器连接失败！');
        }
    });
};

_login.start_func = function(data) {
    if (data['login'] == '1') {
        _wf.url.go('?mod=main&name=main');
    } else {
        if (data['register'] == '1') {
            $('#btn_register').show();
        } else {
            $('#btn_register').hide();
        }

        _login.form_init();
    }
};

//按钮事件触发器
_login.btn_init = function() {
    //增加“登陆”按钮事件
    $('#btn_login').click(function() {
        _login.submit();
    });

    //增加“保存密码”按钮事件
    $('#btn_pass_save').click(function() {
        $(this).toggleClass('checked');
    });

    //增加“忘记密码”按钮事件
    $('#btn_pass_find').click(function() {
        _login.pass_find();
    });

    //增加“注册”按钮事件
    $('#btn_register').click(function() {
        _login.btn_register();
    });

    $('#btn_app_down4pc').click(function() {
        _login.btn_app_down4pc();
    });

    //增加“帐号输入框”回车事件
    _login.form_dom.find('input').keypress(function(e) {
        if ('13' == e.which || '13' == e.keyCode) {
            _login.submit();
        }
    });

    if ($('#field_login_id_info').val() == '') {
        $('#field_login_id_info').focus();
    } else {
        $('#field_login_pw_info').focus();
    }
};

//_login操作类的初始化函数
_login.form_init = function() {
    if (!_login.form_dom) {
        _login.form_dom = $('#box_form');
    }

    _login.form_old = _wf.local.get('_login');

    if (_wf.local.get('_login_pass_save') == 'true') {
        $('#btn_pass_save').addClass('checked');
    } else {
        if (_login.form_old['login_pw']) {
            _login.form_old['login_pw'] = '';
        }
    }
    
    _login.form_get();
};

_i_.btn_app_down4pc = function() {
    _wf.url.open('http://xie.erlitech.com/down?name=' + _wf.app.id, '客户端下载', 3);
};

//_login操作类的初始化函数
_login.form_get = function() {
    _wf.ajax({
        'type': 'static',
        'encode': 'json',
        'loading': '读取...',
        'data': {
            'mod': 'auth',
            'act': 'login_init',
            'xid': ''
        },
        'func': function(data) {
            _login.form_set(data);
        }
    });
};

//_login操作类的初始化函数
_login.form_set = function(data) {
    var i;

    if (data['form']) {
        _login.form = data['form'];

        _form.set(_login.form, _login.form_dom, _login.form_old, _login.form_msg);

        for (i in _login.form_val) {
            _wf.val('#field_' + _login.form_val[i]['name'] + ' .' + _login.form_val[i]['name'], _login.form_val[i]['info']);
            $('#field_' + _login.form_val[i]['name']).hide();
        }

        $('#field_login_must').hide();

        _login.btn_init();
    }

    if (typeof _login.form_set_plug == 'function') {
        _login.form_set_plug();
    }
};

_login.btn_register = function() {    
    _wf.url.go('?mod=auth&name=register');
};

_login.submit = function() {
    var tmp;
    tmp = _form.val(_login.form, _login.form_dom);

    if (!tmp) {
        return;
    }
    
    _wf.ajax({
        'loading': '登录...',
        'data': {
            'mod': 'auth',
            'act': 'login',
            'form': _form.val2arr(_login.form)
        },
        'func': function(data) {
            _login.submit_func(data);
        }
    });
};

_login.submit_func = function(data) {
    if (!data['type']) {
        alert('对不起，登陆失败，请重试！');
        return;
    }
    
    switch (data['type']) {
        case '1':
            _wf.loading.show('登录成功！');
            _wf.local.set('_login', data['user']);

            if ($('#btn_pass_save').hasClass('checked')) {
                _wf.local.set('_login_pass_save', 'true');
            } else {
                _wf.local.set('_login_pass_save', '');
            }

            _wf.url.go('?mod=main&name=main');
            break;
        case '2':
            if (true == confirm(data['label'] + '\n\r确定强制登录吗？')) {
                _wf.val('#field_login_must .login_must', '是');
                _login.submit();
            }
            break;
        case '0':
        default:
            alert(data['label']);
            break;
    }
};

_login.pass_find = function() {
    var login_id;
    login_id = _wf.val('#field_login_id_info');

    if (!login_id) {
        alert('请将在“账号”输入您的“电子邮箱”。');
        $('#field_login_id_info').focus();
        return;
    }

    if (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(login_id) != true) {
        alert('请将在“账号”输入您的“电子邮箱”，并确认地址的正确性。');
        $('#field_login_id_info').focus();
        return;
    }

    _wf.ajax({
        'loading': '找回...',
        'data': {
            'mod': 'auth',
            'act': 'user_pass_find',
            'xid': login_id
        },
        'func': function(data) {
            _login.pass_find_func(data);
        }
    });
};

_login.pass_find_func = function(data) {
    if (data == '1') {
        alert('密码已找回，请查收邮件。');
    } else {
        alert('密码找回失败，请确认您的邮箱正确或联系系统管理员。');
    }
};