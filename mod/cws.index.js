var _index = {};

_index.init = function() {    
    if (_wf.app.make != '1') {
        _index.get();        
        _index.article_main.init();
    }
    
    _index.baner.init();
};

_index.get = function() {
    _wf.ajax({
        'data': {
            'mod': 'site',
            'act': 'site_index',
            'sid': _wf.app.id
        },
        'func': function(data) {
            _index.data = data;
            _index.set();
        }
    });
};

_index.set = function() {
    if (!_index.data || !_index.data['label']) {
        return;
    }
    
    _i_.title = _index.data['label'];
    $('title').html(_i_.title);
};

_index.baner = {};
_index.baner.xid = '';
_index.baner.width = 960;
_index.baner.height = 350;

_index.baner.init = function() {
    if (!_index.baner.xid) {
        return;
    }
    
    if (!_index.baner.box) {
        _index.baner.box = $('#banner');
    }
    
    if (_wf.app.make == '1') {
        setTimeout('_index.baner.play()', 1000);
    } else {
        _index.baner.get();
    }
};

_index.baner.play = function() {
    var i = new Date().getSeconds();
    var type = ['2d', '3d'];
    i = i % 2;

    _index.baner.box.ccslider({
        effectType: type[i],
        effect: 'random',
        _3dOptions: {
            imageWidth: _index.baner.width,
            imageHeight: _index.baner.height
        },
        directionNav: false,
        captions: false
    }).css('overflow', 'visible');
};

_index.baner.get = function() {    
    _index.baner.dom = _index.baner.box.find('.item:eq(0)').clone(true);
    _index.baner.dom_a = _index.baner.dom.find('a');
    _index.baner.dom_img = _index.baner.dom.find('img');
    _index.baner.data = [];

    _wf.ajax({
        'data': {
            'mod': 'ad',
            'act': 'ad_list_read',
            'xid': _index.baner.xid,
            'sid': _wf.app.id,
            'show': '20'
        },
        'func': function(data) {
            _index.baner.data = data;
            _index.baner.set();
        }
    });
};

_index.baner.set = function() {
    var i;
    var info;

    _index.baner.box.find('.item').remove();

    for (i in _index.baner.data['list']) {
        info = _index.baner.data['list'][i];
        _index.baner.dom_a.attr({'href': info['url']});
        _index.baner.dom_img.attr({'src': _wf.app.doc + info['logo'], 'alt': info['label'], 'data-href': info['url']});
        _index.baner.box.append(_index.baner.dom.clone(true));
    }

    setTimeout('_index.baner.play()', 5000);
};

_index.article_main = {};
_index.article_main.xid = '';

_index.article_main.init = function() {    
    if (!_index.article_main.xid && _index.article_main.xid !== '0') {
        return;
    }
    
    _index.article_main.box = $('#main_box');
    _index.article_main.dom = $('#main_box .main_item:eq(0)').clone(true);
    _index.article_main.dom_label = _index.article_main.dom.find('.label');
    _index.article_main.dom_info = _index.article_main.dom.find('.main_info');    
    _index.article_main.dom_item = $('#main_box .item:eq(0)').clone(true);
    _index.article_main.dom_title = _index.article_main.dom_item.find('.title');
    _index.article_main.dom_date = _index.article_main.dom_item.find('.date');
    _index.article_main.show_num = 5;
    _index.article_main.data = [];  
    
    _index.article_main.get();
};

_index.article_main.get = function() {    
    _wf.ajax({
        'data': {
            'mod': 'article',
            'act': 'article_main_read',
            'xid': _index.article_main.xid,
            'sid': _wf.app.id,
            'show': _index.article_main.show_num
        },
        'func': function(data) {
            _index.article_main.data = data;
            _index.article_main.set();
        }
    });
};

_index.article_main.set = function() {
    var i;
    var j;

    if (!_index.article_main.data) {
        return;
    }

    $('#type_label').html(_index.article_main.data['label']).attr('href', '?name=article_list&xid=' + _index.article_main.data['xid']);
    
    _index.article_main.box.html('');
    
    for (i in _index.article_main.data['main']) {
        _index.article_main.dom_info.html('');
        
        for (j in _index.article_main.data['main'][i]['list']) {
            _index.article_main.set_info(_index.article_main.data['main'][i]['list'][j]);    
        }
        
        _index.article_main.dom_label.html(_index.article_main.data['main'][i]['label']).attr('href', '?name=article_list&xid=' + _index.article_main.data['main'][i]['id']);
        _index.article_main.box.append(_index.article_main.dom.clone(true));   
    }   
    
    _index.article_main.box.append('<div class="clear"></div>');
};

_index.article_main.set_info = function (info) {
    var arr = info['label_style'].split('');
    var tmp = 'title';

    if (arr[0] == '1') {
        tmp += ' label_b';
    }
    
    if (arr[1] == '1') {
        tmp += ' label_i';
    }

    if (arr[2] == '1') {
        tmp += ' label_u';
    }

    if (arr[3] != '0') {
        tmp += ' label_color_' + arr[3];
    }
    
    if (!info['url']) {
        info['url'] = '?name=article_info&xid=' + info['id'];
    }
    
    _index.article_main.dom_title.html(info['label']).attr({'href': info['url'], 'class': tmp});
    _index.article_main.dom_date.html(info['ctime'].substring(0, 10));    
    _index.article_main.dom_info.append(_index.article_main.dom_item.clone(true));
};
