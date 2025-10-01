/**
 * ajax를 이용한 세션 체크
 * @returns
 */
function gfnSessionCheck() {
    var sessionOk = true;
    $.ajax({
        url : _CONTEXT_PATH + 'sessionCheck.json',
        data : JSON.stringify({}),
        type : 'post',
        dataType : 'json',
        async : false, // false면 순차적 실행
        contentType : "application/json; charset=UTF-8",
        success : function(res) {
            if (res.successYn != "Y") {
                hideLoading(true);
                gfnAlertMsg2("세션이 종료되었습니다. ", function() {
                    //SSO로 진입 한 경우 세션이 종료되면 창 닫기  
                    window.open('', '_self').close();
                    //온프라미스 로그인페이지가  존재 할 경우
                    //top.location.href = _CONTEXT_PATH + 'index';    
                });
                sessionOk = false;
            }
        },
        error : function(res, stat, err) {
            sessionOk = false;
        },
        fail : function() {
            sessionOk = false;
        }
    });
    return sessionOk;
}

/**
 * Excel Download 공통 함수
 *
 * @param retVal
 * @param screen_id
 * @returns
 */
function gfnExcelDownload(retVal, screen_id, callbackFunc) {
    // validation check
    if (gfnTrim(retVal) == '') {
        gfnAlertMsg('다운로드 사유를 입력하세요   ');
        return;
    }

    /**
     * 목적 : ISMS 개인정보 download 로그 기록을 남기기 위해서 반드시 지켜야 합니다. parameter screen_id :
     * 현재 화면 jsp명 
     */
    var downParam = new Object();
    downParam.group_id = _CURRENT_GROUP_ID;
    downParam.menu_id = _CURRENT_MENU_ID;
    downParam.screen_id = screen_id;
    downParam.reason = retVal;

    ajax.json(_CONTEXT_PATH + 'common/downloadLogWrite.json', JSON
            .stringify(downParam), function(res) {
        if (res && res.successYN == "Y") {
            if (typeof callbackFunc == 'function') {
                callbackFunc(); // callback
                // function call
            }
        } else if (res && res.successYN != "Y") {
            gfnAlertMsg(res.response.message); // error Message
        } else {
            gfnAlertMsg("다운로드 중 오류가 발생하였습니다. "); // error Message
        }
    });
}

/**
 * Dialog Excel Download [개인정보보호대상] 
 * 
 * @param
 * @returns
 */
function gfnExcelDownMsg(screen_id, callbackFunc) {

    /* 다운로드 사유를 입력받지 않는 그룹이 존재 할  경우 주석 제거
    if (_CURRENT_GROUP_ID == 'G000000006') {
        gfnExcelDownload('', screen_id, callbackFunc); // 사유
        // 입력
        // 받지
        // 않을
        // 경우

    }
    */

    var title = '다운로드 사유';
    var reasonHtml = '<textarea id="gTxtExcelDownReason" rows="5" cols="60" style="resize: none;"></textarea>';
    $('<div></div>').dialog(
        {
            modal : true,
            resizable : false,
            title : title,
            height : "auto",
            async : false,
            width : 400,
            open : function() {
                $(this).html(reasonHtml);
            },
            buttons : {
                "확인" : function() {
                    var retval = $('#gTxtExcelDownReason').val();
                    $(this).empty();
                    $(this).remove();
                    gfnExcelDownload(retval, screen_id,
                            callbackFunc);
                },
                Cancel : function() {
                    $(this).empty();
                    $(this).remove();
                }
            },
            close : function() {
                $(this).empty();
                $(this).remove();
            }
        });
     }

/*
 * gfnExcelDownMsg 함수에 cancelFunc 추가함
 * hidden값을 다운시 엑셀상에 header merge 안되는것때문에 추가
 * 2019.10.18 최은나 차장님과 협의함
 */
function gfnExcelDownMsg2(screen_id, callbackFunc, cancelFunc) {

    /* 다운로드 사유를 입력받지 않는 그룹이 존재 할  경우 주석 제거
    if (_CURRENT_GROUP_ID == 'G000000006') {
        gfnExcelDownload('', screen_id, callbackFunc); // 사유
        // 입력
        // 받지
        // 않을
        // 경우

    }
    */

    var title = '다운로드 사유';
    var reasonHtml = '<textarea id="gTxtExcelDownReason" rows="5" cols="60"></textarea>';
    $('<div></div>').dialog(
        {
            modal : true,
            resizable : false,
            title : title,
            height : "auto",
            async : false,
            width : 400,
            open : function() {
                $(this).html(reasonHtml);
            },
            buttons : {
                "확인" : function() {
                    var retval = $('#gTxtExcelDownReason').val();
                    $(this).empty();
                    $(this).remove();
                    gfnExcelDownload(retval, screen_id, 
                            callbackFunc);
                },
                Cancel : function() {
                    $(this).empty();
                    $(this).remove();
                    eval(cancelFunc)();
                }
            },
            close : function() {
                $(this).empty();
                $(this).remove();
                eval(cancelFunc)();
            }
        });
     }
/**
 * contentWrap 영역 안에서 공통 팝업
 *
 * @param url :
 *            호출 url
 * @param param :
 *            parameter >> "name=value&name2=value2"
 * @param width,
 *            height : 사이즈
 * @param popupId :
 *            SPA 환경에서 객체 충돌 방지를 위해서 사용
 * @param title :
 *            팝업 타이틀
 * @returns
 */
function gfnCommonPopup(url, param, width, height, popupId, title) {

    param = param + '&popupId=' + popupId;
    $('div[id=' + popupId + ']').remove();
    $('<div id="' + popupId + '">').appendTo('#wrap').hide();

    ajax.updateDiv(url, param, popupId, function() {
        $("#" + popupId).dialog({
            title : title,
            autoOpen : false,
            resizable : false,
            height : height,
            width : width,
            modal : true,
            close : function() {
            	$(this).empty();
                $(this).remove();
            },
            open : function(event, ui) {
            	$('input:visible:first', $(this).parent()).blur(); 		// 자동 focus 문제 수정 
            }
        }).dialog('open');
    });
}

/**
 * Dialog confirm 공통함수
 *
 * @param msg,
 *            title
 * @returns callback func
 */
function gfnConfirmMsg(msg, title, callbackFunc) {
    if (typeof callbackFunc == 'undefined' && typeof title == 'function') {
        callbackFunc = title;
        title = '유지보수활동관리';
    }
    $('<div style="line-height:1.5"></div>').dialog({
        modal : true,
        resizable : false,
        title : title,
        height : "auto",
        async : false,
        width : 400,
        open : function() {
            $(this).html(msg);
        },
        buttons : {
            "예" : function() {
                $(this).dialog("close");
                if (callbackFunc) {
                    setTimeout(function() {
                        return eval(callbackFunc)();
                    }, 100);	// 0.1초
                }
            },
            "아니오" : function() {
                $(this).empty();
                $(this).remove();
            }
        },
        close : function() {
            $(this).empty();
            $(this).remove();
        }
    });
}

/**
 * Dialog Alert 공통함수
 *
 * @param msg,
 *            title
 * @returns void
 */
