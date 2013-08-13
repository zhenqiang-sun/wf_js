function g_idcard_check(cardid){  //检测身份证号码是否合法
    var Errors=new Array(
        "ok",
        "身份证号码位数不对!",
        "身份证号码出生日期超出范围或含有非法字符!",
        "身份证号码校验错误!",
        "身份证地区非法!"
        );

    var area={
        11:"北京",
        12:"天津",
        13:"河北",
        14:"山西",
        15:"内蒙古",
        21:"辽宁",
        22:"吉林",
        23:"黑龙江",
        31:"上海",
        32:"江苏",
        33:"浙江",
        34:"安徽",
        35:"福建",
        36:"江西",
        37:"山东",
        41:"河南",
        42:"湖北",
        43:"湖南",
        44:"广东",
        45:"广西",
        46:"海南",
        50:"重庆",
        51:"四川",
        52:"贵州",
        53:"云南",
        54:"西藏",
        61:"陕西",
        62:"甘肃",
        63:"青海",
        64:"宁夏",
        65:"新疆",
        71:"台湾",
        81:"香港",
        82:"澳门",
        91:"国外"
    }

    var Y,JYM;
    var S,M;
    var cardid_array = new Array();
    cardid_array = cardid.split("");

    //地区检验
    if(area[parseInt(cardid.substr(0,2))]==null) return Errors[4];

    //身份号码位数及格式检验
    switch(cardid.length){
        case 15:  //15位身份号码检测
            if ( (parseInt(cardid.substr(6,2))+1900) % 4 == 0 || ((parseInt(cardid.substr(6,2))+1900) % 100 == 0 && (parseInt(cardid.substr(6,2))+1900) % 4 == 0 )){
                ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
            } else {
                ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
            }

            if(ereg.test(cardid)) return Errors[0];
            else return Errors[2];
            break;
        case 18:  //18位身份号码检测
            if ( parseInt(cardid.substr(6,4)) % 4 == 0 || (parseInt(cardid.substr(6,4)) % 100 == 0 && parseInt(cardid.substr(6,4))%4 == 0 )){
                ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
            } else {
                ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
            }

            if(ereg.test(cardid)){  //测试出生日期的合法性
                //计算校验位
                S = (parseInt(cardid_array[0]) + parseInt(cardid_array[10])) * 7
                + (parseInt(cardid_array[1]) + parseInt(cardid_array[11])) * 9
                + (parseInt(cardid_array[2]) + parseInt(cardid_array[12])) * 10
                + (parseInt(cardid_array[3]) + parseInt(cardid_array[13])) * 5
                + (parseInt(cardid_array[4]) + parseInt(cardid_array[14])) * 8
                + (parseInt(cardid_array[5]) + parseInt(cardid_array[15])) * 4
                + (parseInt(cardid_array[6]) + parseInt(cardid_array[16])) * 2
                + parseInt(cardid_array[7]) * 1
                + parseInt(cardid_array[8]) * 6
                + parseInt(cardid_array[9]) * 3 ;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y,1);//判断校验位
                var cardid17 = cardid_array[17];
                if (cardid17=="x") cardid17="X";
                if(M == cardid17) return Errors[0]; //检测ID的校验位
                else return Errors[3];
            }
            else return Errors[2];
            break;
        default:
            return Errors[1];
            break;
    }
}

function g_idcard_birth(idcard) {  //从身份证号码中读取出生年月日
    var birth;
    if (15 == idcard.length) { //15位身份证号码
        birth = idcard.substr(6, 2);
        if(parseInt(idcard)<28) {
            birth = '20' + birth;
        } else {
            birth = '19' + birth;
        }
        birth = birth + '-' + idcard.substr(8, 2) + '-' + idcard.substr(10, 2);
        return birth;
    } else if (18 == idcard.length) { //18位身份证号码
        birth = idcard.substr(6, 4) + '-' + idcard.substr(10, 2) + '-' + idcard.substr(12, 2);
        return birth;
    } else {
        return '';
    }
}

function g_idcard_gender(idcard) {  //从身份证号码中读取性别
    if (15 == idcard.length) { //15位身份证号码
        if (parseInt(idcard.substr(14, 1)/2)*2 != idcard.substr(14, 1)) {
            return '男';
        } else {
            return '女';
        }
    } else if (18 == idcard.length) { //18位身份证号码
        if (parseInt(idcard.substr(16, 1)/2)*2 != idcard.substr(16, 1)) {
            return '男';
        } else {
            return '女';
        }
    } else {
        return '';
    }
}

function g_idcard_native(idcard) {
    var area={
        11:"北京",
        12:"天津",
        13:"河北",
        14:"山西",
        15:"内蒙古",
        21:"辽宁",
        22:"吉林",
        23:"黑龙江",
        31:"上海",
        32:"江苏",
        33:"浙江",
        34:"安徽",
        35:"福建",
        36:"江西",
        37:"山东",
        41:"河南",
        42:"湖北",
        43:"湖南",
        44:"广东",
        45:"广西",
        46:"海南",
        50:"重庆",
        51:"四川",
        52:"贵州",
        53:"云南",
        54:"西藏",
        61:"陕西",
        62:"甘肃",
        63:"青海",
        64:"宁夏",
        65:"新疆",
        71:"台湾",
        81:"香港",
        82:"澳门",
        91:"国外"
    }
    
    return area[idcard.substr(0, 2)];
}