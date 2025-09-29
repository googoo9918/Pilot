function setPageReadOnly(target){
	// 버튼 삭제
	$('input[type=button], input[type=file], input[type=submit]', target).each(function(){
		if( $(this).data('check-mod') == 'Y' ){
			$(this).hide();
		};
	});
	$('span[data-check-mod=Y], a[data-check-mod=Y]', target).remove();


	// READONLY
	$('input[type=text][data-check-mod=Y], input[type=checkbox][data-check-mod=Y], input[type=radio][data-check-mod=Y], input[type=number][data-check-mod=Y], input[type=email][data-check-mod=Y], select[data-check-mod=Y], textarea[data-check-mod=Y]', target).each(function(){
		if( $(this).is('.datep') ){
			$(this).datepicker('disable');
		}
		$(this).prop('disabled', true).addClass('readonly');
	});

	$('.ui-jqgrid-btable', target).each(function(){
		if( $(this).data('check-mod') == 'Y' ){
			$(this)[0].p.cellEdit = false;
		}
	})
}
/**
 * Null 체크
 *
 * @param data
 * @returns {Boolean}
 */
function isNull(data) {
	if(data == null || data == undefined || data.length == 0) {
		return true;
	} else {
		return false;
	}
}

/**
 *
 * @param sourceString
 * @returns
 */
function gfnTrim(sourceString)
{
	return sourceString.replace(/\s/g,"");
}

/**
 * Null값 치환
 * @param data
 * @returns
 */
function nvl(data) {
	if(isNull(data)) {
		return "";
	}

	return data;
}

/**
 * 왼쪽 채우기
 * @param data
 * @param length
 * @param rep
 * @returns {String}
 */
function lpad(data, length, rep) {
	data = String(data);
	while(data.length < length) {
		data = rep +""+ data;
	}

	return data;
}

function transDateFromApi(data) {
	if( data != '' && data != undefined ){
		var year = data.substring(0,2)*1;
		if( year > 50 ){
			return '19' + data;
		}else{
			return '20' + data;
		}
	}
	return '';
}

function transDateFromPicker(data) {
	if(isNull(data) || data.length != 10) return data;

	return data.substring(6) +"-"+ data.substring(0, 2) +"-"+ data.substring(3, 5);
}
/**
 * 입력값 Byte 계산
 * @param data
 * @returns {Number}
 */
function getLengthb(data) {
    var lengthb = 0;
    for(var i=0; data != null && i<data.length; i++) {
    	var oneChar = escape(data.charAt(i));
    	if(oneChar.length == 1)	{
    		lengthb += 1;
    	} else if(oneChar.indexOf("%u") != -1) {
    		lengthb += 2;
    	} else if(oneChar.indexOf("%") != -1) {
    		lengthb += oneChar.length / 3;
    	}
    }

    return lengthb;
}



/**
 * 입력값 Byte 계산
 * @param data
 * @returns {Number}
 */
function getLengthByte(data) {
    if (!data) return 0;

    // TextEncoder 사용
    if (typeof TextEncoder !== 'undefined') {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(data);
        return encoded.length;
    }

    // encodeURIComponent 사용
    const encodedData = encodeURIComponent(data);
    const match = encodedData.match(/%[89ABab]/g);
    return encodedData.length + (match ? match.length : 0);
}


/**
 * 요소 유효성체크
 * @param eleId
 * @returns
 */
function isValidElement(eleId) {
	var bool = true;
	var msg = "";
	var eleLabel = $("label[for='"+ eleId +"']").html();
	var eleMaxBytes = 0;
	var eleType = $("#"+ eleId).prop("type");

	if($("#"+ eleId).attr("required")) {
		if(isNull($("#"+ eleId).val())) {
			if(eleType.indexOf("text") >= 0) {
				msg += eleLabel +" (은)는 필수 입력값입니다.\n";
			} else if(eleType.indexOf("select") >= 0) {
				msg += eleLabel +" (은)는 필수 선택값입니다.\n";
			}
		}
	}

	if($("#"+ eleId).attr("maxBytes")) {
		eleMaxBytes = $("#"+ eleId).attr("maxBytes");
		eleBytes = getLengthb($("#"+ eleId).val());

		if(eleMaxBytes < eleBytes) {
			msg += eleLabel +" (을)를 "+ $("#"+ id).attr("maxBytes") +"Bytes 이내로 입력하시기 바랍니다. (현재: "+ eleBytes +"Bytes)\n";
		}
	}

	if(!isNull(msg)) {
		alert(msg);
		$("#"+ eleId).focus();
		bool = false;
	}

	return bool;
}


/**
 * API 성공여부 체크
 * @param data
 * @returns {Boolean}
 */
