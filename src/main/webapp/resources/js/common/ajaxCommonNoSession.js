var ajax = {

    /**
     * ajax call xss filter   ( &, <, > ) 치환
     */
    entityMap : { '&': '&amp;', '<': '&lt;', '>': '&gt;' },
    escapeHtml : function  (str) {
        return String(str).replace(/[&<>]/g, function (s) { return ajax.entityMap[s]; });
    },

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

            console.log("AJAX 전 요청 URL:", url);

            return $.ajax({
	            url : url,
	            data : param,			// 최종 전송 전 replace
	            type : 'post',
	            dataType : 'json',
	            async : setAsync, // false면 순차적 실행
	            contentType : "application/json; charset=UTF-8",
	            success : function(data) {
                    if( data && data.exceptionMsg){
	                    alert( data.exceptionMsg);
	                    // main으로 이동  >> spa 환경에서 script  오류가 전역적으로 영향을 미치기 때문에 main으로 이동하여 오류가 없는 상태로 reload
	                    location.href = _CONTEXT_PATH + _CURRENT_MAIN_PAGE;
	                } else {
	                    try {
	                        fnCallback(data);
	                    } catch(e) {
	                    	alert( e.toString());
	                    	//alert('Script error has occurred.'); 	// 스크립트 오류가 발생하였습니다
	                        // main으로 이동  >> spa 환경에서 script  오류가 전역적으로 영향을 미치기 때문에 main으로 이동하여 오류가 없는 상태로 reload
	                    	location.href = _CONTEXT_PATH + _CURRENT_MAIN_PAGE;
	                    }
	                }
	            }
	        });
    	} catch (err) {}
    },
    
    
    jsonNoSession : function(url, param, fnCallback, doAsync) {

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

        return $.ajax({
            url : url,
            data : param,			// 최종 전송 전 replace
            type : 'post',
            dataType : 'json',
            async : setAsync, // false면 순차적 실행
            contentType : "application/json; charset=UTF-8",
            success : function(data) {
                if( data && data.exceptionMsg){
                    alert( data.exceptionMsg);
                    // main으로 이동  >> spa 환경에서 script  오류가 전역적으로 영향을 미치기 때문에 main으로 이동하여 오류가 없는 상태로 reload
                    location.href = _CONTEXT_PATH + _CURRENT_MAIN_PAGE;
                } else {
//                    try {
                        fnCallback(data);
//                    } catch(e) {
//                        alert('Script error has occurred.'); 	// 스크립트 오류가 발생하였습니다
//                        // main으로 이동  >> spa 환경에서 script  오류가 전역적으로 영향을 미치기 때문에 main으로 이동하여 오류가 없는 상태로 reload
//                        location.href = _CONTEXT_PATH + 'main.do';
//                    }
                }
            }
        });
    },
    
    updateDiv : function(url, param, divId, fnCallback, doAsync) {

        if (doAsync) {
            setAsync = doAsync;
        } else {
            setAsync = false;
        }

        return $.ajax({
            url : url,
            data : param,
            type : 'get' ,
            async : setAsync,
            //contentType : "application/html; charset=UTF-8",
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

        if (doAsync) {
            setAsync = doAsync;
        } else {
            setAsync = false;
        }

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
            }
        });
    },

    api : {
        url : _CONTEXT_PATH + 'api/sendApi.do',
        send : function(apiInfo, apiData, fnCallback, fnErrorCallback, doAsync) {

            if (doAsync) {
                setAsync = doAsync;
            } else {
                setAsync = false;
            }

            return $.ajax({
                url : this.url,
                data : JSON.stringify([ apiInfo, apiData ]),
                method : 'post',
                dataType : 'json',
                async : setAsync,
                contentType : "application/json; charset=UTF-8",
                success : function(data) {
                    if( data.responseCode == 'sessionInvalid'){
                        alert( data.errorMsg );
                        windowClose();
                    }else if (data.responseCode != "200") {
                        // Java 에러
                        alert('An error has occurred. '); // 에러가 발생하였습니다.\n관리자에게 문의하여 주십시오.
                        //console.error(apiInfo.apiId + ' 전송 실패\n(실패사유 : ' + data.responseDesc + ')');
                        if (fnErrorCallback) {
                            try {
                                fnErrorCallback(data);
                            } catch (e) {
                                console.error('api.send - callback function error');
                            }
                        }
                    } else {
                        // API 에러
                        if (data.response.Fault) {
                            // 에러메세지
                            var strFaultMessage = data.response.Fault.faultstring;
                            if (data.response.Fault.detail.errors) {
                                strFaultMessage += "\n";
                                $.each(data.response.Fault.detail.errors.error,
                                        function(n, error) {
                                            strFaultMessage += ' - ' + error.message + '\n';
                                });
                            }
                            alert(strFaultMessage);

                            if(fnErrorCallback) {
                                try {
                                    fnErrorCallback(data);
                                } catch (e) {
                                    console.error('api.send - callback function error');
                                }
                            }
                        } else {
                            // 정상 실행
                            try {
                                fnCallback(data);
                            } catch(e) {
                                console.error('api.send - callback function error');
                                console.error(e);
                            }
                        }
                    }

                }
            });
        },
        // API 에러 메세지를 무시함.
        // ( 데이터가 없습니다 등등 )
        inquiry : function(apiInfo, apiData, fnCallback, fnErrorCallback, doAsync) {

            if (doAsync) {
                setAsync = doAsync;
            } else {
                setAsync = false;
            }

            return $.ajax({
                url : this.url,
                data : JSON.stringify([ apiInfo, apiData ]),
                method : 'post',
                dataType : 'json',
                async : setAsync,
                contentType : "application/json; charset=UTF-8",
                success : function(data) {
                    if( data.responseCode == 'sessionInvalid') {
                        alert( data.errorMsg );
                        windowClose();
                    } else if (data.responseCode != "200") {
                        // Java 에러
                        alert('에러가 발생하였습니다.\n관리자에게 문의하여 주십시오.');
                        console.error(apiInfo.apiId
                                + ' 전송 실패\n(실패사유 : '
                                + data.responseDesc + ')');
                        if(fnErrorCallback) {
                            try {
                                fnErrorCallback(data);
                            } catch (e) {
                                console.error('api.send - callback function error');
                            }
                        }
                    } else {
                        // 정상 실행
                        try {
                            fnCallback(data);
                        } catch (e) {
                            alert('스크립트 오류가 발생하였습니다.');
                            console.error('api.send - callback function error');
                            console.error(e);
                        }
                    }

                }
            });
        }
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
//         console.log("beforeSend 내부 최종 URL:", settings.url);
//     },
//     complete : function() {},
//     error :function(jqXHR, textStatus, errorThrown) {}
// });
