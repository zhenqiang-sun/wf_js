var _index = {};

_index.init = function() {    
    if (_wf.app.make != '1') {
        _index.get();
    }
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
