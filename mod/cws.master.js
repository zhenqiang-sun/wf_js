var _master = {};

_master.cache = "1";
_master.init = function() {
    if (_wf.url.get('del') == '1') {
        _master.del();
    }

    if (_wf.app.master != '1') {
        _master.snapshot(_wf.app.url + '/?name=master');
        _master.info_get();
    }

    if (_wf.app.make != '1') {
        setTimeout('_master.make()', 5000);
    }

    if (_wf.app.name == 'master' && _wf.app.make != '1') {
        $('#master_css, #master_js').remove();
    }

    setTimeout('_master.hits()', 100);
};

_master.key4url = function() {
    return 'ui=' + _wf.app.ui + '&mod=' + _wf.app.mod + '&name=' + _wf.app.name + '&act=' + _wf.url.get('act') + '&xid=' + _wf.url.get('xid');
};

_master.del = function() {
    $.ajax({
        'type': 'GET',
        'url': _wf.app.url + '/make/?do=del&' + _master.key4url()
    });
};

_master.make = function() {
    if (!_i_.title || _master.cache === "0") {
        return;
    }

    var html = '<!DOCTYPE html><html>' + $('html').html() + '</html>';
    html = html.replace(',"make":"0",', ',"make":"1",');
    html = html.replace(',"master":"0"', ',"master":"1"');

    $.ajax({
        'type': 'POST',
        'url': _wf.app.url + '/make/?do=make&' + _master.key4url(),
        'data': 'html=' + encodeURIComponent(html)
    });
};

_master.snapshot = function(url) {
    if (_wf.url.get('make') == '1' || _master.cache === "0") {
        return;
    }

    if (!url) {
        url = document.URL;
    }

    _wf.ajax({
        'data': {
            'mod': 'make',
            'act': 'make_snapshot',
            'xid': url,
            'sid': _wf.app.id
        }
    });
};

_master.info_get = function() {
    _wf.ajax({
        'data': {
            'mod': 'site',
            'act': 'site_info',
            'sid': _wf.app.id
        },
        'func': function(data) {
            _master.info_set(data);
        }
    });
};

_master.info_set = function(data) {
    if (!data) {
        return;
    }
    
    if (data['title']) {
        $('title').html(data['title']);

        if (_wf.app.name == 'master') {
            _i_.title = data['title'];
        }
    }

    if (data['keywords']) {
        $('meta[name=keywords]').attr('content', data['keywords']);
    }

    if (data['description']) {
        $('meta[name=description]').attr('content', data['description']);
    }

    if (data['footer']) {
        $('#footer').html(_wf.decode(data['footer']));
    }

    if (data['nav']) {
        _master.nav_set(data['nav']);
    }
};

_master.nav_set = function(data) {
    var i;
    var j = 0;
    var arr;

    _master.nav_box = $('#nav');
    _master.nav_dom = $('#nav .item:eq(0)').clone(true);
    _master.nav_box.html('');
    _master.nav_target = ['', '_blank'];

    for (i in data) {
        arr = data[i];

        if (arr['parent_layer'] != '0') {
            continue;
        }

        _master.nav_dom.html(arr['label']).attr({
            'href': arr['url'],
            'target': _master.nav_target[arr['url_type']]
        }).attr('class', 'item nav_' + j);
        j++;
        _master.nav_box.append(_master.nav_dom.clone(true));
    }
};

_master.title_change = function() {
    if (_i_.title) {
        $('title').html(_i_.title + ' - ' + $('title').html());
    }
};

_master.hits = function(xid, xtb) {    
    if (!xid) {
        if (typeof _index == 'object' || typeof _search == 'object') {
            xid = _wf.app.id;
        } else {
            xid = _wf.url.get('xid');
        }      
    }
        
    if (!xid) {
        return;
    }

    if (!xtb) {        
        if (typeof _article_info == 'object') {
            xtb = 'article';
        } else if (typeof _article_list == 'object') {
            xtb = 'type';
        } else {
            xtb = 'site';
        }
    }

    _wf.ajax({
        'data': {
            'mod': 'hits',
            'act': 'hits_read',
            'sid': _wf.app.id,
            'xid': xid,
            'xtb': xtb,
            'referrer': document.referrer,
            'label': document.title
        },
        'func': function(data) {
            _master.hits_set(data);
        }
    });
};

_master.hits_set = function(data) {
    $('#hits').html(data);
};

_master.down = function(dom) {
    var xid = $(dom).attr('data-xid');

    if (!xid || isNaN(xid)) {
        return;
    }

    var arr = {};
    arr['arr'] = new Date().getTime();
    arr['url'] = document.URL;
    _wf.url.open(_wf.app.doc + '/?down=' + _wf.encode(arr) + '&xid=' + xid, '', 3);
    return false;
};

_i_.down = _master.down;
_i_.title_change = _master.title_change;
_i_.hits = _master.hits;