function gfnAlertMsg(msg, title) {
    if (typeof title == 'undefined')
        title = '시스템표준 파일럿 시스템';
    $('<div style="margin: 20px 10px 20px 10px; padding: 0; line-height:1.5 !important;"></div>').dialog({
        modal : true,
        resizable : false,
        title : title,
        height : "auto",
        async : false,
        width : 480,
        open : function() {
            $(this).html(msg);
        },
        buttons : {
            "OK" : function() {
                $(this).empty();
                $(this).remove();
            }
        },
        close : function() {
            $(this).empty();
            $(this).remove();
        }
    });
}

/**
 * Dialog Alert 공통함수
 *
 * @param msg,
 *            title
 * @returns void
 */
function gfnAlertMsg2(msg, title, callbackFunc) {
	if (typeof callbackFunc == 'undefined' && typeof title == 'function') {
        callbackFunc = title;
        title = '시스템표준 파일럿 시스템';
    }
	
    $('<div style="margin: 20px 10px 20px 10px; padding: 0; line-height:1.5 !important;"></div>').dialog({
        modal : true,
        resizable : false,
        title : title,
        height : "auto",
        async : false,
        width : 480,
        open : function() {
            $(this).html(msg);
        },
        buttons : {
            "OK" : function(e) {
                $(this).empty();
                $(this).remove();

                if (callbackFunc) {
                    return eval(callbackFunc)();
                }
            }
        },
        close : function() {
            $(this).empty();
            $(this).remove();
        }
    });
}


function gfnAlertMsg3(msg, title, callbackFunc) {
    if (typeof callbackFunc == 'undefined' && typeof title == 'function') {
        callbackFunc = title;
        title = '시스템표준 파일럿 시스템';
    }

    var dialogContent = $('<div style="margin: 20px 10px 20px 10px; padding: 0; line-height:1.5 !important;"></div>');
    dialogContent.html(msg);

    dialogContent.dialog({
        modal: true,
        resizable: false,
        title: title,
        height: "auto",
        async: false,
        width: 480,
        open: function() {
            $(this).html(msg);
        },
        buttons: {
            // 확인 버튼
            "예": function() {
                $(this).empty();
                $(this).remove();

                if (callbackFunc) {
                    return eval(callbackFunc)();
                }
            },
            // 취소 버튼
            "아니오": function() {
                $(this).empty();
                $(this).remove();
            }
        }
    });

    // $(".ui-dialog-buttonset button").each(function() {
    //     var buttonText = $(this).text();
    //     if (buttonText === "신청") {
    //         // 확인 버튼 아이콘 추가
    //         $(this).html('<i class="xi-save"></i> 신청');
    //         $(this).attr('id', 'btn_save'); // 버튼에 ID 추가
    //     } else if (buttonText === "취소") {
    //         // 취소 버튼 아이콘 추가
    //         $(this).html('<i class="xi-close"></i> 취소');
    //         $(this).attr('id', 'btn_delete'); // 버튼에 ID 추가
    //     }
    // });
}


/**
 * gfnMsgBox
 *
 * @param type
 *            'alert', 'confirm'
 * @param msg
 * @param title
 * @param callbackFunc
 *            예) gfnMsgBox('alert', '저장되었습니다.', '자기계발계획서 승인', function(){
 *
 * });
 *
 * gfnMsgBox('confirm', '저장되었습니다.', '자기계발계획서 승인', fnClose);
 * @returns
 */
function gfnMsgBox(type, msg, title, callbackFunc) {
    if (type && type == 'alert') {
        gfnAlertMsg2(msg, title, callbackFunc);
    } else if (type && type == 'confirm') {
        gfnConfirmMsg(msg, title, callbackFunc);
    }
}

/**
 * 천단위 컴마 처리
 *
 * @param value
 * @returns value
 */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function numberWithCommas2(Obj) {
	var numberStr = Obj.value.replace(/,/g,"");
	var commaStr = numberStr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	Obj.value = commaStr;
}

/**
 * 진행바 보이기
 *
 * @param
 * @returns
 */
function showLoading() {
    $('#loading').height($(document).height());
    $('#loading').show();
    ajax.stackLoading++;
}

/**
 * 진행바 숨기기
 *
 * @param boolean
 * @returns
 */
function hideLoading(isForce) {
    ajax.stackLoading--;
    if (ajax.stackLoading <= 0 || isForce == true) {
        ajax.stackLoading = 0;
        $('#loading').hide();
    }
}

/**
 * 단일객체 유효성체크
 *
 * @param objectId
 * @returns {Boolean}
 */
function isValidObj(objId) {
    // var clLf = "\n";
    var clLf = "<br/>";
    var bool = true;
    var msg = "";
    var firstEleId = "";
    var RegExpForNumberOnly = /^[0-9]*$/;
    var obj = $('#' + objId)
    var eleId = $('#' + objId).attr("id");
    var eleLabel = $("label[for='" + eleId + "']").text();
    var eleMaxBytes = 0;
    var eleType = obj.prop("type");
    if (obj.is(':visible') && obj.attr("required")) {
        if (isNull(obj.val())) {
            if (eleType.indexOf("text") >= 0) {
                msg += eleLabel + " (은)는 필수 입력값입니다." + clLf;
            } else if (eleType.indexOf("select") >= 0) {
                msg += eleLabel + " (은)는 필수 선택값입니다." + clLf;
            } else if (eleType.indexOf("password") >= 0) {
                msg += eleLabel + " (은)는 필수 입력값입니다." + clLf;
            }
            if (isNull(firstEleId)) {
                firstEleId = eleId;
            }
            /* 건별 Return */
            gfnAlertMsg(msg);
            return false;
        }
    }
    if (obj.attr("maxBytes")) {
        eleMaxBytes = obj.attr("maxBytes");
        eleBytes = getLengthByte(obj.val());
        if (eleMaxBytes < eleBytes) {
            msg += eleLabel + " (을)를 " + obj.attr("maxBytes") + "Bytes 이내로 입력하시기 바랍니다. " + clLf; 
            if (isNull(firstEleId)) {
                firstEleId = eleId;
            }
            /* 건별 Return */
            gfnAlertMsg(msg);
            return false;
        }
    }
    if (obj.attr("numberOnly") != undefined) {
        if (!isNull(obj.val())) {
            if (!RegExpForNumberOnly.test(obj.val())) {
                msg += eleLabel + " (을)를 숫자만 입력하시기 바랍니다." + clLf;
            }
            if (isNull(firstEleId)) {
                firstEleId = eleId;
            }
            /* 건별 Return */
            gfnAlertMsg(msg);
            return false;
        }
    } 
    return bool;
}


/**
 * form 요소 유효성체크
 *
 * @param formId
 * @returns {Boolean}
 */
