/**
 * Created by kenshinn on 15-6-15.
 */

document.write("<script src='/assets/js/easemob/config.js' language=javascript></script>");

var appKeyWithSlash = $.cookie('orgName') + '/' + $('#appName').val();

// 初始化加载
$(function () {
    // support crossDomain
    $.support.cors = true;

    $('#user_info').html('<small id="nav_welcome">' + $.i18n.prop('nav_welcome') + '</small>' + $.cookie('cuserName'));

    var agreeCBoxObj = $("#agreeCBox");

    // 注册按钮状态
    agreeCBoxObj.bind("click", function () {
        if ($('#agreeCBox').attr('checked')) {
            $('#formSubBtn').addClass('btn-success').disabled = false;
        } else {
            $('#formSubBtn').removeClass('btn-success').disabled = true;
        }
    });
    if (agreeCBoxObj.attr('checked')) {
        $('#formSubBtn').addClass('btn-success').disabled = false;
    } else {
        $('#formSubBtn').removeClass('btn-success').disabled = true;
    }

    BtnHandler.setBtnEnable();
});


// 获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 文件后缀校验
function validateFileSuffix(fileName) {
    var fileExt = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
    var allowExt = '.p12';
    if (allowExt != fileExt) {
        layer.msg($.i18n.prop('app_notifiers_layer_typeError') + ' [' + (fileExt == '' ? ' Null' : fileExt) + ']', 3, 5);
        return false;
    }
    return true;
}


function checkTel(value) {
    var isChinaPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
    var isChinaMobile = /^(((\+?86)|(\(\+86\)))?(1[0-9]{10}))$/;
    var isMalaysia = /^(((\+?60)|(\(\+60\)))?([0123456789]{7}|[0123456789]{8}|[0123456789]{9}))$/;
    var isSingapore = /^(((\+?65)|(0065)|(\+0065)|(\(\+65\)))?[0123456789]{7,10})$/;

    return isChinaPhone.test(value) || isSingapore.test(value) || isChinaMobile.test(value) || isMalaysia.test(value);
}


// 时间格式转换 1399434332770 ->
function add0(m) {
    return m < 10 ? '0' + m : m;
}
function format(timeST) {
    var time = new Date(parseInt(timeST));
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}


// 分页基础数据
var cursors = {};
var pageNo = 1;
cursors[1] = '';
var total = 0;
var cursors1 = {};
cursors1[1] = '';

// 分页条更新
function updateUsersPageStatus() {
    var accessToken = $.cookie('access_token');
    var cuser = $.cookie('cuser');
    var orgName = $.cookie('orgName');
    var appName = $.cookie('appName');
    if (!accessToken || accessToken == '') {
        EasemobCommon.disPatcher.sessionTimeOut();
    } else {
        $.ajax({
            url: baseUrl + '/' + orgName + '/' + appName + '/users',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            error: function (jqXHR, textStatus, errorThrown) {
            },
            success: function (respData, textStatus, jqXHR) {
                total = respData.count;
                var totalPage = (total % 10 == 0) ? (parseInt(total / 10)) : (parseInt(total / 10) + 1);

                var ulB = '<ul>';
                var ulE = '</ul>';
                var textOp1 = '<li> <a href="javascript:void(0);" onclick="getPrevAppUserList()">上一页</a> </li>';
                var textOp2 = '<li> <a href="javascript:void(0);" onclick="getNextAppUserList()">下一页</a> </li>';
                $('#paginau').html('');
                // 首页
                if (pageNo == 1) {
                    if (totalPage == 1) {
                        $('#paginau').append(ulB + ulE);
                    } else {
                        $('#paginau').append(ulB + textOp2 + ulE);
                    }
                    // 尾页
                } else if (totalPage == pageNo) {
                    $('#paginau').append(ulB + textOp1 + ulE);
                } else {
                    $('#paginau').append(ulB + textOp1 + textOp2 + ulE);
                }
            }
        });
    }
}


function setUsername(username) {
    $('#usernameMondify').val(username);
    $('#appNameHide').val($.cookie('appName'));
    $('#pwdMondify').val('');
}