function isApiSuccess(data) {
	if(!isNull(data) && data.responseCode == "200") {
		return true;
	}
	return false;
}

/**
 * Browser 확인하여 창 닫기
 */
function windowClose() {
	var agent = navigator.userAgent.toLowerCase();
	//$.post('/logout.json');
	//if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) { //Explorer
	//	window.close();
	//} else {
		window.open("", "_self").close();
	//}
}


function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function pdfDownload(base64, contentType, fileName){
	var blob = b64toBlob(base64, 'application/pdf');

	if( window.navigator.msSaveOrOpenBlob ){
		window.navigator.msSaveOrOpenBlob(blob);
	}else{
		 //create anchor
        var a = document.createElement("a");
        //set attributes
        a.setAttribute("href", 'data:application/pdf;base64,' + base64);
        a.setAttribute("download", fileName);
        //create click event
        //a.onclick = blob;

        //append, trigger click event to simulate download, remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
	}
}

function openPopupPDF(pdf){
	var w = window.open('/pdfViewer/viewer.html?file=');
	w.addEventListener('load', function () {

	  var res = pdf;

	  var pdfData = base64ToUint8Array(res);
	  w.PDFViewerApplication.open(pdfData);

	  function base64ToUint8Array(base64) {
	    var raw = atob(base64);
	    var uint8Array = new Uint8Array(raw.length);
	    for(var i = 0; i < raw.length; i++) {
	      uint8Array[i] = raw.charCodeAt(i);
	    }
	    return uint8Array;
	  }
	}, true);
}


var JSONUtil = {
	rtn : [],
	rtnHistory : [],
	findKeyInValue : function(json, key, value){
		if( json != null ){
			for( var subKey in json ){
				if( $.type(json[subKey]) == 'string' && json[subKey] == value && subKey == key ){
					JSONUtil.rtn.push( json );
				}else if( $.type(json[subKey]) == 'array' ){
					$.each(json[subKey], function(n,obj){
						JSONUtil.findKeyInValue(obj, key, value);
					});
				}else if( $.type(json[subKey]) == 'object' ){
					JSONUtil.findKeyInValue(json[subKey], key, value);
				}
			}
		}
	},
	findKeyInValueHistory : function(json, key, value){
		if( json != null ){
			for( var subKey in json ){
				if( $.type(json[subKey]) == 'string' && json[subKey] == value && subKey == key ){
					JSONUtil.rtnHistory.push(json);
					return json;
				}else if( $.type(json[subKey]) == 'array' ){
					var val;
					$.each(json[subKey], function(n,obj){
						val = JSONUtil.findKeyInValueHistory(obj, key, value)
						if( val ){
							JSONUtil.rtnHistory.push(json);
							return json;
						};
					});
					if( val ){
						return json;
					}
				}else if( $.type(json[subKey]) == 'object' ){
					if( JSONUtil.findKeyInValueHistory(json[subKey], key, value) ){
						JSONUtil.rtnHistory.push(json)
						return json;
					}
				}
			}
		}
	}
};

