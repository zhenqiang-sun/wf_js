var _article_list = {};

_article_list.init = function() {
    _article_list.xid = _wf.url.get('xid');   
    
    if (!_article_list.xid) {
        return;
    }
    
    _article_list.box = $('#list_box');
    _article_list.dom = $('#list_box .item:eq(0)').clone(true);
    _article_list.dom_title = _article_list.dom.find('.title');
    _article_list.dom_date = _article_list.dom.find('.date');
    _article_list.page_box = $('#list_page');
    _article_list.page_now_dom = $('#page_now');
    _article_list.page_prev_dom = $('#page_prev');
    _article_list.page_next_dom = $('#page_next');
    _article_list.page_now = 1;
    _article_list.show_num = 10;
    _article_list.info_num = -1;
    _article_list.data = [];
    
    _article_list.page_now_dom.change(function(){
        var i = this.value;
        
        if (i > 0 && i <= _article_list.page_num) {
            _article_list.page_now = i;
            _article_list.get();
        }
    });
    
    _article_list.page_prev_dom.click(function(){
        if (_article_list.page_now > 1) {
            _article_list.page_now--;
            _article_list.get();
        }
    });
    
    _article_list.page_next_dom.click(function(){
        if (_article_list.page_now < _article_list.page_num) {
            _article_list.page_now++;
            _article_list.get();
        }
    });
          
    _article_list.get();
};

_article_list.get = function() {    
    if (_article_list.page_now == 0) {
        _article_list.page_now = 1;
    }
    
    _wf.ajax({
        'data': {
            'mod': 'article',
            'act': 'article_list_read',
            'xid': _article_list.xid,
            'sid': _wf.app.id,
            'page': _article_list.page_now,
            'show': _article_list.show_num
        },
        'func': function(data) {
            _article_list.data = data;
            _article_list.set();
        }
    });
};

_article_list.set = function() {
    var i;

    if (!_article_list.type_label) {
        _article_list.type_label = _article_list.data['label'];
        $('#type_label').html(_article_list.data['label']).attr('href', '?name=article_list&xid=' + _article_list.data['xid']);
        _i_.title = _article_list.type_label;
        _i_.title = _i_.title.replace(/^→/, '');
        _i_.title_change();
    }
    
    _article_list.box.html('');
    
    for (i in _article_list.data['list']) {
        _article_list.set_info(_article_list.data['list'][i]);
    }
    
    if (_article_list.data['num'] != _article_list.info_num) {
        _article_list.info_num = _article_list.data['num'];
        _article_list.page_now = _article_list.data['page'];
        _article_list.page_num = Math.ceil(_article_list.info_num / _article_list.show_num);
        
        if (_article_list.page_num == 0) {
            _article_list.page_num = 1;
        }
        
        _article_list.page_box.find('#page_num').html(_article_list.page_num);
    }

    _article_list.page_now_dom.val(_article_list.page_now);
    _article_list.page_prev_dom.removeAttr("disabled");
    _article_list.page_next_dom.removeAttr("disabled");
    
    if (1 == _article_list.page_num) {
        _article_list.page_prev_dom.attr("disabled", "disabled");
    }
    
    if (_article_list.page_num == _article_list.page_now) {
        _article_list.page_next_dom.attr("disabled", "disabled");
    }
};

_article_list.set_info = function (info) {
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
    
    _article_list.dom_title.html(info['label']).attr({'href': info['url'], 'class': tmp});
    _article_list.dom_date.html(info['ctime']);    
    _article_list.box.append(_article_list.dom.clone(true));
};