//调用方法
function deleteAppUsers(username) {
    var accessToken = $.cookie('access_token');
    var orgName = $.cookie('orgName');
    var appName = $.cookie('appName');
    var flag = false;
    $.ajax({
        async: false,
        url: baseUrl + '/' + orgName + '/' + appName + '/users/' + username,
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        error: function () {
        },
        success: function (respData) {
            flag = true;
        }
    });

    return flag;
}


var EasemobCommon = function () {
    // fetch token from cookie
    var getToken = function () {
        return $.cookie('access_token');
    };

    // responsive logo
    var handleResponsiveLogo = function () {
        window.onresize = window.onload = function () {
            var w, h;
            if (!!(window.attachEvent && !window.opera)) {
                h = document.documentElement.clientHeight;
                w = document.documentElement.clientWidth;
            } else {
                h = window.innerHeight;
                w = window.innerWidth;
            }

            $("#logo_home").width(w / 6.5).height(h / 16);
        }
    };

    var isSessionTimeOut = function () {
        if (!getToken() || getToken() == '') {
            this.logOut();
        }
    };

    return {
        httpMethod: {
            POST: 'POST',
            GET: 'GET',
            DELETE: 'DELETE',
            PUT: 'PUT'
        },

        disPatcher: {
            openPageWWWHome: function () {
                window.open('http://www.easemob.com')
            },
            openPageWWWDocs: function () {
                window.open('http://docs.easemob.com/docs.php');
            },
            openPageWWWSupport: function () {
                window.open('http://www.easemob.com/support')
            },
            openPageWWWSDK: function () {
                window.open('http://www.easemob.com/downloads')
            },
            openPageIMGeek: function () {
                window.open('http://www.imgeek.org')
            },
            openPageAboutTerms: function () {
                window.open('http://www.easemob.com/Webpage/view/id/4')
            },
            openPageIOSPushCertificate: function () {
                window.open('http://www.easemob.com/docs/ios/push/certificate/')
            },
            refreshCurrentPage: function () {
                location.replace(location.href);
            },
            toPageIMCloudLogin: function () {
                window.location.href = 'index.html';
            },
            toPageIMCloudRegister: function () {
                window.location.href = 'index_register.html';
            },
            toPageIMCloudForgotPassword: function () {
                window.location.href = 'index_forgotpwd.html';
            },
            toPageKefuLogin: function () {
                window.open('https://kefu.easemob.com');
            },
            toPageKefuRegister: function () {
                window.open('https://kefu.easemob.com/register');
            },
            toPageKefuForgotPassword: function () {
                window.open('https://kefu.easemob.com/forgotPassword');
            },
            toPageIndex: function () {
                window.location.href = 'index.html';
            },
            toPageIndexRegister: function () {
                window.location.href = 'index_register.html';
            },
            toPageIndexForgotPwd: function () {
                window.location.href = 'index_forgotpwd.html';
            },
            toPageIndexRegistOrgSuccess: function (mailSuffix, regEmail) {
                window.location.href = 'index_regist_org_success.html?mailSuffix=' + mailSuffix + '&regEmail=' + regEmail;
            },
            toPageAppList: function () {
                window.location.href = "app_list.html";
            },
            toPageAppCreate: function () {
                window.location.href = "app_create.html";
            },
            toPageOrgAdminCreate: function () {
                window.location.href = "org_admin_create.html";
            },
            toPageOrgAdminHome: function () {
                window.location.href = "org_admin_home.html";
            },
            toPageOrgAdminList: function () {
                window.location.href = "org_admin_list.html";
            },
            toPageOrgAdminPassword: function () {
                window.location.href = "org_admin_passwd.html";
            },
            toPageAppInfo: function () {
                window.location.href = 'app_info.html';
            },
            toPageAppUsers: function () {
                window.location.href = 'app_users.html';
            },
            toPageAppUserContacts: function (owner_username) {
                window.location.href = 'app_user_contacts.html?owner_username=' + owner_username;
            },
            toPageAppUserCreate: function (username) {
                window.location.href = 'app_user_create.html?username=' + username;
            },
            toPageAppChatGroups: function () {
                window.location.href = 'app_chatgroups.html';
            },
            toPageAppChatGroupUsers: function (groupid) {
                window.location.href = 'app_chatgroup_users.html?groupid=' + groupid;
            },
            toPageAppNotifiers: function () {
                window.location.href = 'app_notifiers.html';
            },
            toPageAppCounters: function () {
                window.location.href = 'app_counters.html';
            },
            sessionTimeOut: function () {
                this.logOut();
            }
        },

        logOut: function () {
            // 销毁cookie
            $.cookie("access_token", null, {path: "/"});
            $.cookie("cuser", null, {path: "/"});
            $.cookie("cuserName", null, {path: "/"});
            $.cookie("orgName", null, {path: "/"});
            $.cookie("email", null, {path: "/"});
            $.cookie("companyName", null, {path: "/"});
            $.cookie("telephone", null, {path: "/"});

            this.disPatcher.toPageIndex();
        },

        init: function () {
            isSessionTimeOut();
            handleResponsiveLogo();
        },

        // 每次访问index.html的时候,如果上次设置的语言未过期，则显示上次设置好了的语言偏好，如果过期了根据浏览器信息来显示.
        initLocale: function () {
            var localeInfo = $.cookie('localeInfo');
            if (!localeInfo) {
                var language = navigator.userLanguage ? navigator.userLanguage : navigator.language;
                localeInfo = 'en';
                if (language.indexOf('zh') > -1) {
                    localeInfo = 'zh';
                }
            }

            this.setLocale(localeInfo);
        },

        setLocale: function (localeInfo) {
            var date = new Date();
            date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
            $.cookie('localeInfo', localeInfo, {path: '/', expires: date});

            var pageName = I18NPropsLoader.getPageName();
            if (pageName != '') {
                I18NPropsLoader.loadPropertiesByPage(pageName);
            } else {
                I18NPropsLoader.loadPropertiesForPageIndexLogin();
            }
        }
    }
}();