function isValid(formId) {
    // var clLf = "\n";
    var clLf = "<br/>";
    var bool = true;
    var msg = "";
    var firstEleId = "";
    var RegExpForNumberOnly = /^[0-9]*$/;
    $(
            "#" + formId + " input:text, #" + formId + " select, #" + formId
                    + " textarea").each(
            function() {
                var eleId = $(this).attr("id");
                var eleLabel = $("label[for='" + eleId + "']").text();
                var eleMaxBytes = 0;
                var eleType = $(this).prop("type");

                if ($(this).is(':visible') && $(this).attr("required")) {
                    if (isNull($(this).val())) {
                        if (eleType.indexOf("text") >= 0) {
                            msg += eleLabel + " (은)는 필수 입력값입니다." + clLf;
                        } else if (eleType.indexOf("select") >= 0) {
                            msg += eleLabel + " (은)는 필수 선택값입니다." + clLf;
                        }
                        if (isNull(firstEleId)) {
                            firstEleId = eleId;
                        }
                        /* 건별 Return */
                        return false;
                    }
                }
                if ($(this).attr("maxBytes")) {
                    eleMaxBytes = $(this).attr("maxBytes");
                    eleBytes = getLengthb($(this).val());

                    if (eleMaxBytes < eleBytes) {
                    	/*
                        msg += eleLabel + " (을)를 " + $(this).attr("maxBytes")
                                + "Bytes 이내로 입력하시기 바랍니다. " + clLf + " (현재: " + eleBytes
                                + "Bytes)" + clLf;
                        */
                        msg += eleLabel + " (을)를 " + $(this).attr("maxBytes") + "Bytes 이내로 입력하시기 바랍니다. " + clLf; 
                        if (isNull(firstEleId)) {
                            firstEleId = eleId;
                        }
                        /* 건별 Return */
                        return false;
                    }
                }
                if ($(this).attr("numberOnly") != undefined) {
                    if (!isNull($(this).val())) {
                        if (!RegExpForNumberOnly.test($(this).val())) {
                            msg += eleLabel + " (을)를 숫자만 입력하시기 바랍니다." + clLf;
                        }
                        if (isNull(firstEleId)) {
                            firstEleId = eleId;
                        }
                        /* 건별 Return */
                        return false;
                    }
                }
            });

    var preEleId = '';

    $("#" + formId + " input:radio").each(function() {

        var eleId = $(this).attr("id");
        var eleLabel = $("label[for='" + eleId + "']").text();
        var eleMaxBytes = 0;
        var eleType = $(this).prop("type");

        if (preEleId != eleId) {
            if ($(this).is(':visible') && $(this).attr("required")) {
                if (!$('input:radio[name=' + eleId + ']').is(':checked')) {
                    msg += eleLabel + " (은)는 필수 선택값입니다." + clLf;
                    if (isNull(firstEleId)) {
                        firstEleId = eleId;
                    }
                    /* 건별 Return */
                    return false;
                }
            }
            preEleId = eleId;
        }
    });

    if (msg != "") {
        gfnMsgBox('alert', msg, '유지보수활동관리', function(){
            if (!isNull(firstEleId)) {
                $("#" + firstEleId).focus();
            }
        });
        bool = false;
    }
    return bool;
}

function isValidListForm(formId) {
    // var clLf = "\n";
    var clLf = "<br/>";
    var bool = true;
    var msg = "";
    var RegExpForNumberOnly = /^[0-9]*$/;

    $(
            "#" + formId + " input:text, #" + formId + " select, #" + formId
                    + " textarea").each(
            function() {
                var rowSeq = $(this).parent().parent().find("span").html();
                var eleId = $(this).attr("id");
                var eleLabel = $(this).attr("desc");
                var eleMaxBytes = 0;
                var eleType = $(this).prop("type");

                if ($(this).attr("required")) {
                    if (isNull($(this).val())) {
                        if (eleType.indexOf("text") >= 0) {
                            msg += eleLabel + " (은)는 필수 입력값입니다." + clLf;
                        } else if (eleType.indexOf("select") >= 0) {
                            msg += eleLabel + " (은)는 필수 선택값입니다." + clLf;
                        }
                    }
                }
                if ($(this).attr("maxBytes")) {
                    eleMaxBytes = $(this).attr("maxBytes");
                    eleBytes = getLengthb($(this).val());

                    if (eleMaxBytes < eleBytes) {
                        msg += rowSeq + "번째 줄 " + eleLabel + " (을)를 "
                                + $(this).attr("maxBytes")
                                + "Bytes 이내로 입력하시기 바랍니다. " + clLf + " (현재: " + eleBytes
                                + "Bytes)" + clLf;
                    }
                }
                if ($(this).attr("numberOnly") != undefined) {
                    if (!isNull($(this).val())) {
                        if (!RegExpForNumberOnly.test($(this).val())) {
                            msg += rowSeq + "번째 줄 " + eleLabel
                                    + " (을)를 숫자만 입력하시기 바랍니다." + clLf;
                        }
                    }
                }
            });

    var preEleId = '';

    $("#" + formId + " input:radio").each(function() {

        var eleId = $(this).attr("id");
        var eleLabel = $("label[for='" + eleId + "']").html();
        var eleMaxBytes = 0;
        var eleType = $(this).prop("type");

        if (preEleId != eleId) {
            if ($(this).attr("required")) {
                if (!$('input:radio[name=' + eleId + ']').is(':checked')) {
                    msg += eleLabel + " (은)는 필수 선택값입니다." + clLf;

                    if (isNull(firstEleId)) {
                        firstEleId = eleId;
                    }
                }
            }
            preEleId = eleId;
        }
    });

    if (msg != "") {
        gfnAlertMsg(msg);
        bool = false;
    }

    return bool;
}

function BrowserVersionCheck() {
    var word;
    var versionOrType = "another";
    var ieName = navigator.appName;
    var agent = navigator.userAgent.toLowerCase();

    /** * 1. IE 버전 체크 ** */
    // IE old version ( IE 10 or Lower )
    if (ieName == "Microsoft Internet Explorer") {
        word = "msie ";
    } else {
        // IE 11
        if (agent.search("trident") > -1)
            word = "trident/.*rv:";
        // IE 12 ( Microsoft Edge )
        else if (agent.search("edge/") > -1)
            word = "edge/";
    }

    var reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
    if (reg.exec(agent) != null)
        versionOrType = RegExp.$1 + RegExp.$2;

    /** * 2. IE가 아닌 경우 브라우저 체크 ** */
    if (versionOrType == "another") {
        if (agent.indexOf("chrome") != -1)
            versionOrType = "Chrome";
        else if (agent.indexOf("opera") != -1)
            versionOrType = "Opera";
        else if (agent.indexOf("firefox") != -1)
            versionOrType = "Firefox";
        else if (agent.indexOf("safari") != -1)
            versionOrType = "Safari";
    } else {
        if (parseFloat(versionOrType) >= parseFloat("12.0")) {
            versionOrType = "Edge";
        }
    }
    return versionOrType;
}

/*
 * waitMe Documentation
 *
 * Basic $('#elem').waitMe({}) - #elem is html object, click on which causes to
 * show waitme.
 *
 * Options effect - animation effect. Use: 'bounce' - default, 'none',
 * 'rotateplane', 'stretch', 'orbit', 'roundBounce', 'win8', 'win8_linear',
 * 'ios', 'facebook', 'rotation', 'timer', 'pulse', 'progressBar',
 * 'bouncePulse', 'img'. text - place text under the effect. Use: 'text'. bg -
 * background for container. Use: 'rgba(255,255,255,0.7)' - default, false.
 * color - color for background animation and text. Use: '#000' - default,
 * ['','',...] - you can use multicolor for effect. maxSize - set max size for
 * elem animation. Use: '' - default, 40. waitTime - wait time im ms to close.
 * Use: -1 - default, 3000. textPos - change text position. Use: 'vertical' -
 * default, 'horizontal'. fontSize - change font size. Use: '' - default,
 * '18px'. source - url to image. Use: '' - default, 'url' - for effect: 'img'.
 * onClose - code execution after popup closed. Use: function(event, el){}.
 *
 * Methods hide - for close waitMe. Use: $(container).waitMe("hide");.
 *
 * Triggers close - execution after closed. Use: $(el).on('close', function()
 * {});.
 *
 */
