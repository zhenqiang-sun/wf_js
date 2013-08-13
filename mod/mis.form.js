var _form = {};

_form.exist = '';

//_login操作类的初始化函数
_form.set = function(form, form_dom, form_old, form_msg) {
    var i, j, k, tmp, field, field_dom, field_tmp;
    var validate_law = {};
    var validate_msg = {};
    var validate_cfg = {};
    var validate_tmp;

    if (!form || !form_dom) {
        return;
    }

    for (i in form) {
        if (!form_dom.find('fieldset').eq(i)[0]) {
            tmp = '<fieldset></fieldset>';
            form_dom.append(tmp);
        }

        for (j in form[i]['field']) {
            field = form[i]['field'][j];
            field_dom = $('#field_' + field['name']);

            if (!field_dom[0]) {
                field_tmp = '<div class="field" id="field_' + field['name'] + '">';
                field_tmp += '<label for="field_' + field['name'] + '" class="label">' + field['label'] + '：</label>';

                switch (field['type']) {
                    case 'text':
                    case 'password':
                    case 'search':
                    case 'url':
                    case 'tel':
                    case 'number':
                    case 'email':
                        field_tmp += '<input id="field_' + field['name'] + '_info" name="field_' + field['name'] + '_info" type="' + field['type'] + '" class="text ' + field['name'] + '">';
                        break;
                    case 'radio':
                        for (k in field['item']) {
                            field_tmp += '<input id="field_' + field['name'] + '_info_' + k + '" name="field_' + field['name'] + '_info" type="radio" class="radio ' + field['name'] + '" value="' + field['item'][k]['info'] + '">';
                            field_tmp += '<label for="field_' + field['name'] + '_info_' + k + '" class="radio_label">' + field['item'][k]['label'] + '</label>';
                        }
                        break;
                }

                field_tmp += '</div>';
                form_dom.find('fieldset').eq(i).append(field_tmp);

                field_dom = $('#field_' + field['name']);
            }

            if (typeof form_old == 'object') {
                if (form_old[field['name']]) {
                    field['info'] = form_old[field['name']];
                }
            } else if (typeof form_old == 'array') {
                if (form_old[i]['field'][j]['info']) {
                    field['info'] = form_old[i]['field'][j]['info'];
                }
            }

            switch (field['type']) {
                case 'text':
                case 'password':
                case 'search':
                case 'url':
                case 'tel':
                case 'number':
                case 'email':
                    field_dom.find('.text').attr({
                        'placeholder': field['placeholder'],
                        'value': field['info']
                    });
                    break;
                case 'radio':
                    if (field['info']) {
                        for (k in field['item']) {
                            if (field['info'] == field['item'][k]['info']) {
                                $('#field_' + field['name'] + '_info_' + k).attr('checked', 'checked');
                                $('#field_' + field['name'] + '_info').attr('value', field['info']);
                                break;
                            }
                        }
                    }
                    break;
            }

            if (field['valid']) {
                validate_tmp = '1';
                validate_law['field_' + field['name'] + '_info'] = {};
                validate_msg['field_' + field['name'] + '_info'] = {};
                for (k in field['valid']) {
                    if (field['valid'][k]['info'] == 'true') {
                        field['valid'][k]['info'] = true;
                    }

                    if (field['valid'][k]['name'] == 'equalTo') {
                        field['valid'][k]['info'] = '#field_' + field['valid'][k]['info'] + '_info';
                    }

                    if (field['valid'][k]['name'] == 'required' && field['valid'][k]['info'] == true) {
                        field_dom.find('.label').addClass('required');
                    }

                    validate_law['field_' + field['name'] + '_info'][field['valid'][k]['name']] = field['valid'][k]['info'];
                    validate_msg['field_' + field['name'] + '_info'][field['valid'][k]['name']] = field['valid'][k]['label'];
                }

                if (!form_msg) {
                    tmp = '<label class="error" for="field_' + field['name'] + '_info" style="display: none;" generated="true"></label>';
                    field_dom.append(tmp);
                }
            }
        }
    }

    if (validate_tmp) {
        validate_cfg['rules'] = validate_law;
        validate_cfg['messages'] = validate_msg;
        validate_cfg['onkeyup'] = false;

        if (form_msg) {
            validate_cfg['errorPlacement'] = function(error, element) {
                if (error.html()) {
                    element.focus();
                }

                form_msg.html(error.html());
            };

            validate_cfg['success'] = function() {
                form_msg.html('');
            };
        }

        form_dom.validate(validate_cfg);
    }
};

_form.val = function(form, form_dom) {
    var i, j, tmp, field;

    tmp = form_dom.valid();

    if (!tmp) {
        return false;
    }

    for (i in form) {
        for (j in form[i]['field']) {
            field = form[i]['field'][j];

            switch (field['type']) {
                case 'radio':
                    field['info'] = form_dom.find('input[name=field_' + field['name'] + '_info]:radio:checked').val();
                    break;
                default:
                    field['info'] = form_dom.find('#field_' + field['name'] + '_info').val();
                    break;
            }

            delete field['item'];
            delete field['valid'];
            delete field['placeholder'];
        }
    }

    return true;
};

_form.val = function(form, form_dom) {
    var i, j, tmp, field;

    tmp = form_dom.valid();

    if (!tmp) {
        return false;
    }

    for (i in form) {
        for (j in form[i]['field']) {
            field = form[i]['field'][j];

            switch (field['type']) {
                case 'radio':
                    field['info'] = form_dom.find('input[name=field_' + field['name'] + '_info]:radio:checked').val();
                    break;
                default:
                    field['info'] = form_dom.find('#field_' + field['name'] + '_info').val();
                    break;
            }

            delete field['item'];
            delete field['valid'];
            delete field['placeholder'];
        }
    }

    return true;
};

_form.val2arr = function(form) {
    var i, j;
    var arr = {};

    for (i in form) {
        for (j in form[i]['field']) {
            arr[form[i]['field'][j]['name']] = form[i]['field'][j]['info'];
        }
    }

    return arr;
};