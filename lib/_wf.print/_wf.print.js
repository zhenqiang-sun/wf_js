_wf.css.load_lib('_wf.print');

_wf.print = {};


_wf.print.print = function() {
    if (_wf.print.type == 'iframe') {
        _wf.print.preview_iframe_close();
    }

    window.print();
};

_wf.print.preview = function() {
    if (_wf.print.type == 'inline') {
        _wf.print.preview_inline();
    } else {
        _wf.print.preview_iframe();
    }
};

_wf.print.preview_init = function() {
    $('body').addClass('body4print');

    if (_wf.print.landscape == true) {
        _wf.print.box.addClass('landscape');
    }

    _wf.print.btn = $('.box_print_btn');
    if (_wf.print.btn.length == 0) {
        _wf.print.btn = $('<div class="box_print_btn"><div class="print">打印</div><div class="close">关闭</div></div>');
        _wf.print.btn.appendTo('body');
    }

    _wf.print.btn.find('.print').click(function() {
        _wf.print.print();
    });

    _wf.print.btn.find('.close').click(function() {
        if (_wf.print.type == 'inline') {
            _wf.url.close();
        } else {
            _wf.print.preview_iframe_close();
        }
    });
};


_wf.print.preview_inline = function() {
    _wf.print.type = 'inline';

    _wf.print.box = $('.box_print');
    if (_wf.print.box.length == 0) {
        _wf.print.box = $('<div class="box_print"></div>');
        _wf.print.box.append($('body > *:not(#box_loading):not(.box_print):not(.box_print_btn):not(script)')).appendTo('body');
    }

    _wf.print.preview_init();
};

_wf.print.preview_iframe = function() {
    _wf.print.type = 'iframe';

    if (!_wf.print.dom) {
        _wf.print.box = $('<iframe class="box_print" name="box_print" border="0" frameborder="0"></iframe>');
        _wf.print.box.hide().appendTo('body');
        _wf.print.preview_init();

        // The frame lives
        for (var i = 0; i < window.frames.length; i++) {
            if (window.frames[i].name == "box_print") {
                _wf.print.dom = window.frames[i].document;
                break;
            }
        }

        _wf.print.dom.open();
        _wf.print.dom.write('<!DOCTYPE html><html><head></head><body></body></html>');
        _wf.print.dom.close();
    } else {
        _wf.print.btn.show();
        $('body').addClass('body4print');
    }

    _wf.print.head = $('head link').clone();
    _wf.print.head.each(function() {
        $(this).attr('media', 'all');
    });

    _wf.print.body = $('body > *:not(#box_loading):not(.box_print):not(.box_print_btn):not(script)').clone();
    $(_wf.print.dom).find('head').html('').append(_wf.print.head);
    $(_wf.print.dom).find('body').html('').append(_wf.print.body);

    $('body > *:not(#box_loading):not(.box_print):not(.box_print_btn):not(script)').hide();

    _wf.print.box.show('explode', {}, 500);
};

_wf.print.preview_iframe_close = function() {
    _wf.print.box.hide('explode', {}, 500);


    $('body > *:not(#box_loading):not(.box_print):not(script)').show();
    _wf.print.btn.hide();

    $('body').removeClass('body4print');
};