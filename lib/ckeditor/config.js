/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {
    // Define changes to default configuration here. For example:
//    config.language = 'zh-cn';
//    config.font_names = 'Arial;Time New Roman;微软雅黑;宋体;楷体;黑体';
    // config.uiColor = '#AADC6E';
//    config.toolbarGroups = [
//        {name: 'document', groups: ['mode', 'document', 'doctools']},
//        {name: 'clipboard', groups: ['clipboard', 'undo']},
//        {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
//        {name: 'forms'},
//        '/',
//        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
//        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
//        {name: 'links'},
//        {name: 'insert'},
//        '/',
//        {name: 'styles'},
//        {name: 'colors'},
//        {name: 'tools'},
//        {name: 'others'},
//        {name: 'about'}
//    ];
    
//    config.toolbarGroups = [
//        {name: 'clipboard', groups: ['undo', 'clipboard']},
//        {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
//        {name: 'insert'},
//        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
//        '/',
//        {name: 'paragraph', groups: ['list', 'indent', 'align']},
//        {name: 'links'},
//        {name: 'styles'},
//        {name: 'colors'},
//        {name: 'tools'}
//    ];
        
    config.toolbar_min = [
        {name: 'undo'},
        {name: 'colors'},
        {name: 'editing', groups: ['basicstyles', 'links']},                
        {name: 'clipboard'},
        {name: 'paragraph', groups: ['list', 'indent']}
    ];
};
