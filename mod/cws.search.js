var _search = {};

_search.init = function() {
    $('#search_btn').click(function(){
        _search.get();
    });
    
    $('#search_txt').keypress(function(event) {
        if (event.keyCode == 13 || event.which == 13) {
            _search.get();
        }
    });
    
    _search.box = $('#list_box');
    _search.dom = $('#list_box .item:eq(0)').clone(true);
    _search.dom_title = _search.dom.find('.title');
    _search.dom_date = _search.dom.find('.date');
    _search.dom_info = _search.dom.find('.info');
    _search.page_box = $('#list_page');
    _search.page_now_dom = $('#page_now');
    _search.page_prev_dom = $('#page_prev');
    _search.page_next_dom = $('#page_next');
    _search.page_now = 1;
    _search.show_num = 10;
    _search.info_num = -1;
    _search.data = [];
    
    _search.page_now_dom.change(function(){
        var i = this.value;
        
        if (i > 0 && i <= _search.page_num) {
            _search.page_now = i;
            _search.get();
        }
    });
    
    _search.page_prev_dom.click(function(){
        if (_search.page_now > 1) {
            _search.page_now--;
            _search.get();
        }
    });
    
    _search.page_next_dom.click(function(){
        if (_search.page_now < _search.page_num) {
            _search.page_now++;
            _search.get();
        }
    });
    
    _search.xid = _wf.url.get('xid');
    
    if (_search.xid) {
        _wf.url.set('xid', '');
        $('#search_txt').val(_search.xid);
        _search.get();
    } else {
        $('#alert_input').show();
        $('#list_box, #list_page').hide();
    }
};

_search.get = function() {
    var xid = $('#search_txt').val();
    
    xid = xid.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/ig, '');
        
    if (!xid || xid == ' ') {
        return;
    }
    
    if (_search.xid != xid) {
        _search.page_now = 1;
    }
    
    if (_search.page_now == 0) {
        _search.page_now = 1;
    }
    
    _search.xid = xid;    
    
    _wf.ajax({
        'loading': '搜索',
        'data': {
            'mod': 'search',
            'act': 'search_list_read',
            'xid': _search.xid,
            'sid': _wf.app.id,
            'page': _search.page_now,
            'show': _search.show_num
        },
        'func': function(data) {
            _search.data = data;
            _search.set();
        }
    });
};

_search.set = function() {    
    var i;
    
    $('#alert_input').hide();
    
    if (_search.data['num'] == '0') {        
        $('#alert_empty').show();
        $('#list_box, #list_page').hide();
    } else {
        $('#alert_empty').hide();
        $('#list_box, #list_page').show();
    }
    
    _search.keywords = _search.data['xid'].split(' ');   
    
    for (i in _search.keywords) {
        _search.keywords[i] = _search.keywords[i].replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/ig, '');
        
        if (!_search.keywords[i]) {
            delete(_search.keywords[i]);
        }
    }
    
    _search.box.html('');
    
    for (i in _search.data['list']) {
        _search.set_info(_search.data['list'][i]);
    }
    
    if (_search.data['num'] != _search.info_num) {
        _search.info_num = _search.data['num'];
        _search.page_now = _search.data['page'];
        _search.page_num = Math.ceil(_search.info_num / _search.show_num);
        
        if (_search.page_num == 0) {
            _search.page_num = 1;
        }
        
        _search.page_box.find('#page_num').html(_search.page_num);
    }

    _search.page_now_dom.val(_search.page_now);
    _search.page_prev_dom.removeAttr("disabled");
    _search.page_next_dom.removeAttr("disabled");
    
    if (1 == _search.page_num) {
        _search.page_prev_dom.attr("disabled", "disabled");
    }
    
    if (_search.page_num == _search.page_now) {
        _search.page_next_dom.attr("disabled", "disabled");
    }
};

_search.set_info = function (info) {  
    var i;
    var reg;
    
    for (i in _search.keywords) {        
        reg = new RegExp("(" + _search.keywords[i] + ")", "igm");    
        info['label'] = info['label'].replace(reg, '<em>$1</em>');
        info['info'] = info['info'].replace(reg, '<em>$1</em>');
    }
    
    if (!info['url']) {
        switch (info['xtb']) {
            case 'article' :
                info['url'] = '?name=article_info&xid=' + info['id'];
                break;
        }
    }
    
    _search.dom_title.html(info['label']).attr({'href': info['url']});
    _search.dom_date.html(info['ctime']);
    _search.dom_info.html(info['info']);
    _search.box.append(_search.dom.clone(true));
};