function run_waitMe(el, loadingEffect, num) {

    text = 'Please wait...';

    effect = 'progressBar';
    maxSize = '';
    textPos = 'vertical';
    fontSize = '12px';

    if (loadingEffect != null && loadingEffect != '') {
        effect = loadingEffect;
    }

    if (num != null) {
        switch (num) {
        case 1:
            maxSize = '';
            textPos = 'vertical';
            break;
        case 2:
            text = '';
            maxSize = 30;
            textPos = 'vertical';
            break;
        case 3:
            maxSize = 30;
            textPos = 'horizontal';
            fontSize = '18px';
            break;
        }
        ;
    }

    $(el).waitMe({
        effect : effect,
        text : text,
        bg : 'rgba(255,255,255,0.7)',
        color : '#000',
        maxSize : maxSize,
        waitTime : -1,
        source : 'img.svg',
        textPos : textPos,
        fontSize : fontSize,
        onClose : function(el) {
        }
    });
}

/** ********************************************************************** */
/**
 * @type : function
 * @access : public
 * @desc : 화면 가운데에 스크롤바 있는 원하는 크기의 popup 창을 띠운다.
 * @sig : url, width, height
 * @param :
 *            url - popup 창에 나타내고자 하는 url
 * @param :
 *            width - popup 창의 width
 * @param :
 *            height - popup 창의 height
 * @return : 없음
 * @author : 공통
 */
function gfnShowScrollPopup(url, width, height, name) {
    var x = (screen.availWidth - width) / 2;
    var y = (screen.availHeight - height) / 2;

    if (name == "") {
        name = "ebillsPopup";
    }
    var winStyle = "width="
            + width
            + ",height="
            + height
            + ",left="
            + x
            + ",top="
            + y
            + ",resizable=no,status=no,scrollbars=yes,toolbar=no,location=no,directories=no,menubar=no";
    var j = 0;
    var key = new Array();
    var value = new Array();
    var stIndex = url.indexOf("?");
    var newUrl = url;
    if (stIndex > 0) {
        newUrl = url.substring(0, stIndex);
        var keyvalue = url.substring(stIndex + 1).split("&");
        for (i = 0; i < keyvalue.length; i++) {
            var keypair = keyvalue[i].split('=');
            key[j] = keypair[0];
            value[j] = keypair[1];
            j++;
        }
    }

    gfnOpenWindowWithPost(newUrl, name, winStyle, key, value);
}

function gfnShowNoScrollPopup(url, width, height, name) {
    var x = (screen.availWidth - width) / 2;
    var y = (screen.availHeight - height) / 2;

    if (name == "") {
        name = "ebillsPopup";
    }
    var winStyle = "width="
            + width
            + ",height="
            + height
            + ",left="
            + x
            + ",top="
            + y
            + ",resizable=no,status=no,scrollbars=no,toolbar=no,location=no,directories=no,menubar=no";
    var j = 0;
    var key = new Array();
    var value = new Array();
    var stIndex = url.indexOf("?");
    var newUrl = url;
    if (stIndex > 0) {
        newUrl = url.substring(0, stIndex);
        var keyvalue = url.substring(stIndex + 1).split("&");
        for (i = 0; i < keyvalue.length; i++) {
            var keypair = keyvalue[i].split('=');
            key[j] = keypair[0];
            value[j] = keypair[1];
            j++;
        }
    }

    gfnOpenWindowWithPost(newUrl, name, winStyle, key, value);
}

/**
 * @type : method
 * @access : public
 * @object :
 * @desc : GET 방식 호출을 POST 로 전환
 * @sig : url,name,width,height,x,y,keys,values
 * @param :
 *            url - 호출주소
 * @param :
 *            name - 윈도우명
 * @param :
 *            winStyle - 스타일
 * @param :
 *            keys - 키
 * @param :
 *            values - 값
 * @return :
 * @author : 공통
 */

function gfnOpenWindowWithPost(url, name, winStyle, keys, values) {

    window.open("about:blank", name, winStyle);
    var html = "";
    html = "<form target='" + name
            + "'  id='ebillsCommonPopup' method='post' action='" + url + "'>";
    if (keys != null && values != null && (keys.length == values.length)) {
        for (var i = 0; i < keys.length; i++) {
            html = html + "<input type='hidden' name='" + keys[i] + "' value='"
                    + decodeURIComponent(values[i].replace(/\+/g, '%20')) + "'/>";
        }
    }
    html = html + "</form>";

    if (document.getElementById('ePPMCommonDiv') == null) {
        var obj = document.createElement("div");
        obj.id = "ebillsCommonDiv";
        obj.name = "ebillsCommonDiv";
        obj.style.display = "none";
        document.body.appendChild(obj);
    }
    document.getElementById('ebillsCommonDiv').innerHTML = html;
    var frm = document.getElementById("ebillsCommonPopup"); //
    frm.method = 'post';
    frm.target = name;
    frm.submit();
}

/**
 * datepicker
 * @param target
 * @returns
 */
/**
 * 달력을 활성화 한다 .
 * @method     showCalendar
 * @public
 * @param       {string)     달력 매핑 대상 target 명
 */
function showCalendar (target) {
    var obj;

    if(!navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
      obj = {
            Format: 'yyyy.MM.dd',
            CalButtons: "Today|Close",
            CalButtonAlign: "Right",
            CallBackParam: target,
            CallBack: _callBackCalendar
        };
    } else {
        obj = {
            Format: 'yyyy.MM.dd',
            CalButtons: "Today|Close",
            CalButtonAlign: "Right",
            CallBackParam: target,
            CallBack: _callBackCalendar,
            Target : target
        };
    }

    if(typeof target === "string"){
        target = document.getElementsByName(target);
    }
    var v = target.value;
    IBCalendar.SetTheme('WHM', 'ModernWhite');
    IBCalendar.Show(v, obj);
}

/**
 * 달력을 선택하면 호출되는 callback 함수.
 * 달력에 선택한 값을 해당 target에 설정해 주고 change 이벤트를 발생한다
 * @method     _callBackCalendar
 * @private
 * @param {string} data 선택한 데이타
 * @param {string} target 명
 */
function _callBackCalendar(date, target) {
    if(typeof target === "string"){
        $("input[id="+target+"]").val(date).change();
    } else {
        target.value = date;
    }
}
/**
 * onReady에서 Date객체 호출
 *
 * @param date
 *            객체 id
 * @returns void
 */
function datePickerInit(objId) {
    $('#' + objId).datepicker({
        showOn : "both",
        buttonImage : "/resources/images/ico_calendar.gif", // 버튼 이미지
        buttonImageOnly : true,
        buttonText : "", // 날짜선택
        dateFormat : "yy-mm-dd",
        changeYear : true,
        changeMonth : true,
        closeText: '닫기',
        currentText: '오늘',
        prevText: '이전달',
        nextText: '다음달',
        yearRange: 'c-60:c+10',
        monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        showMonthAfterYear: true,
        yearSuffix: ' '

    }).keyup(function() {
        gfnFormatDate($(this));
    }).focusout(function() {
        if (!$(this).val()) return false;
        gfnCheckDate($(this));
    })

    $('#' + objId).removeClass('wi*').addClass('wi120p');
    if ($('#' + objId).val()) {
        gfnFormatDate($('#' + objId));
    }

    $('#' + objId).css('text-align', 'center');
    if ($('#' + objId).hasClass('required')) {
        $('#' + objId).add($('#' + objId).next()).wrapAll( '<span class="datepickerModule_required"></span>' ).find('img').css('margin', '3px');
    } else {
        $('#' + objId).add($('#' + objId).next()).wrapAll( '<span class="datepickerModule"></span>' ).find('img').css('margin', '3px');
    }

    //$('#' + objId).datepicker.setDefaults($('#' + objId).datepicker.regional['ko']);

}
/**
 * onReady에서 Date객체 호출
 *
 * @param date
 *            객체 id
 * @returns void
 */
