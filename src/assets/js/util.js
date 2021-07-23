// import { of } from 'core-js/fn/array';

export const getRequest = function () {
    var url = location.href; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.split("?")[1];
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

export const setImgPath = function (type) {
    type = type.split(".")[1]
    var url
    if (type == 'audio') {
        url = require('../../assets/images/file_audio.png')
    }
    else if (type == 'excel') {
        url = require('../../assets/images/file_excel.png')
    }
    else if (type == 'ofd') {
        url = require('../../assets/images/file_ofd.png')
    }
    else if (type == 'pdf') {
        url = require('../../assets/images/file_pdf.png')
    }
    else if (type == 'ppt') {
        url = require('../../assets/images/file_ppt.png')
    }
    else if (type == 'txt') {
        url = require('../../assets/images/file_txt.png')
    }
    else if (type == 'word' || type == 'doc' || type == 'wps') {
        url = require('../../assets/images/file_word.png')
    } else {
        url = require('../../assets/images/file_other.png')
    }
    return url
}

export const keepList = ['post_index','post_edit', 'getinfo_index', 'department_index', 'email_index', 'notice_index', 'leave_index', 'sign_index','common_affix','sign_handle']

export const baseUrl = 'http://192.168.2.134:92/suncn-twoa6-system/'

export const objLength = function (obj) {
    for (let v in obj) {
        return true
    }
    return false
}

export const concatStr = function (arr, id) {
    var ids = "";
    arr.forEach((item) => {
        ids = ids + item[id] + ",";
    });
    return ids.substring(0, ids.length - 1)
}

// 时间格式化
export const timeFormat = function (time, type) {
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hour = time.getHours();
    let minutes = time.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    if (type == 8) {
        return year + "-" + month + "-" + day;
    } else {
        return year + "-" + month + "-" + day + " " + hour + ":" + minutes;
    }

}



