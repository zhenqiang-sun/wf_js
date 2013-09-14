var _article_info = {};

//是否读取相关文章，1为是
_article_info.related = 0;

//重新生成时间，天数
_article_info.remake_days = 30;

_article_info.data = {};

_article_info.init = function() {    
    if (_wf.app.make != '1') {
        _article_info.get();
    } else {
        _article_info.remake();
    }
};

_article_info.get = function() {    
    _article_info.xid = _wf.url.get('xid');
    
    if (!_article_info.xid) {
        return;
    }
    
    _wf.ajax({
        'data': {
            'mod': 'article',
            'act': 'article_info_read',
            'xid': _article_info.xid,
            'sid': _wf.app.id
        },
        'func': function(data) {
            _article_info.data = data;
            _article_info.set();
        }
    });
};

_article_info.set = function() {
    var info;
    var tmp;
    var reg;
        
    info = _article_info.data['info'];
    
    if (!info || !info['label']) {
        return;
    }
    
    $('#info_type').html(info['type']).attr('href', '?name=article_list&xid=' + info['type_id']);
    
    $('#info_title').html(info['label']);
    
    //info_data
    tmp = _wf.decode(info['data']);
    reg = new RegExp('="\/doc\/20', "g");
    tmp = tmp.replace(reg, '="' + _wf.app.doc + '/20');
    $('#info_content').html(tmp);
    
    //meta description
    tmp = tmp.replace(/<.*?>|&nbsp;/g, '');
    if (tmp.indexOf('。') > 80) {
        tmp = tmp.substring(0, tmp.indexOf('。')) + '。';
    } else {
        tmp = tmp.substring(0, 200);
    }
    $('meta[name=description]').attr('content', tmp);
    
    //meta keywords
    tmp = $('meta[name=keywords]');
    tmp.attr('content', info['tags'].replace(/\s+/g, ',') + ',' + tmp.attr('content'));
    
    //type
    if (info['type_id'] == '0') {
        $('#info_attr').hide();
    } else {
        $('#info_attr').show();
        $('#info_ctime').html(info['ctime']);
    
        if (info['source']) {
            $('#info_source').html(info['source']);
            $('#info_source_box').show();
        } else {
            $('#info_source_box').hide();
        }
    
        if (info['author']) {
            $('#info_author').html(info['author']);
            $('#info_author_box').show();
        } else {
            $('#info_author_box').hide();
        }
    }
    
    //相关文章
    _article_info.related_get();
    
    _i_.title = info['label'];
    _i_.title_change();
};

function down(xid) {
    _i_.down(xid);
};

_article_info.related_get = function() {
    if (_article_info.related != 1 || !_article_info.data['info'] || !_article_info.data['info']['tags']) {
        return;
    }
    
    _wf.ajax({
        'data': {
            'mod': 'search',
            'act': 'search_list_read',
            'xid': _article_info.data['info']['tags'],
            'sid': _wf.app.id,
            'page': '1',
            'show': '6'
        },
        'func': function(data) {
            _article_info.related_data = data;
            _article_info.related_set();
        }
    });
};


_article_info.related_set = function() {
    if (_article_info.related_data['num'] == '0') {
        return;
    }
    
    _article_info.related_box = $('#related_box');    
    _article_info.related_dom = $('#related_box .item:eq(0)').clone(true);
    _article_info.related_dom_title = _article_info.related_dom.find('.title');
    _article_info.related_dom_date = _article_info.related_dom.find('.date');
    _article_info.related_dom_info = _article_info.related_dom.find('.info');
    
    _article_info.related_box.html('');
    _article_info.related_box.css('display', 'block');
    
    for (i in _article_info.related_data['list']) {
        _article_info.related_set_info(_article_info.related_data['list'][i]);
    }
};

_article_info.related_set_info = function (info) {
    if (_article_info.data['info']['id'] == info['id']) {
        return;
    }    
    
    if (!info['url']) {
        switch (info['xtb']) {
            case 'article' :
                info['url'] = '?name=article_info&xid=' + info['id'];
                break;
        }
    }
    
    _article_info.related_dom_title.html(info['label']).attr({'href': info['url']});
    _article_info.related_dom_date.html(info['ctime']);
    _article_info.related_dom_info.html(info['info']);
    _article_info.related_box.append(_article_info.related_dom.clone(true));
};


_article_info.remake = function() {
    if (_article_info.related != 1 || _article_info.remake_days == 0) {
        return;
    }
    
    var date_make = new Date(_wf.app.time.replace(/-/g, '/'));
    var date_now  = new Date();
    
    if ((date_now.getTime() - date_make.getTime()) > 86400000 * _article_info.remake_days) {
        _master.snapshot();
    }    
};