function dateTimePickerInit(objId) {
    $('#' + objId).datetimepicker({
        showOn : "both",
        buttonImage : "/resources/images/ico_calendar.gif", // 버튼 이미지
        buttonImageOnly : true,
        buttonText : "", // 날짜선택
        dateFormat : "yy-mm-dd",
        timeFormat: "HH:mm",
        changeYear : true,
        changeMonth : true,
        closeText: '닫기',
        currentText: '오늘',
        prevText: '이전달',
        nextText: '다음달',
        yearRange: 'c-60:c+10',
        monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        showMonthAfterYear: true,
        yearSuffix: ' ',
        showSecond: false,
        stepHour: 1,
        stepMinute: 10,
        timeText: '시간',
        hourText: '시',
        minuteText: '분',
        controlType: 'select',  // 시간 및 분을 스크롤(바꾸려면 slider)이 아닌 드롭다운 메뉴로 선택
        oneLine: true         // 시간과 분을 한 줄에 표시
    }).keyup(function() {
        // gfnFormatDate($(this));
    }).focusout(function() {
        if (!$(this).val()) return false;
    })

    $('#' + objId).removeClass('wi*').addClass('wi120p');
    if ($('#' + objId).val()) {
        gfnFormatDate($('#' + objId));
    }

    $('#' + objId).css('text-align', 'center');
    if ($('#' + objId).hasClass('required')) {
        $('#' + objId).add($('#' + objId).next()).wrapAll( '<span class="datepickerModule_required"></span>' ).find('img').css('margin', '3px');
    } else {
        $('#' + objId).add($('#' + objId).next()).wrapAll( '<span class="datepickerModule"></span>' ).find('img').css('margin', '3px');
    }

    //$('#' + objId).datepicker.setDefaults($('#' + objId).datepicker.regional['ko']);

}

/**
 * datepicker 초기화 후에 init
 * @param obj
 * @returns
 */
function datePickerInitObj(obj) {
    obj.datepicker('destroy');
    obj.datepicker({
        showOn : "both",
        buttonImage : "/resources/images/ico_calendar.gif", // 버튼 이미지
        buttonImageOnly : true,
        buttonText : "", // 날짜선택
        dateFormat : "yy-mm-dd",
        changeYear : true,
        changeMonth : true,
        closeText: '닫기',
        currentText: '오늘',
        prevText: '이전달',
        nextText: '다음달',
        yearRange: 'c-60:c+10',
        monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        showMonthAfterYear: true,
        yearSuffix: ' '

    }).keyup(function() {
        gfnFormatDate(obj);
    }).focusout(function() {
        if (!obj.val()) return false;
        gfnCheckDate(obj);
    });
    obj.removeClass('wi*').addClass('wi120p');
    if (obj.val()) {
        gfnFormatDate(obj);
    }

    obj.css('text-align', 'center');
    if (obj.hasClass('required')) {
        obj.add(obj.next()).wrapAll( '<span class="datepickerModule_required"></span>' ).find('img').css('margin', '3px');
    } else {
        obj.add(obj.next()).wrapAll( '<span class="datepickerModule"></span>' ).find('img').css('margin', '3px');
    }
    //$('#' + objId).datepicker.setDefaults($('#' + objId).datepicker.regional['ko']);

}
//function datePickerInit(objId) {
//    var imgObj = '<a href="javascript:;" onclick="javascript:showCalendar(\'' + objId + '\');"><img src="/resources/images/ico_calendar.gif" /></a>';
//    $('#' + objId).after(imgObj);
//    $('#' + objId).keyup(function() {
//        gfnFormatDate($(this));
//    }).focusout(function() {
//        if (!$(this).val()) return false;
//
//        gfnCheckDate($(this));
//    });
//}

/**
 * 금액 형식 input init
 * onKeyDown : gfnNumberTextBox()
 * onKeyUp   : gfnFormatNumber(this)
 * @param objId
 * @returns
 */
function amtFormatInit(objId) {
    $('#' + objId).keydown(function() {
        gfnNumberTextBox();
    }).keyup(function() {
    	gfnFormatNumber(this);
    });
}
/**
 * 숫자만 입력
 * @param objId
 * @returns
 */
function numberFormatInit(objId) {
    $('#' + objId).keydown(function() {
        gfnNumberTextBox();
    }).keyup(function() {
    	var objTarget = window.event.srcElement || window.event.target;
        var _value = event.srcElement.value;
        if(/[ㄱ-ㅎㅏ-ㅡ가-핳]/g.test(_value)) {
            objTarget.value = "";
            return;
        }
    });
}


/**
 * 년도 콤보
 * @param objId, range
 * @returns
 */
function setYearCombo(objid, range){
	var date = new Date();
	var year = "";
	var com_year = date.getFullYear();
	for(var i=(com_year); i>=(com_year-range);i--){
		$('#'+objid).append("<option value='"+i+"'>"+i+"년</option>");
	}
 }
function setYearCombo2(objid, year, range){
	for(var i=(year); i>=(year-range);i--){
		$('#'+objid).append("<option value='"+i+"'>"+i+"년</option>");
	}
 }
/**
 * 현재월 콤보
 * @param objId, range
 * @returns
 */
function setMonthCombo(objid, month){
	var date = new Date();
	for(var i=1; i<=12;i++){
		
		if(parseInt(month)==i){
			if(i<10){
				$('#'+objid).append("<option value='"+i+"' selected>"+i+"월</option>");
			}else{
				$('#'+objid).append("<option value='"+i+"' selected>"+i+"월</option>");				
			}
		}else{
			if(i<10){
				$('#'+objid).append("<option value='"+i+"'>"+i+"월</option>");
			}else{
				$('#'+objid).append("<option value='"+i+"'>"+i+"월</option>");
			}
		}
	}
 }
function gfnCheckDate(argObject) {
    var s_Date  = argObject.val();
    s_Date = s_Date.replace(/[^0-9]/g,"");
    var i_Year  = 0;
    var i_Month = 0;
    var i_Day   = 0;

    var b_rtn   = true;

    if (s_Date.length != 8) {
        b_rtn = false;}
    else if (s_Date.substr(0,4) < '1900' || s_Date.substr(0,4) > '3000') {
        b_rtn = false;}
    else if (s_Date.substr(4,2) < '01' || s_Date.substr(4,2) > '12') {
        b_rtn = false; }
    else if (s_Date.substr(6,2) < '01' || s_Date.substr(6,2) > '31') {
        b_rtn = false; }
    else {
        i_Year  = parseInt(s_Date.substr(0,4));
        i_Month = parseInt(s_Date.substr(4,2));

        switch (i_Month) {

            case 2:
                i_Day = (!(i_Year % 4) && (i_Year % 100) || !(i_Year % 400)) ? 29 : 28
                break
            case 4: case 6: case 9: case 11:
                i_Day = 30
                break
            default :
                i_Day = 31
        }

        if (i_Day < parseInt(s_Date.substr(6,2))){
            b_rtn = false;}
    }

    if (b_rtn == false) {
        gfnMsgBox('alert', '날짜형식이 정확하지 않습니다.', '유지보수활동관리', function(){
            argObject.val('');
        });
        return(false);
    }
    return(true);
}