var BtnHandler = function() {
    var isBtnEnableTag = 0;

    return {
        setBtnEnable: function() {
            isBtnEnableTag = 0;
        },
        isBtnEnable: function() {
            if (isBtnEnableTag == 0) {
                isBtnEnableTag++;
                return true;
            } else {
                return false;
            }
        }
    }
}();


String.prototype.Trim = function () {
    var m = this.match(/^\s*(\S+(\s+\S+)*)\s*$/);
    return (m == null) ? "" : m[1];
};

String.prototype.isMobile = function () {
    return (/^(?:13\d|15[89])-?\d{5}(\d{3}|\*{3})$/.test(this.Trim()));
};

String.prototype.isTel = function () {
    //"兼容格式: 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)"
    return (/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(this.Trim()));
};

$(function () {
    window.Modal = function () {
        var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
        var alr = $("#ycf-alert");
        var ahtml = alr.html();

        var _confirm = function (options) {
            alr.html(ahtml);
            alr.find('.ok').removeClass('btn-primary').addClass('btn-success');
            alr.find('.cancel').show();
            _dialog(options);

            return {
                on: function (callback) {
                    if (callback && callback instanceof Function) {
                        alr.find('.ok').click(function () {
                            callback(true)
                        });
                        alr.find('.cancel').click(function () {
                        });
                    }
                }
            };
        };

        var _dialog = function (options) {
            var ops = {
                msg: "提示内容",
                title: "操作提示",
                btnok: "确定",
                btncl: "取消"
            };

            $.extend(ops, options);

            var html = alr.html().replace(reg, function (node, key) {
                return {
                    Title: ops.title,
                    Message: ops.msg,
                    BtnOk: ops.btnok,
                    BtnCancel: ops.btncl
                }[key];
            });

            alr.html(html);
            alr.modal({
                width: 700,
                backdrop: 'static'
            });
        };

        return {confirm: _confirm}
    }();
});