/**
* 文件名称：spage.js
* 功能描述：spage for jQuery 分页插件。基于陈健的jquery.jpage.js的分页插件和smartpaginator分页插件改写的分页控件。cfg为jpage配置参数组。
* 代码作者：陈健、孙振强
* 创建日期：2008-07-08
* 修改日期：2010-01-28
* 当前版本：V2.0  beta 1
*/

jQuery.fn.spage = function(cfg) {
    init(cfg);
    
    function init(cfg){
        //可设置变量
        if (!cfg.key) {
            return;
        }
        
        if (!cfg.page_per) {
            cfg.page_per = 10;               
        }
        
        if (!cfg.page_now) {
            cfg.page_now = 1;               
        }
        
        if (!cfg.cookie) {  //判断是否启用cookie
            cfg.cookie = true;
            if (_df.cookie.get(cfg.key + '_page_now')) {
                cfg.page_now = _df.cookie.get(cfg.key + '_page_now');
            }            

            if (_df.cookie.get(cfg.key + '_page_per')) {
                cfg.page_per = _df.cookie.get(cfg.key + '_page_per');
            }
        }
        
        if (!cfg.info_all) {
            cfg.info_all = 0;            
            cfg.page_now = 0; 
        } else if (cfg.page_now == 0) {
            cfg.page_now =1;
        }
                
        if (!cfg.theme) {
            cfg.theme = 'default';               
        }
        
        if (!cfg.act) {
            cfg.act = null;               
        }           
        
        //内部变量奇函数开始
        cfg.page_all = Math.ceil(cfg.info_all/cfg.page_per);  //总页数        
        
        //载入样式
        _df.css.get(_df.cfg._df_url +'/lib/spage/theme/' + cfg.theme + '/css/spage.css');
        //添加分页htm
        cfg.page_htm = $(cfg.key).html();
        
        if(!cfg.page_htm) {
            cfg.page_htm = '<div class="spage_page_box"><div class="spage_btn spage_first">第一页</div><div class="spage_btn spage_prev">上一页</div><div class="spage_separator"></div><div class="spage_page_num_box">第&nbsp;<span class="spage_page_now"></span>&nbsp;页&nbsp;/&nbsp;共&nbsp;<span class="spage_page_all"></span>&nbsp;页</div><div class="spage_separator"></div><div class="spage_btn spage_next">下一页</div><div class="spage_btn spage_last">最尾页</div><div class="spage_separator"></div><div class="spage_info_num_box">共有&nbsp;<span class="spage_info_all"></span>&nbsp;条记录，当前显示第&nbsp;<span class="spage_info_s"></span>&nbsp;条&nbsp;-&nbsp;第&nbsp;<span class="spage_info_e"></span>&nbsp;条。</div><div class="spage_separator"></div><div class="spage_page_per_box">每页：<select class="spage_page_per"><option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20">20</option><option value="30">30</option><option value="50">50</option></select></div></div>';
        }
        
        cfg.page_htm = cfg.page_htm.replace(new RegExp('spage', 'gm'), cfg.theme);
        $(cfg.key).html(cfg.page_htm);

        //定义dom
        var btn_next = $(cfg.key + ' .' + cfg.theme + '_next');  //下一页按钮
        var btn_prev = $(cfg.key + ' .' + cfg.theme + '_prev');  //上一页按钮
        var btn_first = $(cfg.key + ' .' + cfg.theme + '_first');  //首页按钮
        var btn_last = $(cfg.key + ' .' + cfg.theme + '_last');  //末页按钮
        var btn_refresh = $(cfg.key + ' .' + cfg.theme + '_refresh');  //刷新按钮
        var btn_all = $(cfg.key + ' .' + cfg.theme + '_first, ' + cfg.key+' .' + cfg.theme + '_prev, ' + cfg.key + ' .' + cfg.theme + '_next, ' + cfg.key + ' .' + cfg.theme + '_last, ' + cfg.key + ' .' + cfg.theme + '_refresh');  //所有按钮

        var val_page_now = $(cfg.key + ' .' + cfg.theme + '_page_now');  //当前页码dom
        var val_page_per = $(cfg.key + ' .' + cfg.theme + '_page_per');  //每页显示的记录数量dom
        var val_page_all = $(cfg.key + ' .' + cfg.theme + '_page_all');  //每页显示的记录数量dom
        var val_info_all = $(cfg.key + ' .' + cfg.theme + '_info_all');  //每页显示的记录数量dom
        var val_info_s = $(cfg.key + ' .' + cfg.theme + '_info_s');  //当前页显示的起始记录dom
        var val_info_e = $(cfg.key + ' .' + cfg.theme + '_info_e');  //当前页显示的起始记录dom

        //加载工具栏状态
        page_load();

        //按钮监听
        btn_next.click(function() {
            if(cfg.page_now < cfg.page_all) {
                cfg.page_now = cfg.page_now*1 + 1;
                page_reload();
            }
        });
        btn_prev.click(function() {
            if(cfg.page_now > 1){
                cfg.page_now -= 1;
                page_reload();
            }
        });
        btn_first.click(function() {
            if(cfg.page_now > 1){
                cfg.page_now = 1;
                page_reload();
            }
        });
        btn_last.click(function() {
            if(cfg.page_now < cfg.page_all) {
                cfg.page_now = cfg.page_all;
                page_reload();
            }
        });
        btn_refresh.click(function() {
            page_reload();
        });

        //页码输入框监听
        val_page_now.keypress(function(e) {
        if ('13' == e.which  || '13' == e.keyCode) {
            var i = parseInt($(this).val());            
            if(i >= 1 && i <= cfg.page_all){
                cfg.page_now = i;
                page_reload();
            }
        }
        });

        val_page_per.change(function() {
            cfg.page_per = parseInt($(this).val());
            cfg.page_now = 1;
            cfg.page_all = Math.ceil(cfg.info_all / cfg.page_per);
            page_load();
        });

        val_page_per.attr('value', cfg.page_per);
        if (null == val_page_per.val()) {
            val_page_per.append('<option value="' + cfg.page_per + '">' + cfg.page_per + '</option>');
            val_page_per.attr('value', cfg.page_per);
        }
        
        /*********************************init私有函数***************************************************/
        /**
         * 初始化工具栏状态
         */
        function page_load() {
            if(cfg.cookie){  //当前页码写入cookie
                _df.cookie.set(cfg.key + '_page_per', cfg.page_per, 365);
            }
            
            if(cfg.page_now > cfg.page_all){
                cfg.page_now = cfg.page_all*1 - 1;
            }
            
            val_page_all.html(cfg.page_all);
            val_info_all.html(cfg.info_all);
            page_reload();
        }

        /**
         * 重载工具栏状态
         */
        function page_reload() {
            if(cfg.act){
                cfg.act(cfg.page_now, cfg.page_per);
            }
            
            if(cfg.cookie){  //当前页码写入cookie
                _df.cookie.set(cfg.key + '_page_now', cfg.page_now, 365);
            }

            val_page_now.html(cfg.page_now);
            val_info_s.html(cfg.page_per * (cfg.page_now - 1) + 1);
            if (cfg.page_per * cfg.page_now > cfg.info_all) {
                val_info_e.html(cfg.info_all);
            } else {
                val_info_e.html(cfg.page_per * cfg.page_now);
            }

            if(0 == cfg.page_all || 1 == cfg.page_all) {
                btn_go_prev_disable();
                btn_go_next_disable();
            } else if(1 == cfg.page_now) {
                btn_go_prev_disable();
                btn_go_next_enable();
            } else if(cfg.page_all ==  cfg.page_now) {
                btn_go_prev_enable();
                btn_go_next_disable();
            } else {
                btn_go_prev_enable();
                btn_go_next_enable();
            }
        }

        /**
         * 移除按钮disabled状态样式
         */
        function btn_go_next_enable() {
            btn_next.removeClass(cfg.theme + '_next_disable');
            btn_last.removeClass(cfg.theme + '_last_disable');
        }
        function btn_go_prev_enable() {
            btn_first.removeClass(cfg.theme + '_first_disable');
            btn_prev.removeClass(cfg.theme + '_prev_disable');
        }

        /**
         * 添加按钮disabled状态样式
         */
        function btn_go_next_disable() {
            btn_next.addClass(cfg.theme + '_next_disable');
            btn_last.addClass(cfg.theme + '_last_disable');
        }
        function btn_go_prev_disable() {
            btn_first.addClass(cfg.theme + '_first_disable');
            btn_prev.addClass(cfg.theme + '_prev_disable');
        }
    }
}
/**
skin : black\blue\default\gallery\rotundity\simple\white
js:
    $('#demo').spage({
        key : '.pagination_box',
        cookie : true,
        info_all : '25',
        page_per : '7',
        theme : 'black',
        act : function(page_now, page_per) {}
    });
htm:
    <div class="spage_page_box">
        <div class="spage_btn spage_first">第一页</div>
        <div class="spage_btn spage_prev">上一页</div>
        <div class="spage_separator"></div>
        <div class="spage_page_num_box">第&nbsp;<span class="spage_page_now"></span>&nbsp;页&nbsp;/&nbsp;共&nbsp;<span class="spage_page_all"></span>&nbsp;页</div>
        <div class="spage_separator"></div>
        <div class="spage_btn spage_next">下一页</div>
        <div class="spage_btn spage_last">最尾页</div>
        <div class="spage_separator"></div>
        <div class="spage_info_num_box">共有&nbsp;<span class="spage_info_all"></span>&nbsp;条记录，当前显示第&nbsp;<span class="spage_info_s"></span>&nbsp;条&nbsp;-&nbsp;第&nbsp;<span class="spage_info_e"></span>&nbsp;条。</div>
        <div class="spage_separator"></div>
        <div class="spage_page_per_box">每页：
            <select class="spage_page_per">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
            </select>
        </div>
    </div>
*/