/**
 * 날짜 형식 yyyy-mm-dd 
 * @param String
 * @returns
 */
function fn_getDateStrFmt(sDate, sSep)
{
    var isDate = false;
	
	if (sDate == null || sDate == "" || sDate == undefined) {
		return;
	}
    sDate = fn_Trim(sDate);
    if (sSep.length != 1) {
        sSep = "-";
    }
    if (sDate.length == 8) {
        sDate = sDate.substr(0,4) + sSep +
                sDate.substr(4,2) + sSep +
                sDate.substr(6,2);
    }

    return sDate;
}
function fn_Trim(sourceString)
{
	return sourceString.replace(/\s/g,"");
}
/**
 * 날짜 형식 yyyy-mm-dd
 * @param obj
 * @returns
 */
function gfnFormatDate(obj) {
     if( obj.val().length > 10){
         obj.val(obj.val().substr(0, 10));
     }
     var val         = obj.val().replace(/\D/g, '');
     var original    = obj.val().replace(/\D/g, '').length;
     var conversion  = '';
     for(i=0;i<2;i++){
         if (val.length > 4 && i===0) {
             conversion += val.substr(0, 4) + '-';
             val         = val.substr(4);
         }
         else if(original>6 && val.length > 2 && i===1){
             conversion += val.substr(0, 2) + '-';
             val         = val.substr(2);
         }
     }
     conversion += val;
     obj.val(conversion);
}
/**
 * 날짜 형식 yyyy.mm.dd
 * @param value
 * @returns
 */
function gfnFormatDotDate(val) {

    if( val.length > 10){
        val = val.substr(0, 10);
    }
    var val         = val.replace(/\D/g, '');
    var original    = val.replace(/\D/g, '').length;
    var conversion  = '';
    for(i=0;i<2;i++){
        if (val.length > 4 && i===0) {
            conversion += val.substr(0, 4) + '-';
            val         = val.substr(4);
        }
        else if(original>6 && val.length > 2 && i===1){
            conversion += val.substr(0, 2) + '-';
            val         = val.substr(2);
        }
    }
    conversion += val;
    return conversion;
}

/**
 * 천단위 컴마
 * @param obj
 * @returns
 */
function gfnFormatNumber(obj) {
	
    var objTarget = window.event.srcElement || window.event.target;
    var _value = event.srcElement.value;
    if(/[ㄱ-ㅎㅏ-ㅡ가-핳]/g.test(_value)) {
        objTarget.value = "";
        return;
    }

    var szNumber = obj.value;

    var returnValue = "";
    var temp1 = szNumber.replace(/,/g,"");   // 입력 데이터를 숫자 형태로 변환
    var temp = temp1.split('.');

    // 정수자리 원단위로 만들기
    var num1 = "";
    var comma = 1;
    for(var i = temp[0].length -1; i >= 0; i--){
        num1 += temp[0].charAt(i);

        if(comma % 3 == 0 && comma != 0){
            num1 += ",";
        } // end if
        comma++;
    } // end for

    var num2 = "";
    for(var i = num1.length -1; i >= 0; i--){
        num2 += num1.charAt(i);
    } // end for

    // 소수점이 있다면...
    if(temp.length > 1){
        // 소수점 자리 원 단위로 만들어서 리턴..!!
        var num3 = "";
        for(var i=1; i <= temp[1].length; i++){
            num3 += temp[1].charAt(i-1);
        } // end for

            returnValue = num2.replace(/(^,)|(,$)|(?<=-),/g,"") + "." + num3;
    } // end if
    else {
        returnValue = num2.replace(/(^,)|(,$)|(?<=-),/g,"");	// 앞,뒤 콤마 제거
    }

    if(returnValue == "" || returnValue == ".")
        obj.value =  "";
    else
        obj.value = returnValue;

}


/**
 * 숫자키 입력 + "." + "-"
 * @returns  [계좌번호, 날짜, 주민번호, 등등]
 */
function gfnNumberTextBox()
{
    try
    {
        // 허용키 : 0 ~ 9  [상단, numlock]
        if ((window.event.keyCode >= 48 && window.event.keyCode <= 57) || (window.event.keyCode >= 96 && window.event.keyCode <= 105))
        {
            window.event.returnValue = true;
            return;
        }
         //  backspace, Tab, Enter, Ctrl, Esc, 방향키(109, 189), 소숫점 (190, 110)
        if ( window.event.keyCode == 8 || window.event.keyCode == 9 || window.event.keyCode == 13 || window.event.keyCode == 17 || window.event.keyCode == 27 || window.event.keyCode == 109 || window.event.keyCode == 189 || window.event.keyCode == 190 || window.event.keyCode == 110)
        {
            window.event.returnValue = true;
            return;
        }
        // 방향키  Insert Delete
        if ((window.event.keyCode >= 37 && window.event.keyCode <= 40) || window.event.keyCode == 45 || window.event.keyCode == 46)
        {
            window.event.returnValue = true;
            return;
        }
        window.event.returnValue = false;
        return;
    }
    catch ( exception )
    {
        //cfnAlert(exception.description);
        window.event.returnValue = false;
        return;
    }
}

// 달력 듈팁
function gfnCalendarInit() {
//    $('.scheduletable *').tooltip({
//        tooltipClass:'tooltipUI',
//        position: { my: "left top", at: "left top+25" },
//        delay: 0,
//        target: 'mouse',
//        content: function(callback) {
//          callback($(this).prop('title'));
//        }
//      });
}


