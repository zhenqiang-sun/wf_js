if (typeof $ == 'function') {
    $(function(){
        _wf.func();
    });    
} else {
    window.onload = function(){
        _wf.func();
    };
}
