var ajax = {

    // HTML 요청 처리
    getHTML: function(url, params = {}, successCallback = null) {
        showLoading();

        setTimeout(function() {
            var ajaxOptions = {
                url: url,
                type: 'GET',
                data: params,
                dataType: 'html',
                success: function (response) {
                    if (successCallback) {
                        successCallback(response); // 성공 시 HTML 처리 콜백
                    } else {
                        $('#contentWrap').html(response); // 기본적으로 HTML 삽입
                    }
                },
                error: function (xhr, status, error) {
                    debugger;
                    if (xhr.status === 401) {
                        var response = JSON.parse(xhr.responseText);
                        let redirectUrl = response.redirectUrl;
                        var message = '세션이 만료되어 로그인 페이지로 이동합니다.';
                        hideLoading()
                        if (redirectUrl) {
                            gfnAlertMsg2(message, function () {
                                window.location.href = redirectUrl;
                            });
                            return;
                        }
                    }
                    $('#contentWrap').load('/error-page'); // HTML 에러 페이지 로드
                },
                complete: function(){
                    // hideLoading();
                }
            };

            $.ajax(ajaxOptions);
        }, 200)
    },

    // 에러 처리 함수
    handleError: function(xhr, status, error) {
        const defaultMessage = '서버 에러가 발생하였습니다. 관리자에게 문의하여 주십시오.';
        const errorCode = xhr.status;
        let parsed = null;

        try {
            parsed = JSON.parse(xhr.responseText);
        } catch (e) {
            // 파싱 실패
            gfnAlertMsg(defaultMessage)
        }
        const message = parsed?.errorMessage || defaultMessage;
        // 세션 에러
        if (errorCode === 401) {
            const redirectUrl = parsed?.redirectUrl;
            if (redirectUrl) {
                gfnAlertMsg2(message, function () {
                    window.location.href = redirectUrl;
                });
            } else {
                gfnAlertMsg(message);
            }
        // 400번대 에러
        } else if (errorCode >= 400 && errorCode < 500) {
            gfnAlertMsg(message);
        // 500번대 에러
        } else {
            gfnAlertMsg(message);
        }
    }
    ,

    // GET 요청 처리
    getRequest: function(url, data = {}, successCallback = null) {
        var ajaxOptions = {
            url: url,
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function(response) {
                if (successCallback) {
                    successCallback(response);
                }
            },
            error: function(xhr, status, error) {
                ajax.handleError(xhr, status, error);
            }
        };

        $.ajax(ajaxOptions);
    },

    // POST 요청 처리
    postRequest: function(url, data = {}, successCallback = null) {

        var ajaxOptions = {
            url: url,
            type: 'POST',
            dataType: 'text',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                if (successCallback) {
                    successCallback(response); // 성공 시 콜백
                }
            },
            error: function(xhr, status, error) {
                ajax.handleError(xhr, status, error);
            },
            complete: function(){
                hideLoading();
            }
        };

        $.ajax(ajaxOptions);
    }
    ,
    // PUT 요청 처리
    putRequest: function(url, data = {}, successCallback = null) {

        var ajaxOptions = {
            url: url,
            type: 'PUT',
            dataType: 'text',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                if (successCallback) {
                    successCallback(response); // 성공 시 콜백
                }
            },
            error: function(xhr, status, error) {
                ajax.handleError(xhr, status, error);
            }
        };

        $.ajax(ajaxOptions);
    }
    ,
    // DELETE 요청 처리
    deleteRequest: function(url, data = {}, successCallback = null) {

        var ajaxOptions = {
            url: url,
            type: 'DELETE',
            dataType: 'text',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                if (successCallback) {
                    successCallback(response); // 성공 시 콜백
                }
            },

            error: function(xhr, status, error){
                ajax.handleError(xhr, status, error);
            }
        };

        $.ajax(ajaxOptions);
    }
    ,
    /**
     * ajax call xss filter   ( &, <, > ) 치환
     */
    entityMap : { '&': '&amp;', '<': '&lt;', '>': '&gt;' },
    escapeHtml : function  (str) {
        return String(str).replace(/[&<>]/g, function (s) { return ajax.entityMap[s]; });
    },

    stackLoading : 0,
    post : function(url, param, fnCallback) {
        return $.post(url, param, fnCallback);
    },
    get : function(url, param, fnCallback) {
        return $.ajax({
            url : url,
            data :param,
            type : 'get',
            contentType : "application/html; charset=UTF-8",
            success : function(data) {
                fnCallback(data);
            }
        });
    },
    json : function(url, param, fnCallback, doAsync) {

    	try {
    	    if( $.type(param) == 'object' ){
	            param["currentMenuId"] = _CURRENT_MENU_ID;
	            param = JSON.stringify(param);
	        } else {
	            param = JSON.parse(param);
	            param["currentMenuId"] = _CURRENT_MENU_ID;
	            param = JSON.stringify(param);
	        }

	        if (doAsync) {
	            setAsync = doAsync;
	        } else {
	            setAsync = false;
	        }

            // ajax 호출 전  세션체크 후 logout.do 이동
            if (!gfnSessionCheck()) return false;

	        return $.ajax({
	            url : url,
	            data : param,			// 최종 전송 전 replace
	            type : 'post',
	            dataType : 'json',
	            async : setAsync, // false면 순차적 실행
	            contentType : "application/json; charset=UTF-8",
	            success : function(data) {
                    if (data.successYN == 'N' && data.response.code == 'M001') { //세션아웃
                        hideLoading();
                        gfnAlertMsg2(data.response.message, function() {
                            setTimeout(function() {
                                //세션이 종료되면 창 닫기
                                window.open('', '_self').close();
                                //온프라미스 로그인페이지가  존재 할 경우
                                //top.location.href = _CONTEXT_PATH + 'index';
                            }, 200)
                        });
                    } else {
                        fnCallback(data);
                    }
	            }
	        });
    	} catch (err) {
    		hideLoading();
    	}
    },

    // updateDiv : function(url, param, divId, fnCallback, doAsync) {
    //
    //     if (doAsync) {
    //         setAsync = doAsync;
    //     } else {
    //         setAsync = false;
    //     }
    //
    //     // ajax 호출 전  세션체크 후 logout.do 이동
    //     // if (!gfnSessionCheck()) return false;
    //     return $.ajax({
    //         url : url,
    //         data : param,
    //         type : 'get',
    //         async : setAsync,
    //         success : function(strHtml) {
    //             $('#' + divId).html(strHtml);
    //             try{
    //                 if( fnCallback ){
    //                     fnCallback();
    //                 }
    //             }catch(e){
    //                 alert('Script error has occurred.');
    //                 //console.error(e);
    //             }
    //         },
    //         error: function(xhr, status, error) {
    //             if (xhr.status === 401) {
    //                 var response = JSON.parse(xhr.responseText);
    //                 let redirectUrl = response.redirectUrl;
    //                 var message = '세션이 만료되어 로그인 페이지로 이동합니다.';
    //                 if(redirectUrl){
    //                     gfnAlertMsg2(message, function() {
    //                         window.location.href = redirectUrl;
    //                     });
    //                     return;
    //                 }
    //             }
    //             $('#' + divId).load('/error'); // HTML 에러 페이지 로드
    //         }
    //     });
    // },
    updateDiv : function(url, param, divId, fnCallback, doAsync) {

        if (doAsync) {
            setAsync = doAsync;
        } else {
            setAsync = false;
        }

        // ajax 호출 전  세션체크 후 logout.do 이동
        // if (!gfnSessionCheck()) return false;

        return $.ajax({
            url : url,
            data : param,
            type : 'get',
            async : setAsync,
            success : function(strHtml) {
                $('#' + divId).html(strHtml);
                try{
                    if( fnCallback ){
                        fnCallback();
                    }
                }catch(e){
                    alert('Script error has occurred.');
                    //console.error(e);
                }
            }
        });
    },
    updateDivForExcel : function(url, param, divId, fnCallback, doAsync) {

        if (doAsync) {
            setAsync = doAsync;
        } else {
            setAsync = false;
        }

        // ajax 호출 전  세션체크 후 logout.do 이동
        // if (!gfnSessionCheck()) return false;

        return $.ajax({
            url : url,
            data : param,
            type : 'post',
            async : setAsync,
            success : function(strHtml) {
                $('#' + divId).html(strHtml);
                try{
                    if( fnCallback ){
                        fnCallback();
                    }
                }catch(e){
                    alert('Script error has occurred.');
                    //console.error(e);
                }
            }
        });
    },

    formData : function(url, param, fnCallback, doAsync) {	// formData   (첨부파일 업로드)

        // if (doAsync) {
        //     setAsync = doAsync;
        // } else {
        //     setAsync = false;
        // }
        //
        // // ajax 호출 전  세션체크 후 logout.do 이동
        // if (!gfnSessionCheck()) return false;

        return $.ajax({
            url: url,								// url = include file parameter로 받아서 검토
            processData: false,
            contentType: false,
            data: param,
            type: 'POST',
            success : function(data) {
                try{
                    if(fnCallback) {
                        fnCallback(data);
                    }
                } catch(e){
                    alert('Script error has occurred.');
                    //console.error(e);
                }
            },
            error : function (jqXHR, textStatus, err) {
            	gfnAlertMsg('서버 에러가 발생하였습니다. 관리자에게 문의하여 주십시오.');
            	hideLoading();	// 열려있으면 숨김
            }
        });
    }
}


function getType(p) {
    if (Array.isArray(p)) return 'array';
    else if (typeof p == 'string') return 'string';
    else if (p != null && typeof p == 'object') return 'object';
    else return 'other';
}

function jsonToParameter(jsonObj){
    var rtn = '';
    for( var key in jsonObj ){
        rtn += key + '=' + jsonObj[key] + '&';
    }
    if( rtn.length > 0 ){
        rtn = rtn.substring(0, rtn.length-1);
    }
    return rtn;
}

// $.ajaxSetup({
//     beforeSend : function(jqXHR, settings) {
//         // var addtionalParam = 'currentMenuId='+_CURRENT_MENU_ID;
//         // addtionalParam += '&dt=' + new Date().getTime()
//         if(settings.url.indexOf("?") > -1) {
//             settings.url = settings.url + '&'+addtionalParam;
//         }else{
//             settings.url = settings.url + '?' + addtionalParam;
//         }
//         showLoading();
//     },
//     complete : function() {
//         hideLoading();
//     },
//     error :function(jqXHR, textStatus, errorThrown) {
//         hideLoading(true);
//     }
//
// });