/**
* 그리드용 주소검색
*/
function gfnPostCodeCheckGrid(row, callbackfunc) {
    new daum.Postcode({
        oncomplete: function(data) {

         // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullAddr = ''; // 최종 주소 변수
            var extraAddr = ''; // 조합형 주소 변수

            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                fullAddr = data.roadAddress;

            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                fullAddr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
            if(data.userSelectedType === 'R'){
                //법정동명이 있을 경우 추가한다.
                if(data.bname !== ''){
                    extraAddr += data.bname;
                }
                // 건물명이 있을 경우 추가한다.
                if(data.buildingName !== ''){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
            }
            data['fullAddr'] = fullAddr;
            // 콜백함수 추가
            if (callbackfunc && callbackfunc != 'null') {
                eval(callbackfunc)(row, data);
            }
        }
    }).open();
}

function gfnNumberFocus(obj) {
    var x = obj.val();
    x = x.replace(/[^0-9]/g,"");
    obj.val(x);
    obj.select();
}
function gfnNumberFocusout(obj) {
    var x = obj.val();
    x = Number(x) + "";
    if(x && x.length > 0) {
        if(!$.isNumeric(x)) {
            x = x.replace(/[^0-9]/g,"");
        }
        x = numberWithCommas(x);
        obj.val(x);
    } else {
        obj.val(0);
    }
}
function gfnNumberKeyup(obj) {
    obj.val(obj.val().replace(/[^0-9]/g,""));
}

//검색조건 저장하기 
function setSearchParameter(formid){
	if(formid == null || formid == ""){
		alert("form아이디가 없습니다.");
		return;
	}
	var key_value = $('#'+formid).serialize();
	if(key_value == ""){
		alert("form데이터가 없습니다.");
		return;
	}	
	$('#SEARCH_PARAMETER').val(key_value);
}

//저장한 검색조건 가져오기
function getSearchParameter(){
	
	
	var s_arr = (decodeURIComponent($('#SEARCH_PARAMETER').val().replace(/\+/g,' '))).split("&");//한글처리	
	var ss_arr = null;
	for(var i=0;i<s_arr.length;i++){
		ss_arr = s_arr[i].split("=");
		if(ss_arr.length == 2){
			$('#'+ss_arr[0]).val(ss_arr[1]);
		}			
	}
}

$.fn.serializeObject = function() {

    var obj = null;

    try {

        // this[0].tagName이 form tag일 경우

        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {

            var arr = this.serializeArray();

            if (arr) {

                obj = {};

                jQuery.each(arr, function() {

                    // obj의 key값은 arr의 name, obj의 value는 value값

                    obj[this.name] = this.value;

                });

            }

        }

    } catch (e) {

        alert(e.message);

    } finally {
    }

    return obj;

};



/**
 * Dialog 결재(상신) 의견   
 * 
 * @param
 * @returns
 */
function gfnOpinionMsg(title, opinion, callbackFunc) {
    var reasonHtml = '<textarea id="gTxtDraftOpinion" rows="5" cols="60" style="resize: none;line-height:1.5" spellcheck="false" placeholder="'+opinion+'"></textarea>';
    $('<div></div>').dialog(
        {
            modal : true,
            resizable : false,
            title : title,
            height : "auto",
            async : false,
            width : 400,
            open : function() {
                $(this).html(reasonHtml);
                //$('#gTxtDraftOpinion').val(opinion);
            },
            buttons : {
                "확인" : function() {
                    var retval = $('#gTxtDraftOpinion').val();
                    
                    //if((title == "반려 의견입력" || title == "관리팀 반려 의견입력")  && retval == ""){
                    //	gfnAlertMsg('반려시 의견입력은 필수입니다.');
                    //	return;
                    //}
                    
                     $(this).dialog("close");
                    if (callbackFunc) {
                        setTimeout(function() {
                            return eval(callbackFunc)(retval); 	// callback 의견내용
                        }, 100);	// 0.1초
                    }
                },
                "취소" : function() {
                    $(this).empty();
                    $(this).remove();
                }
            },
            close : function() {
                $(this).empty();
                $(this).remove();
            }
    });
}

/**
 * 날짜차이 리턴   
 */
function fnDayCount(objFrDt, objToDt){
	
	if (objFrDt.value ==""){
		gfnAlertMsg('시작일을 입력해주세요');
		return;		
	}
	if (objToDt.value ==""){
		gfnAlertMsg('종료일을 입력해주세요');
		return;		
	}
	if (objFrDt.value > objToDt.value){
		gfnAlertMsg('기간 입력이 잘못되었습니다.');
		objFrDt.value = '';
		objToDt.value = '';
		return;		
	}
	
	retVal = fn_CalculateDateDiff(objFrDt.value, objToDt.value);//차이구해오기
	retVal = retVal+1;
	return retVal;
}


/**
 * 날짜차이 계산   
 */
function fn_CalculateDateDiff(sDate, eDate){
	var arrDate;
	var dtStart, dtEnd, dtDiff;
	var iDays;
	var arrSDate = new Array();
	var arrEDate = new Array();
	
	try{
		if(sDate.indexOf("-") == -1){
			arrSDate[0] = sDate.substring(0,4);
			arrSDate[1] = sDate.substring(4,6);
			arrSDate[2] = sDate.substring(6,8);
			arrEDate[0] = eDate.substring(0,4);
			arrEDate[1] = eDate.substring(4,6);
			arrEDate[2] = eDate.substring(6,8);
		}else{
			arrSDate = sDate.split("-");
			arrEDate = eDate.split("-");
		}
		
		dtStart = new Date( fn_GetInt(arrSDate[0]), fn_GetInt(arrSDate[1]) - 1, fn_GetInt(arrSDate[2]) );
		dtEnd = new Date( fn_GetInt(arrEDate[0]), fn_GetInt(arrEDate[1]) - 1, fn_GetInt(arrEDate[2]) );
		
		dtDiff = dtEnd.getTime() - dtStart.getTime();
		iDays = Math.floor(dtDiff/1000/60/60/24);		
	}catch (exception){
		return null;
	}
	return iDays;
}

function fn_GetInt(sNum){
	try{
		for ( var i = 0 ; i < sNum ; i++ ){
			if ( sNum.substring(0, 1) == 0 ){
				sNum = sNum.substring(1, sNum.length);
			}else{
				return parseInt(sNum);
			}
		}
		return parseInt(sNum);
	}catch (exception){}	
}

function fn_RLTrim(strSource){
	return strSource.replace(/(^\s*)|(\s*$)/g,'');
}

/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴
 * @param str : 입력 문자열
 * @param defaultStr : 비어있을 경우 리턴할 기본 문자열
 */
function nvl(str, defaultStr){
	if(typeof str == "undefined" || str == null || str == ""){
    	str = defaultStr ;		
	}     
    return str ;
}

/* 메뉴 즐겨찾기 */
function  gfnMenuFavorite(menu_id) {
	 	var p = new Object();
	 	p.menu_id = menu_id;
	 	if($('#imgMenuFavorite').attr("src") == "/resources/images/star_full.png") {
            p.gbn = "M";
        }else{
            p.gbn = "P";
        }
	 	
		showLoading();	// 로딩바 SHOW
	    try {
	    		ajax.json(
	               	_CONTEXT_PATH + "common/menuFavorite.json",
	                JSON.stringify(p),
	                function(res) {		/* Callback */
	                   if(res && res.successYN == "Y" ) {
	                	   if(res.result == 'INSERT') {			// 즐겨찾기 추가 
   	                	   $('#imgMenuFavorite').attr("src", "/resources/images/star_full.png");
	                	   } else {									// 즐겨찾기 제거 
   	                	   $('#imgMenuFavorite').attr("src", "/resources/images/star_blank.png");
	                	   }
	                	   refreshQuickMenu();
	                	   //setTimeout(function() {hideLoading();}, 200);			// 0.2초 대기 후 진행바 숨기기
	                   } else {
	                      gfnAlertMsg(res.response.message);	// error Message
	                      hideLoading();	// 진행바 숨기기
	                   }
	               },
	               false		// async (true,false) 
	             );	             
	   	} catch(e) {
	   		gfnAlertMsg(e.toString());
	        hideLoading();  	// 진행바 숨기기 
		}		
}		



/* 메뉴 즐겨찾기 삭제 */
function  menuFavoriteDelete(menu_id) {
	 	var p = new Object();
	 	p.menu_id = menu_id;
		showLoading();	// 로딩바 SHOW
		
	    try {
	    		ajax.json(
	               	_CONTEXT_PATH + "common/menuFavoriteDelete.json",
	                JSON.stringify(p),
	                function(res) {		/* Callback */
	                   if(res && res.successYN == "Y" ) {
	                	   if(res.result == 'INSERT') {			// 즐겨찾기 추가 
   	                	   $('#imgMenuFavorite').attr("src", "/resources/images/star_full.png");
	                	   } else {									// 즐겨찾기 제거 
   	                	   $('#imgMenuFavorite').attr("src", "/resources/images/star_blank.png");
	                	   }
	                	   location.href = _CONTEXT_PATH + 'main';			// 메인 페이지 재호출
	                	   setTimeout(function() {hideLoading();}, 200);			// 0.2초 대기 후 진행바 숨기기
	                   } else {
	                      gfnAlertMsg(res.response.message);	// error Message
	                      hideLoading();	// 진행바 숨기기
	                   }
	               },
	               false		// async (true,false) 
	             );	             
	   	} catch(e) {
	   		gfnAlertMsg(e.toString());
	        hideLoading();  	// 진행바 숨기기 
		}		
}	

/* 날짜 셋팅 */
function f_date_select(gd, dp, obj, sd, ed, op){
	var dt = new Date();
	var curr_year = dt.getFullYear();
	var curr_month = dt.getMonth()+1;
	if((curr_month+"").length == 1) curr_month = "0"+curr_month;
	var curr_day = dt.getDate();
	if((curr_day+"").length == 1) curr_day = "0"+curr_day;
	
	dt.setMonth(dt.getMonth()-1);//1달빼기
		
	var pre_year = dt.getFullYear();
	var pre_month = dt.getMonth()+1;
	if((pre_month+"").length == 1) pre_month = "0"+pre_month;
	var pre_day = dt.getDate();
	if((pre_day+"").length == 1) pre_day = "0"+pre_day;
	var last_day = new Date(pre_year, pre_month, 0);
	
	if(obj.selectedIndex == 0){//선택안함,원복처리
		
		if(op == ""){//비우기
			document.getElementById(sd).value = "";
			document.getElementById(ed).value = "";
		}else if(op == "1"){//1달처리
			//document.getElementById(sd).value = pre_year+"-"+pre_month+"-"+pre_day;
			document.getElementById(sd).value = curr_year+"-"+curr_month+"-01";
			document.getElementById(ed).value = curr_year+"-"+curr_month+"-"+curr_day;
		}
	}else if(obj.selectedIndex == 1){//전월1일~말일
		document.getElementById(sd).value = pre_year+"-"+pre_month+"-01";
		document.getElementById(ed).value = pre_year+"-"+pre_month+"-"+last_day.getDate();
	}else if(obj.selectedIndex == 2){//현재년도
		
		document.getElementById(sd).value = obj.value+"-01-01";
		document.getElementById(ed).value = curr_year+"-"+curr_month+"-"+curr_day;
		
	}else{
		
		document.getElementById(sd).value = obj.value+"-01-01";
		document.getElementById(ed).value = obj.value+"-12-31";
	}
	eval(gd).doQuery(eval(dp));
}

/* 기간검색 콤보박스 문자열 */
function date_select_js(gd, dp, sid, sd, ed, op){
	var dt = new Date();
	var year1 = dt.getFullYear();
	var year2 = year1-1;
	var year3 = year1-2;
	var year4 = year1-3;
	var year5 = year1-4;
	
	var str = "<select name=\"date_select\" onchange=\"javaScript:f_date_select('"+gd+"', '"+dp+"', this,'"+sd+"','"+ed+"','"+op+"');\" style=\"width:100px\">";
	str+="	<option value=\"\">기간선택</option>";
	str+="	<option value=\"1M\">전월</option>";
	str+="	<option value=\""+year1+"\">"+year1+"년</option>";
	str+="	<option value=\""+year2+"\">"+year2+"년</option>";
	str+="	<option value=\""+year3+"\">"+year3+"년</option>";
	str+="	<option value=\""+year4+"\">"+year4+"년</option>";
	str+="	<option value=\""+year5+"\">"+year5+"년</option>";
	str+="</select>";		
	
	$('#'+sid).html(str);
}

/** 
 * input 태그 추가
 */
function appendInput(objId, parentId, type, id, name, className, value="", align = "left") {
	
	var inputTag = $("<input>", {
		type: type,
		id: id,
		name: name,
		class: className,
		value: value,
		style: "text-align: " + align
	});
	
	$('#' + objId + ' ' + '#' + parentId).append(inputTag);
}

/**
 * grid >> html table 변환
 */
function gridToHtmlTable(provider, view) {

    var data = provider.getJsonRows(0, -1);
    var column = view.getColumns();

    var sumWidth = 0;
    var filterColumn = column.filter(item => {
        if (item.visible) {
            sumWidth += item.width;
            return true;
        }
        return false;
    });

    var innerHTML = "<table class='tableB'>";

    // 테이블 width 세팅
    innerHTML += "<colgroup>";
    filterColumn.forEach(item => {
        const width = Math.floor(item.width * 100 / sumWidth);
        innerHTML += "  <col width=" + width + "%/>";
    });
    innerHTML += "</colgroup>";

    // tbody 세팅
    innerHTML += "<tbody>";

    // 필드명 추가
    innerHTML += "<tr>";
    filterColumn.forEach(item => {
        const headerText = item.header.text;
        innerHTML += "	<th style=\"text-align:center;padding-left: 10px;font-weight: bold;background:#f4f9f8;border: 1px solid #cacaca\">" + headerText + "</th>";
    });
    innerHTML += "</tr>";

    // 그리드 데이터 추가
    for (var i=0; i < data.length; i++) {
        innerHTML += "<tr>";
        for (var j=0; j < filterColumn.length; j++) {

            var value;
            if (data[i][filterColumn[j].name] != undefined) {
                value = data[i][filterColumn[j].name];
            } else {
                value = "";
            }

            var textAlign = "";
            if (filterColumn[j].styles.textAlignment == "far") {
                textAlign = "right";
            } else if (filterColumn[j].styles.textAlignment == "center") {
                textAlign = "center";
            } else if (filterColumn[j].styles.textAlignment == "near") {
                textAlign = "left";
            }

            innerHTML += "	<td style=\"text-align:" + textAlign + ";border: 1px solid #cacaca;\">" + value + "</td>";
        }
        innerHTML += "</tr>";
    }

    innerHTML += "</tbody>";

    return innerHTML;
}

//그리드 리사이즈 펑션
function commonGridResize(gridId, girdAreaId){
    
    //그리드 전체사이즈 조절
    $("#"+gridId).jqGrid('setGridWidth', $("#"+girdAreaId).width());
            
    //세로스크롤영역 작게        
    $("#"+girdAreaId+" .ui-jqgrid-htable").css("width",$("#"+girdAreaId).width()-11); 
    $("#"+girdAreaId+" .ui-jqgrid-btable").css("width",$("#"+girdAreaId).width()-11);

    //제목과 내용 2번째 컬럼 1px줄이기
    if($("#"+girdAreaId+" .ui-jqgrid-labels")[0]){
        $("#"+girdAreaId+" .ui-jqgrid-labels")[0].children[1].style.width = $("#"+girdAreaId+" .ui-jqgrid-labels")[0].children[1].clientWidth-1+"px";    
    }
    if($("#"+girdAreaId+" .jqgfirstrow")[0]){
        $("#"+girdAreaId+" .jqgfirstrow")[0].children[1].style.width = $("#"+girdAreaId+" .jqgfirstrow")[0].children[1].clientWidth-1+"px";    
    }
}