// yyyy-mm-dd
function formatDate(date){
	return $.datepicker.formatDate('yy-mm-dd', date);
}
//yyyy-mm-dd hh:mi
function formatTime(date){
	return formatDate(date) + ' ' + lpad(date.getHours(), 2, "0") + ':' + lpad(date.getMinutes(), 2, "0");
}
//yyyy-mm-dd hh:mi:ss
function formatTimeSeconds(date){
	return formatTime(date) + ':' + lpad(date.getSeconds(), 2, "0") ;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


// IMEI Validation
function isIMEI(s) {
	var etal = /^[0-9]{15}$/;
	if (!etal.test(s)){
		return false;
	}
	sum = 0; mul = 2; l = 14;
	for (i = 0; i < l; i++) {
		digit = s.substring(l-i-1,l-i);
		tp = parseInt(digit,10)*mul;
		if (tp >= 10){
			sum += (tp % 10) +1;
		}else{
			sum += tp;
	    }
	    if (mul == 1){
			mul++;
	    }else{
			mul--;
	    }
	}
	chk = ((10 - (sum % 10)) % 10);
	if (chk != parseInt(s.substring(14,15),10)) return false;
	return true;
}

var $root = $('html, body');

/**
* jQuery 확장
*/
(function($){
   $.extend($.fn, {
	   populate: function(jsonObj, option){
		   option = typeof option == 'object' ? option : {};
		   var reset = option.reset != false ? true : false
			   , hasDatepicker =  option.hasDatepicker == true ? true : false;

		   var $form = $(this);
		   if(reset) {
			   $form[0].reset();
			   $form.find('textarea').html('');
		   }

		   $.each(jsonObj, function(key, value){
			   var ele_arr = $form.find('input[id='+key+'], select[id='+key+']').not(':radio').not(':checkbox');
			   if(ele_arr.length == 0) ele_arr = $form.find('input[name='+key+'], select[name='+key+']').not(':radio').not(':checkbox');

			   if( hasDatepicker == true && ele_arr.hasClass('hasDatepicker') ) ele_arr.datepicker( "setDate", value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2) )
			   else  ele_arr.val( value );

			   $form.find('textarea[id='+key+']').html(value);
			   $form.find("p[id=" + key + "]").html(value);
			   $form.find("span[id=" + key + "]").html(value);

			   if( $form.find('input[name='+key+']:radio, input[name='+key+']:checkbox').length > 0 ){
				   var radioList = $form.find('input[name='+key+']:radio, input[name='+key+']:checkbox');
				   $.each(radioList, function(n, radio){
					   if( $(radio).val() == value ){
						   $(radio).attr('checked', true).change();
					   }
				   })
			   }
		   });
	   },
      serializeForm: function(dateformatFunc, excludesEmpty){
    	  var result = {};
    	  var $form = $(this);
    	  var form_id = $(this).attr('id');
    	  var array = $form.serializeArray();
    	  var excludesEmpty = excludesEmpty == true ? true : false;

    	  $.each(array, function(n, obj){
    		  var key = obj['name'];
    		  var val = obj['value'];

			  // 배열인 경우
    		  if( result[key] ){
    			  var tmpObj = result[key];
    			  if( $.type(result[key]) != 'array') {
    				  result[key] = [];
    				  result[key].push(tmpObj);
    			  }
    			  result[key].push(val);
    		  }else{
				  if(excludesEmpty && val == '') return;
    			  result[key] = val;
    		  }
    	  });


    	  if(typeof dateformatFunc == 'function') {
			for(let i = 0; i < $('#' + form_id + ' input.hasDatepicker').length; i++) {
				let obj = $('#' + form_id + ' input.hasDatepicker').eq(i);
				if(obj.datepicker("getDate") == null) continue;

				let date = dateformatFunc(obj.datepicker("getDate"))
				if(typeof date != 'string') continue;

				result[obj.attr('name')] = date;
			}
		  }

    	  return result;
      },
      serializeForm2: function(){
    	  var result = {};
    	  var $form = $(this);
    	  var array = $form.serializeArray();
    	  $.each(array, function(n, obj){
    		  // 배열인 경우
    		  var key = obj['name'];
    		  var val = obj['value'];
    		  if( result[key] ){
    			  var tmpObj = result[key];
    			  if( $.type(result[key]) != 'array') {
    				  result[key] = [];
    				  result[key].push(tmpObj);
    			  }
    			  result[key].push(val);
    		  }else{
    			  if(val == "") val = "NULL";
    			  result[key] = val;
    		 }
    	  });
    	  return result;
      }
   });
})(jQuery);

String.prototype.toDate = function(format)
{
  var normalized      = this.replace(/[^a-zA-Z0-9]/g, '-');
  var normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');

  var monthIndex  = normalizedFormat.indexOf("mm");
  var dayIndex    = normalizedFormat.indexOf("dd");
  var yearIndex   = normalizedFormat.indexOf("yyyy");
  var hourIndex     = normalizedFormat.indexOf("hh");
  var minutesIndex  = normalizedFormat.indexOf("ii");
  var secondsIndex  = normalizedFormat.indexOf("ss");

  var today = new Date();
  var year  = yearIndex>-1  ? this.substr(yearIndex, 4)    : today.getFullYear();
  var month = monthIndex>-1 ? this.substr(monthIndex,2)-1 : today.getMonth()-1;
  var day   = dayIndex>-1   ? this.substr(dayIndex,2)     : today.getDate();

  var hour    = hourIndex>-1      ? this.substr(hourIndex,2)    : today.getHours();
  var minute  = minutesIndex>-1   ? this.substr(minutesIndex,2) : today.getMinutes();
  var second  = secondsIndex>-1   ? this.substr(secondsIndex,2) : today.getSeconds();

  return new Date(year,month,day,hour,minute,second);
};

/**
*
*  UTF-8 data encode / decode
*  http://www.webtoolkit.info/
*
**/

var Utf8 = {
   // public method for url encoding
   encode : function(str) {
	    var s0, i, s, u;
	    s0 = "";                // encoded str
	    for (i = 0; i < str.length; i++){   // scan the source
	        s = str.charAt(i);
	        u = str.charCodeAt(i);          // get unicode of the char
	        if (s == " "){s0 += "+";}       // SP should be converted to "+"
	        else {
	            if ( u == 0x2a || u == 0x2d || u == 0x2e || u == 0x5f || ((u >= 0x30) && (u <= 0x39)) || ((u >= 0x41) && (u <= 0x5a)) || ((u >= 0x61) && (u <= 0x7a))){       // check for escape
	                s0 = s0 + s;            // don't escape
	            }
	            else {                  // escape
	                if ((u >= 0x0) && (u <= 0x7f)){     // single byte format
	                    s = "0"+u.toString(16);
	                    s0 += "%"+ s.substr(s.length-2);
	                }
	                else if (u > 0x1fffff){     // quaternary byte format (extended)
	                    s0 += "%" + (oxf0 + ((u & 0x1c0000) >> 18)).toString(16);
	                    s0 += "%" + (0x80 + ((u & 0x3f000) >> 12)).toString(16);
	                    s0 += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
	                    s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
	                }
	                else if (u > 0x7ff){        // triple byte format
	                    s0 += "%" + (0xe0 + ((u & 0xf000) >> 12)).toString(16);
	                    s0 += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
	                    s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
	                }
	                else {                      // double byte format
	                    s0 += "%" + (0xc0 + ((u & 0x7c0) >> 6)).toString(16);
	                    s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
	                }
	            }
	        }
	    }
	    return s0;
   },
   // public method for url decoding
   decode : function(str) {
	    var s0, i, j, s, ss, u, n, f;
	    s0 = "";                // decoded str
	    for (i = 0; i < str.length; i++){   // scan the source str
	        s = str.charAt(i);
	        if (s == "+"){s0 += " ";}       // "+" should be changed to SP
	        else {
	            if (s != "%"){s0 += s;}     // add an unescaped char
	            else{               // escape sequence decoding
	                u = 0;          // unicode of the character
	                f = 1;          // escape flag, zero means end of this sequence
	                while (true) {
	                    ss = "";        // local str to parse as int
	                        for (j = 0; j < 2; j++ ) {  // get two maximum hex characters for parse
	                            sss = str.charAt(++i);
	                            if (((sss >= "0") && (sss <= "9")) || ((sss >= "a") && (sss <= "f"))  || ((sss >= "A") && (sss <= "F"))) {
	                                ss += sss;      // if hex, add the hex character
	                            } else {--i; break;}    // not a hex char., exit the loop
	                        }
	                    n = parseInt(ss, 16);           // parse the hex str as byte
	                    if (n <= 0x7f){u = n; f = 1;}   // single byte format
	                    if ((n >= 0xc0) && (n <= 0xdf)){u = n & 0x1f; f = 2;}   // double byte format
	                    if ((n >= 0xe0) && (n <= 0xef)){u = n & 0x0f; f = 3;}   // triple byte format
	                    if ((n >= 0xf0) && (n <= 0xf7)){u = n & 0x07; f = 4;}   // quaternary byte format (extended)
	                    if ((n >= 0x80) && (n <= 0xbf)){u = (u << 6) + (n & 0x3f); --f;}         // not a first, shift and add 6 lower bits
	                    if (f <= 1){break;}         // end of the utf byte sequence
	                    if (str.charAt(i + 1) == "%"){ i++ ;}                   // test for the next shift byte
	                    else {break;}                   // abnormal, format error
	                }
	            s0 += String.fromCharCode(u);           // add the escaped character
	            }
	        }
	    }
	    return s0;
   }
}


/**
 *
 * @param value
 * @returns
 */
function isDate(value) {
    switch (typeof value) {
        case 'number':
            return true;
        case 'string':
            return !isNaN(Date.parse(value));
        case 'object':
            if (value instanceof Date) {
                return !isNaN(value.getTime());
            }
        default:
            return false;
    }
}

/**
 * Undefined 체크
 *
 * @param obj
 * @returns {Blooean}
 */
function checkUndefined(obj) {
    return obj === void 0;
}

/**
 * Undefined To ""
 *
 * @param obj
 * @returns {obj or ""}
 */
function convertUndefinedToString(obj, rtn) {
    if(checkUndefined(obj)){
        if(checkUndefined(rtn)){
            return "";
        } else {
            return rtn;
        }
    } else {
        return obj;
    }
}

/**
 * Null을  치환
 * @param data
 * @returns {data}  NULL 또는 undefined 일 경우  ""을 리턴
 */
function nullToEmptyString(data) {
  return isNull(data) ? "" : data;
}

/**
 * 빈값 여부를 체크
 *
 * @param data
 * @returns {Boolean}
 */
function isEmptyValue(data) {
  return data === undefined || data === null || (typeof data === 'object' && Object.keys(data).length === 0) || data.length === 0;
}

/**
 * 현재 시간을 년월일시분초로 리턴
 *
 * @returns {String}
 */
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작하므로 1을 더합니다.
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hour}${minute}${second}`;
}
