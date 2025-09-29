
// 달력을 Open하여 일자를 Setting한다.
var CalView = "";
var ObjPath;
var ObjDest;
function OpenCal(ObjectSrc){
    //ObjPath = eval(Paths);
    ObjDest = ObjectSrc;
    scr_width  = screen.availWidth  / 2  - 72;
    scr_height = screen.availHeight / 2  - 20;

    CalView = window.open("/ebillsWeb/Calendar.htm", "",
               "toolbar=0,location=0,directories=0,status=1,scrollbars=0,resizable=0,copyhistory=0,width=145,height=145,left="+scr_width+",top="+scr_height + "");
    CalView.focus();
}
function appDate(){
   //if (CalView != "[Object]")
      ObjDest.value = CalView;
}

// Description	: 넘겨진 Argument의 Data 유형을 체크한다.
// argObject	: Argument Object
// argMsg		: 출력할 메시지
// argType		: (D)date , (N)umeric, (A)lphaNumeric, (H)angul, (S)pecial Char with AN
function check_data_type(argObject, argMsg, argType) {
    var intStrLen = 0;
    var intErr;
    var strValue = argObject.val();

    for (i=0; i<strValue.length; i++) {
        var retCode = strValue.charCodeAt(i);
        var retChar = strValue.substr(i,1).toUpperCase();

        var str = "";

        switch (argType) {
            case "D" :
                if ((retChar < "0" || retChar > "9") && !(retChar == "." || retChar == "/" || retChar == "-")) {
                    intErr = -1; str = "날짜";
                }
                break;
            case "N" :
                if ((retChar < "0" || retChar > "9") && !(retChar == "." || retChar == "-")) {
                    intErr = -1; str = "숫자";
                }
                break;
            case "A" :
                if ((retChar < "0" || retChar > "9") && (retChar < "A" || retChar > "Z")) {
                    intErr = -1; str="문자";
                }
                break;
            case "S" :
                if ((retChar < "0" || retChar > "9") && (retChar < "A" || retChar > "Z")) {
                    if ((retChar != " ")) intErr = -1;
                }
                break;
            case "H" :
                if (retCode > 0 && retCode < 127) {
                    intErr = -1;
                }
                break;
        }

        if (intErr == -1) {
            gfnAlertMsg(argMsg + str + "을(를) 정확하게 입력하십시오. '" + retChar +"'은(는) 사용할 수 없습니다.")
            argObject.focus();
            argObject.select();
            return(false);
        }
    }
    return(true);

    // Netscape Or 이거나 영숫자일 경우 MaxLength에서 Check!
    if (navigator.appName != "Netscape" && argType == "H") {
        for (i=0; i<strValue.length; i++) {
            retCode = strValue.charCodeAt(i);
            intStrLen = (retCode > 255) ? intStrLen + 2 : intStrLen + 1;
        }

        if (intStrLen > argMaxLen) {
            gfnAlertMsg(argMsg + "을(를) 정확하게 입력하십시오. 최대길이를 초과했습니다.");
            argObject.focus(); argObject.select(); return(false);
        }
    }
    return(true)
}

// 유리수 체크
function amt_comma(argObject){
    var ls_amt1  = "";
    var ls_amt2  = "";
    var sign="";
    ls_amt1 = argObject.val();

    if(ls_amt1.substring(0,1) =="-")
        sign = "-";
    for(var i= 0; i< ls_amt1.length+1; i++){
        if (ls_amt1.substring(i,i+1) >= "0" &&
            ls_amt1.substring(i,i+1) <= "9" ||
            ls_amt1.substring(i,i+1) == "." ||
            ls_amt1.substring(i,i+1) == "-") {

            ls_amt2 = ls_amt2 + ls_amt1.substring(i,i+1);
        }
    }

    argObject.val(ls_amt2);

    return(true);
}

function amt_no_comma(argObject) {
    var ls_amt1 = argObject.val();
    var ls_amt2 = ls_amt1;

    if (ls_amt1.substring(0,1)=="-")
       ls_amt2 = ls_amt1.substring(1);

    var point = ls_amt2.indexOf('.');
    if (point == -1) point = ls_amt2.length;

    //  숫자유효성 체크
    //  function check_data_type(argObject,argMsg,argType) {
    if (!check_data_type(argObject,"금액","N")) return false

    var ret = "";
    var cnt = 1;

    for (var i = ls_amt2.length-1; i >= 0; i--) {
        if (point <= i) {
            ret = ls_amt2.charAt(i) + ret;
        } else {
            if (cnt == 4) {
                ret = ',' + ret;
                cnt = 1;
            }
            cnt++;
            ret = ls_amt2.charAt(i) + ret;
        }
    }
    if (ls_amt1.substring(0,1)=="-")
        ret = "-" + ret;
    argObject.val(ret);
}

function amt_no_comma2(argObject) {
    var ls_amt1 = argObject.val();
    var ls_amt2 = ls_amt1;

    if (ls_amt1.substring(0,1)=="-")
        ls_amt2 = ls_amt1.substring(1);

    var point = ls_amt2.indexOf('.');
    if (point == -1) point = ls_amt2.length;

    var ret = "";
    var cnt = 1;

    for (var i = ls_amt2.length - 1; i >= 0; i--) {
        if (point <= i) {
            ret = ls_amt2.charAt(i) + ret;
        } else {
            if (cnt == 4) {
                ret = ',' + ret;
                cnt = 1;
            }
            cnt++;
            ret = ls_amt2.charAt(i) + ret;
        }
    }

    if (ls_amt1.substring(0,1)=="-")
        ret = "-" + ret;
    argObject.val(ret);
}


// 날짜의 null check 및 유효성(1900년 부터 3000년까지, 윤년 등) 체크
// function check_date2(Object,Object 명,null 허용여부)
function check_date2(argObject,argMsg,argNull) {
    var s_Date  = argObject.val();
    var i_Year  = 0;
    var i_Month = 0;
    var i_Day   = 0;

    if (argNull == true && (s_Date == null || s_Date == "")) {
        return(true); }

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
        gfnAlertMsg(argMsg + "을(를) 정확하게 입력하십시오.");
        argObject.focus(); argObject.select();return(false);
    }
    return(true);
}


// 날짜의 null check 및 유효성(1900년 부터 3000년까지, 윤년 등) 체크
// function check_date3(Object,Object 명)
// 날짜 형식 yyyy.mm 체크
function check_date3(argObject,argMsg) {
    var s_Date  = removeFmt(argObject.val());
    var i_Year  = 0;
    var i_Month = 0;

    if (s_Date == null || s_Date == "") {
        return(true);
    }

    var b_rtn   = true;

    if (s_Date.length !=6 )	{
        b_rtn =	false;}
    else if	(s_Date.substr(0,4)	< '1900' ||	s_Date.substr(0,4) > '3000') {
        b_rtn =	false;}
    else if	(s_Date.substr(4,2)	< '01' || s_Date.substr(4,2) > '12') {
        b_rtn =	false; }

    if (b_rtn == false) {
        var msg = argMsg + "을(를) 정확하게 입력하십시오.";
        gfnMsgBox('alert', msg, '유지보수활동관리', function(){
            argObject.focus(); argObject.select(); argObject.val('');
        });
        return(false);
    }else {
        s_Date = s_Date.substring(0, 4) + "." + s_Date.substring(4,6);
        argObject.val(s_Date);
    }
    return(true);
}



function check_area_code(argObject,argMsg) {
    if (argObject.val() == "") {
        gfnAlertMsg(argMsg + "이(가) 입력되지 않았습니다.")
        if(argObject.type != "select-one") {
            argObject.focus();
            argObject.select();
        }
        else {
            argObject.focus();
        }
        return(false);
    }
    return(true);
}

//Check_length
function check_data_length(argObject,argMsg,argMin) {
    if (argObject.val().substr(0,1) == " ") {
        gfnAlertMsg(argMsg + "의 첫 자리는 SPACE가 올 수 없습니다.");
        argObject.focus(); argObject.select(); return(false);
    } else if (argObject.val() == "" || argObject.val().length < argMin) {
        gfnAlertMsg(argMsg + "의 길이는 "+argMin+"자리 이상이어야 합니다.")
    }
    return(true);
}

// 한글이 입력되지 않아야 하는 필드를 체크.
function check_no_han(argObject){
    var intStrLen = 0;
    var intErr;
    var strValue = argObject.val();

    for (i = 0; i < strValue.length; i++) {
        var retCode = strValue.charCodeAt(i);
        var retChar = strValue.substr(i,1).toUpperCase();
        str = "";

        if (!(retCode > 0 && retCode < 127) ){
            intErr = -1;
            break;
        }
    }

    if (intErr == -1) {
        gfnAlertMsg( argObject.nameKor + "을(를) 정확하게 입력하십시오. '" + retChar +"'은(는) 사용할 수 없습니다.")
        argObject.focus(); argObject.select(); return(false);
    }
    return (true);
}

function check_email(argObject){

    var strEmail = argObject.val();

    // email내에 '@'나 '.'이 없으면
    if ((strEmail.indexOf("@", 0) == -1) || (strEmail.indexOf(".", 0) == -1)) {
        gfnAlertMsg('e-mail을 정확히 입력하십시오.');
        argObject.focus(); argObject.select(); return(false);
    }

    // email내에 AlphaNumeric, '@', '.', '-','_' 이외의 문자가 있으면
    for (i = 0; i < strEmail.length; i++) {
        var ch = strEmail.substr(i,1);
        if ((ch < "0" || ch > "9") && (ch < "A" || ch > "Z") && (ch < "a" || ch > "z") && (ch != "@") && (ch != "_")  && (ch != ".") && (ch != "-")) {
            gfnAlertMsg('E-Mail을 정확히 입력하십시오.');
            argObject.focus(); argObject.select(); return(false);
        }
    }
    return (true);
}

function checkMin(argObject){
    var tempStr = argObject.val();
    if(parseInt(tempStr) < parseInt(argObject.minV)){
        gfnAlertMsg(''+argObject.nameKor + '의 값은 '+argObject.minV+'보다 커야 합니다.');
        argObject.focus(); argObject.select(); return(false);
    }
    return (true);
}

function checkMax(argObject){
    var tempStr = argObject.val();
    if(parseInt(tempStr) > parseInt(argObject.maxV)){
        gfnAlertMsg(''+argObject.nameKor + '의 값은 '+argObject.maxV+'을 초과할 수 없습니다.');
        argObject.focus(); argObject.select(); return(false);
    }
    return (true);
}

function checkMinLen(argObject){

    var intStrLen = 0;
    // Netscape Or 이거나 영숫자일 경우 MaxLength에서 Check!
    if (navigator.appName != "Netscape") {
        for (i=0; i<argObject.val().length; i++) {
            retCode = argObject.val().charCodeAt(i);
            intStrLen = (retCode > 255) ? intStrLen + 2 : intStrLen + 1;
        }

        if (intStrLen < parseInt(argObject.minL)) {
            gfnAlertMsg(''+argObject.nameKor + '의 길이는 '+argObject.minL+'byte보다 커야 합니다.');
            argObject.focus(); argObject.select(); return(false);
        }
    }
    /*
    if(argObject.value.length < parseInt(argObject.minL)){
        gfnAlertMsg(''+argObject.nameKor + '의 길이는 '+argObject.minL+'보다 커야 합니다.');
        argObject.focus(); argObject.select(); return(false);
    }
    */
    return (true);
}

function checkMaxLen(argObject){

    var intStrLen = 0;
    // Netscape Or 이거나 영숫자일 경우 MaxLength에서 Check!
    if (navigator.appName != "Netscape") {
        for (i=0; i<argObject.val().length; i++) {
            retCode = argObject.val().charCodeAt(i);
            intStrLen = (retCode > 255) ? intStrLen + 2 : intStrLen + 1;
        }

        if (intStrLen > parseInt(argObject.maxL)) {
            gfnAlertMsg(''+argObject.nameKor + '의 길이는 '+argObject.maxL+'byte보다 작아야 합니다.');
            argObject.focus(); argObject.select(); return(false);
        }
    }
    /*
    if(argObject.value.length > parseInt(argObject.maxL)){
        gfnAlertMsg(''+argObject.nameKor + '의 길이는 '+argObject.maxL+'보다 작아야 합니다.');
        argObject.focus(); argObject.select(); return(false);
    }
    */
    return (true);
}

function removeSpace(srcString){
    var convString ='';
    for(i=0;i<srcString.length;i++){
        if(srcString.charAt(i) != ' ' )
            convString = convString + srcString.charAt(i);
    }
    return (convString);
}


function SPIN_MONTH_CHECK(FieldName, MinValue, MaxValue,Step,Point) {
    var TransValue = parseInt(FieldName.value);

        if (TransValue > 12){
                FieldName.value = 1;
        }

        if (TransValue < 1){
                FieldName.value = 12;
        }
}

function SPIN_MONTH_UP(FieldName, MinValue, MaxValue,Step,Point) {
    SPIN_CUSTOM_UP(FieldName, MinValue, MaxValue,Step,Point);
    SPIN_MONTH_CHECK(FieldName, MinValue, MaxValue,Step,Point);
}

function SPIN_MONTH_DOWN(FieldName, MinValue, MaxValue,Step,Point) {
    SPIN_CUSTOM_DOWN(FieldName, MinValue, MaxValue,Step,Point);
    SPIN_MONTH_CHECK(FieldName, MinValue, MaxValue,Step,Point);
}

function SPIN_CURRENCY_CHECK(FieldName, MinValue, MaxValue,Step,Point) {
    SPIN_RemoveComma(FieldName, MinValue, MaxValue,Step,Point)
    SPIN_InsertComma(FieldName, MinValue, MaxValue,Step,Point)
}

function SPIN_CURRENCY_UP(FieldName, MinValue, MaxValue,Step,Point) {
    SPIN_CUSTOM_UP(FieldName, MinValue, MaxValue,Step,Point);
    SPIN_CURRENCY_CHECK(FieldName, MinValue, MaxValue,Step,Point);
}

function SPIN_CURRENCY_DOWN(FieldName, MinValue, MaxValue,Step,Point) {
    SPIN_CUSTOM_DOWN(FieldName, MinValue, MaxValue,Step,Point);
    SPIN_CURRENCY_CHECK(FieldName, MinValue, MaxValue,Step,Point);
}

function SPIN_PERCENTAGE_CHECK(FieldName, MinValue, MaxValue,Step,Point) {
    var TransValue;
    if (Point != "" && parseInt(Point) > 0){
        TransValue = parseFloat(FieldName.value);
    } else {
        TransValue = parseInt(FieldName.value);
    }

    if (TransValue > 100){
        FieldName.value = -100;
    }

    if (TransValue < -100){
        FieldName.value = 100;
    }

    if (Point != "" && parseInt(Point) > 0){
        var PowerValue = POW(10,Integer.parseInt(Point));
        var intValue = parseInt(parseFloat(FieldName.value)*PowerValue);
        FieldName.value = intValue/PowerValue;
    }
}

// Custom Tag를 통한 각 컬럼의 값을 Check한다.
function checkfield(ObjectField,FormValid){

    if(ObjectField.mand == 'Y'){
        if (!check_area_code(ObjectField,ObjectField.nameKor))
            return false;
    }
    if((ObjectField.lenC =='Y')&&(ObjectField.val() !='')){
        if (!check_data_length(ObjectField,ObjectField.nameKor,ObjectField.maxlength))
            return false;
    }
    if((ObjectField.numC =='Y')&&(ObjectField.val() !='')){
        if (!check_data_type(ObjectField,'','N'))
            return false;
    }
    if((ObjectField.emlC =='Y')&&(ObjectField.val() !='')){
        if (!check_email(ObjectField))
            return false;
    }
    if((ObjectField.minV != 'undefined')&&(ObjectField.val() !='')){
        if (!checkMin(ObjectField))
            return false;
    }
    if((ObjectField.maxV != 'undefined')&&(ObjectField.val() !='')){
        if (!checkMax(ObjectField))
            return false;
    }
    if((ObjectField.noKr == 'Y')&&(ObjectField.val() !='')){
         if (!check_no_han(ObjectField))
            return false;
    }
    if((ObjectField.minL != 'undefined')&&(ObjectField.val() !='')){
          if (!checkMinLen(ObjectField))
            return false;
    }
    if((ObjectField.maxL != 'undefined')&&(ObjectField.val() !='')){
           if (!checkMaxLen(ObjectField))
            return false;
    }
    if((ObjectField.checkData == 'date')&&(ObjectField.val() !='')){
           if (!check_date(ObjectField))
            return false;
    }
    if((ObjectField.checkData == 'currency')&&(ObjectField.val() !='')){
           if (!check_currency(ObjectField))
            return false;
    }
    if((ObjectField.checkData == 'pid')&&(ObjectField.val() !='')){
           if (!check_pid(ObjectField))
            return false;
    }
    if(FormValid == true)
        return true;
    else
        return false;
}

// 입력시 자동으로 숫자형으로 포멧한다.
function makeAmt(ObjectField){
    amt_comma(ObjectField);
    amt_no_comma2(ObjectField);
    return false;
}

// 금액형식으로 포맷한다.
function moneyFmt(moneyObj){
    amt_comma(moneyObj);
    amt_no_comma2(moneyObj);
    return false;
}

// 입력시 자동으로 날짜포맷(년월일)한다.
function makeDate(obj){

    // 백스페이스키 무시
       if (event.keyCode == 8)
      return false;

    var str = obj.val();
    str = removeChar(str,'.');
    str = removeChar(str,'-');
    str = removeChar(str,'/');

    check_data_type(obj, '', 'D');
    check_date(obj);

    if (str.length == 4) {
        obj.val(str + ".");
    }
    else if (str.length == 6) {
        obj.val(str.substring(0, 4) + "." + str.substring(4,6) + ".");
    }
}

// 입력시 자동으로 날짜포맷(년월)한다.
function makeYyyymmDate(obj){

    // 백스페이스키 무시
       if (event.keyCode == 8)
      return false;

    var str = removeChar(obj.val(),'.');

    if (str.length == 4) {
        obj.val(str + ".");
    }
}

// 입력시 자동으로 날짜포맷(윌일) 포맷한다
function makeMmddDate(obj){

        // 백스페이스키 무시
       if (event.keyCode == 8)
      return false;

    var str = removeChar(obj.val(),'.');

    if (str.length == 2) {
        obj.val(str + ".");
    }
}

// 날짜형식으로 포맷한다.
function dateFmt(dateObj) {
    date = dateObj.val();
    if (date.length == 8) {
        result = date.substring(0,4) + "." + date.substring(4,6) + "." + date.substring(6,8);
        dateObj.val(result);
    }
    else if(date.length == 6) {
        result = date.substring(0,4) + "." + date.substring(4,6);
        dateObj.val(result);
    }
    return false;
}

// 두 날짜를 비교해서 시작날짜보다 종료날짜가 더 작으면 에러메시지를 보여준다.
function checkBothDate(s_date, e_date) {

    s_date = removeFmt(s_date);
    e_date = removeFmt(e_date);

    if (s_date != "" && e_date != "") {
        if (parseFloat(s_date) > parseFloat(e_date)) {
            return false;
        }
    }
    return true;
}

//오늘 날짜를 세팅한다.
//ex)20190801
function getToDay(){
    var dt = new Date();
    var recentYear = String(dt.getFullYear());
    var recentMonth = dt.getMonth() + 1;
    var recentDay = dt.getDate();

    if(recentMonth < 10) recentMonth = "0" + recentMonth;
    if(recentDay < 10) recentDay = "0" + recentDay;

    return recentYear + recentMonth + recentDay;
}

// 원하는 날짜를 세팅한다.
function addDate(date, add_days) {

    date = removeFmt(date);

    total_days = calculate_total_days(date) + parseFloat(add_days);
    result_date = makeDate2(total_days);

    return result_date;
}

// 특정일자에 개월수를 더한 날짜를 리턴한다.
function addMonth(date, add_month) {

    date = removeFmt(date);

    // 개월수를 더한 년월을 구한다.
    yyyymm  = getYyyymm(date.substring(0,6), add_month);
    dd		= date.substring(6,8);

    // 구한 년월의 해당월의 마지막 날짜를 구한다.
    lastday = getLastday(yyyymm.substring(0,4), yyyymm.substring(4,6));

    if (parseInt(dd) > parseInt(lastday))
        dd = lastday;

    return (yyyymm + dd);
}

// 특정년월의 마지막 날짜를 구한다.
function getLastday(yyyy, mm) {

    if (mm.length == 2) {
        if (mm.substring(0,1) == '0')
            mm = mm.substring(1,2);
    }

    switch (parseInt(mm)) {
          case 2:
               intDay = (!(yyyy % 4) && (yyyy % 100) || !(yyyy % 400)) ? 29 : 28;
               break;
          case 4: case 6: case 9: case 11:
               intDay = 30;
               break;
          default :
               intDay = 31;
     }

     return intDay;
}

// 특정년월에 개월수를 더한 년월을 구한다.
function getYyyymm(yyyymm, add_month) {

    yyyy 	= yyyymm.substring(0, 4);
    mm 		= yyyymm.substring(4, 6);

    total_month = parseFloat(yyyy) * parseFloat(mm);
    total_month = total_month + parseFloat(add_month);

    yyyy2 = parseInt(total_month / mm) + 1;
    mm2 = parseInt(total_month % 12);

    if (mm2 == 0) {
        yyyy2 	= yyyy2 - 1;
        mm2		= 12;
    }

    s_yyyy2 = yyyy2 + '';
    s_mm2 = mm2 + '';

    if (s_mm2.length == 1)
        s_mm2 = "0" + s_mm2;

    return (s_yyyy2 + s_mm2);
}

// 1900년부터 해당 날짜까지 몇날인가를 계산하여 결과를 리턴한다.
function calculate_total_days(date) {

    year = date.substring(0 ,4);
    mm = date.substring(4, 6);
    dd = date.substring(6, 8);
    target_year = parseFloat(year) - 1900;
    target_mm = mm;
    if (mm.substring(0, 1) == '0')
         target_mm = mm.substring(1,2);
    target_dd = dd;
    if (dd.substring(0, 1) == '0')
         target_dd = dd.substring(1,2);
    mm_days = 0;
    switch (target_mm) {
        case "2" : 	mm_days = 31; 	break;
        case "3" : 	mm_days = 59;	break;
        case "4" : 	mm_days = 90; 	break;
        case "5" : 	mm_days = 120;	break;
        case "6" : 	mm_days = 151; 	break;
        case "7" : 	mm_days = 181;	break;
        case "8" : 	mm_days = 212; 	break;
        case "9" : 	mm_days = 243;	break;
        case "10" : mm_days = 273; 	break;
        case "11" : mm_days = 304;	break;
        case "12" : mm_days = 334; 	break;
    }

    // 윤년이면 1일을 더한다.
    if(((year%4==0)&&(year%100!=0)) || (year%400==0)) {
         mm_days = mm_days + 1;
      }

    return (total_days = (parseFloat(target_year) * 365) + mm_days + parseFloat(target_dd));
}


// 날수를 인자로 1900년을 기준으로 날짜(yyyymmdd)로 변환해서 리턴한다.
function makeDate2(days) {
    yyyy = parseInt(days/365) + 1900;
    mm = "";
    dd = "";

    remain_days = days%365;

    // 윤달이냐 아니냐에 따라 다음과 같이 세팅한다.
    if(((year%4==0)&&(year%100!=0)) || (year%400==0)) {
        if (remain_days <= 31) {
            mm = "01";
            dd = remain_days;
        }
        else if (remain_days <= 60) {
            mm = "02";
            dd = remain_days - 31;
        }
        else if (remain_days <= 91) {
            mm = "03";
            dd = remain_days - 60;
        }
        else if (remain_days <= 121) {
            mm = "04";
            dd = remain_days - 91;
        }
        else if (remain_days <= 152) {
            mm = "05";
            dd = remain_days - 121;
        }
        else if (remain_days <= 182) {
            mm = "06";
            dd = remain_days - 152;
        }
        else if (remain_days <= 213) {
            mm = "07";
            dd = remain_days - 182;
        }
        else if (remain_days <= 244) {
            mm = "08";
            dd = remain_days - 212;
        }
        else if (remain_days <= 274) {
            mm = "09";
            dd = remain_days - 244;
        }
        else if (remain_days <= 305) {
            mm = "10";
            dd = remain_days - 274;
        }
        else if (remain_days <= 335) {
            mm = "11";
            dd = remain_days - 305;
        }
        else {
            mm = "12";
            dd = remain_days - 335;
        }
    }
    else {
        if (remain_days <= 31) {
            mm = "01";
            dd = remain_days;
        }
        else if (remain_days <= 59) {
            mm = "02";
            dd = remain_days - 31;
        }
        else if (remain_days <= 90) {
            mm = "03";
            dd = remain_days - 59;
        }
        else if (remain_days <= 120) {
            mm = "04";
            dd = remain_days - 90;
        }
        else if (remain_days <= 151) {
            mm = "05";
            dd = remain_days - 120;
        }
        else if (remain_days <= 181) {
            mm = "06";
            dd = remain_days - 151;
        }
        else if (remain_days <= 212) {
            mm = "07";
            dd = remain_days - 181;
        }
        else if (remain_days <= 243) {
            mm = "08";
            dd = remain_days - 212;
        }
        else if (remain_days <= 273) {
            mm = "09";
            dd = remain_days - 243;
        }
        else if (remain_days <= 304) {
            mm = "10";
            dd = remain_days - 273;
        }
        else if (remain_days <= 334) {
            mm = "11";
            dd = remain_days - 304;
        }
        else {
            mm = "12";
            dd = remain_days - 334;
        }
    }

    if (dd.toString().length == 1)
        dd = "0" + dd;

    return (yyyy + mm + dd);
}

// 두 날짜 사이에 날수를 계산하여 리턴한다.
function getDaysBetweenBothDate(s_date, e_date) {

    s_date = removeFmt(s_date);
    e_date = removeFmt(e_date);

    if (s_date != "" && e_date != "") {
        if (parseFloat(s_date) <= parseFloat(e_date)) {
            daysS_date = calculate_total_days(s_date);
            daysE_date = calculate_total_days(e_date);
            days = daysE_date - daysS_date;
            return days;
        }
    }

    return "-1";
}

// 입력시 자동으로 주민등록포맷(년월)한다.
function makeJumin_no(obj){

    // 백스페이스키 무시
       if (event.keyCode == 8)
      return false;

    var str = removeChar(obj.val(),'-');

    if (str.length == 6) {
        obj.val(obj.val() + "-");
    }
}

// 주민등록형식으로 포맷한다.
function juminFmt(obj) {
    jumin = obj.val();
    if (jumin.length == 13) {
        result = jumin.substring(0,6) + "-" + jumin.substring(6,13);
        obj.val(result);
    }
}

// 입력시 자동으로 사업자등록번호포맷(3-2-5)한다.
function makeSaupja_no(obj){

    // 백스페이스키 무시
       if (event.keyCode == 8)
      return false;

    var str = removeChar(obj.val(),'-');

    if (str.length == 3) {
        obj.val(str + "-");
    }
    else if (str.length == 5) {
        obj.val(str.substring(0,3) + "-" + str.substring(3,5) + "-");
    }
}

// 특정문자를 없앤다.
function removeChar(srcString,strchar){
    var convString ='';

    for(z=0;z<srcString.length;z++){
        if(srcString.charAt(z) != strchar )
            convString = convString + srcString.charAt(z);
    }
    return (convString);
}

// 포맷형식을 없앤다.
function removeFmt(str) {
    result = removeChar(str, '.');
    result = removeChar(result, '-');
    result = removeChar(result, ',');
    result = removeChar(result, '/');

    return result;
}

// 날짜형식인지를 체크한다.(태그라이브러리에서 내부적으로 사용)
function check_date(argObject){

    str = argObject.val();
    str = removeFmt(str);

    if(str.length != 8){
        return false;
    }

    strYear  = str.substr(0,4);
    strMonth = str.substr(4,2);
    strDay   = str.substr(6,2);

    if (parseInt(strMonth) > 12) {
        gfnAlertMsg(argObject.nameKor + "은(는) 올바른 날짜가 아닙니다.");
        argObject.select();
        return false;
    }

    argYear = parseInt(strYear);

     switch (parseInt(strMonth)) {
          case 2:
               intDay = (!(argYear % 4) && (argYear % 100) || !(argYear % 400)) ? 29 : 28;
               break;
          case 4: case 6: case 9: case 11:
               intDay = 30;
               break;
          default :
               intDay = 31;
     }

    strDay = removeChar(strDay, '0');

      if(strDay > intDay) {
          gfnAlertMsg(argObject.nameKor + "은 올바른 날짜헝식이 아닙니다.");
          argObject.select();
          return false;
      }
      else
        return true;
}


// 금액을 체크한다.(태그라이브러리에서 내부적으로 사용)
function check_currency(argObject) {

    str = argObject.val();
    str = removeChar(str, ',');

    if (str.length > 1) {
        if (str.substring(0,1) == '0') {
            gfnAlertMsg(argObject.nameKor + "은 올바른 금액형식이 아닙니다.");
            argObject.select();
            return false;
        }
    }

    if(isNaN(str)) {
        gfnAlertMsg(argObject.nameKor + "은 올바른 금액형식이 아닙니다.");
        argObject.select();
        return false;
    }

    return true;
}

// 주민등록번호가 제대로 입력되었는지를 체크한다.(태그라이브러리에서 내부적으로 사용)
// * 미완성 => argObject이 이상하게 넘어옴???
function check_pid(argObject) {

    str = argObject.val();

    if (str == "")
        return true;

    if (str.length != 14) {
        gfnAlertMsg(argObject.nameKor + "은 올바른 주민등록형식이 아닙니다.");
        argObject.select();
        return false;
    }

    if (str.indexOf('-') != 6) {
        gfnAlertMsg(argObject.nameKor + "은 올바른 주민등록형식이 아닙니다.");
        argObject.select();
        return false;
    }

    return true;
}

// 주민등록번호가 제대로 입력되었는지를 체크한다.
function checkJumin_no2(str) {

    if (str == "")
        return true;

    str = removeChar(str, '-');

    if (str.length != 13)
        return false;

    cBit = 0;
    sCode="234567892345";

    for(i=0;i<12;i++) {
        cBit = cBit+parseInt(str.substring(i,i+1))*parseInt(sCode.substring(i,i+1));
    }

    cBit=11-(cBit%11);
    cBit=cBit%10;

    if(parseInt(str.substring(12,13))==cBit) {
        return true;
    }
    else {
        return false;
    }
}


// 금액을 체크한다.
function checkCurrency(str) {

    str = removeChar(str, ',');

    if (str.length > 1) {
        if (str.substring(0,1) == '0') {
            return false;
        }
    }

    return !(isNaN(str));
}


// 값이 ""인지를 를 체크한다.(일반)
function checkNull(obj, errname){

    if (obj.val() == "") {
        gfnAlertMsg(errname + "을(를) 입력하세요.");
          obj.select();
          return false;
      }

      return true;
}


// 날짜형식인지를 체크한다.(일반)
function checkDate(obj, flag, errname){
    if (flag == 'notnull') {
        if (obj.val() == "") {
            gfnAlertMsg(errname + "을(를) 입력하세요.");
              obj.select();
              return false;
          }
      }

    str = removeFmt(obj.val());
    if (str == "")
        return true;

    if(str.length != 6 && str.length != 8){

        gfnAlertMsg(errname + "은(는) 올바른 날짜형식이 아닙니다.");
          obj.select();
        return false;
    }

    if (str.length == 6) {

        strYear  = str.substr(0,4);
        strMonth = str.substr(4,2);

        if (strMonth.substr(0,1) == '0')
            strMonth = strMonth.substr(1,2);

        if (strMonth > 12 || strMonth < 1) {

            gfnAlertMsg(errname + "은(는) 올바른 날짜형식이 아닙니다.");
              obj.select();
            return false;
        }

        return true;
    }

    if (str.length == 8) {

        strYear  = str.substr(0,4);
        strMonth = str.substr(4,2);
        strDay   = str.substr(6,2);

        if (strMonth.substr(0,1) == '0')
            strMonth = strMonth.substr(1,2);

        if (strMonth > 12 || strMonth < 1) {

            gfnAlertMsg(errname + "은(는) 올바른 날짜형식이 아닙니다.");
              obj.select();
            return false;
        }

        argYear = parseInt(strYear);

         switch (parseInt(strMonth)) {
              case 2:
                   intDay = (!(argYear % 4) && (argYear % 100) || !(argYear % 400)) ? 29 : 28;
                   break;
              case 4: case 6: case 9: case 11:
                   intDay = 30;
                   break;
              default :
                   intDay = 31;
         }

        if (strDay.substr(0,1) == '0')
            strDay = strDay.substr(1,2);

          if(strDay > intDay) {
              gfnAlertMsg(errname + "은(는) 올바른 날짜형식이 아닙니다.");
              obj.select();
              return false;
          }
          else
            return true;
    }
}


// 주민등록번호가 제대로 입력되었는지를 체크한다.
function checkJumin_no(obj, flag, errname) {

    if (flag == 'notnull') {
        if (obj.val() == "") {
            gfnAlertMsg(errname + "을(를) 입력하세요.");
              obj.select();
              return false;
          }
      }

    str = obj.val();

    if (str == "")
        return true;

    // 자리수체크
    if (str.length != 14 || str.indexOf('-') != 6) {
        gfnAlertMsg(errname + "은 올바른 주민등록번호형식이 아닙니다.");
          obj.select();
        return false;
    }

    sID = str.substring(0,6) + str.substring(7,12);

    // 입력값체크
    cBit = 0;
    sCode="234567892345";
    for(i=0;i<12;i++) {
        cBit = cBit+parseInt(sID.substring(i,i+1))*parseInt(sCode.substring(i,i+1));
    }
    cBit=11-(cBit%11);
    cBit=cBit%10;
    if(parseInt(sID.substring(12,13))==cBit) {
        return true;
    }
    else {
        gfnAlertMsg(errname + "은 올바른 주민등록번호형식이 아닙니다.");
          obj.select();
        return false;
    }

    return true;
}


// 금액을 체크한다.
function checkCurrency(obj, flag, errname) {

    if (flag == 'notnull') {
        if (obj.val() == "") {
            gfnAlertMsg(errname + "을(를) 입력하세요.");
              obj.select();
              return false;
          }
      }

    str = removeChar(obj.val(), ',');

    if (str.length > 1) {
        if (str.substring(0,1) == '0') {
            gfnAlertMsg(errname + "은 올바른 금액(숫자)형식이 아닙니다.");
              obj.select();
            return false;
        }
    }

    if (isNaN(str)) {
        if (str.substring(0,1) == '0') {
            gfnAlertMsg(errname + "은 올바른 금액(숫자)형식이 아닙니다.");
              obj.select();
            return false;
        }
    }
}

function textLengthChk(str) {
    var temp;
    var content_cnt = 0;
    var len = str.length;

    for(k=0; k<len ; k++)
    {
        temp = str.charAt(k);
        if(escape(temp).length > 4) //한글은 escape()문에서 6을 반환
            content_cnt += 2; //길이2를 더함
        else
            content_cnt++; //영어 및 특수문자이면 1을 더함
    }
    return content_cnt ;
}

























function SPIN_PERCENTAGE_UP(FieldName, MinValue, MaxValue,Step,Point) {
    SPIN_CUSTOM_UP(FieldName, MinValue, MaxValue,Step,Point);
    SPIN_PERCENTAGE_CHECK(FieldName, MinValue, MaxValue,Step,Point);
}

function SPIN_PERCENTAGE_DOWN(FieldName, MinValue, MaxValue,Step,Point) {
    SPIN_CUSTOM_DOWN(FieldName, MinValue, MaxValue,Step,Point);
    SPIN_PERCENTAGE_CHECK(FieldName, MinValue, MaxValue,Step,Point);
}

function SPIN_CUSTOM_CHECK(FieldName, MinValue, MaxValue,Step,Point) {
    var TransValue;
    if (Point != "" && parseInt(Point) > 0){
        TransValue = parseFloat(FieldName.value);
    } else {
        TransValue = parseInt(FieldName.value);
    }

    if (parseInt(MaxValue) == 0 || MaxValue != ""){
        if (TransValue > MaxValue){
            if (parseInt(MinValue) == 0 || MinValue != "")	{
                FieldName.value = MinValue;
            } else {
                FieldName.value = MaxValue;
            }
        }
    }

    if (parseInt(MinValue) == 0 || MinValue != ""){
        if (TransValue < MinValue){
            if (parseInt(MaxValue) == 0 || MaxValue != "")	{
                FieldName.value = MaxValue;
            } else {
                FieldName.value = MinValue;
            }
        }
    }

    if (Point != "" && parseInt(Point) > 0){
        var PowerValue = POW(10,parseInt(Point));
        var intValue = parseInt(parseFloat(FieldName.value)*PowerValue);
        FieldName.value = intValue/PowerValue;
    }
}

function SPIN_CUSTOM_UP(FieldName, MinValue, MaxValue,Step,Point) {
    SPIN_RemoveComma(FieldName, MinValue, MaxValue,Step,Point)

    var TransValue;
    if (Point != "" && parseInt(Point) > 0){
        TransValue = parseFloat(FieldName.value);
    } else {
        TransValue = parseInt(FieldName.value);
    }

    if (Step != "")	{
        FieldName.value = TransValue + Step;
    } else {
        FieldName.value = TransValue + 1;
    }
    SPIN_CUSTOM_CHECK(FieldName, MinValue, MaxValue,Step,Point);
}

function SPIN_CUSTOM_DOWN(FieldName, MinValue, MaxValue,Step,Point) {
    SPIN_RemoveComma(FieldName, MinValue, MaxValue,Step,Point)

    var TransValue;
    if (Point != "" && parseInt(Point) > 0){
        TransValue = parseFloat(FieldName.value);
    } else {
        TransValue = parseInt(FieldName.value);
    }

    if (Step != "")	{
        FieldName.value = TransValue - Step;
    } else {
        FieldName.value = TransValue - 1;
    }
    SPIN_CUSTOM_CHECK(FieldName, MinValue, MaxValue,Step,Point);
}

function SPIN_RemoveComma(FieldName, MinValue, MaxValue,Step,Point) {
    if (FieldName.value <1 ){
        return;
    }
    var ls_amt1  = "";
    var ls_amt2  = "";
    var sign= "";
    ls_amt1 = FieldName.value;

    if (ls_amt1.charAt(0) == '-')
        sign = "-";
    for (var i= 0; i< ls_amt1.length+1; i++){
        ls_amt1_char = ls_amt1.charAt(i);
        if (ls_amt1_char >= '0' && ls_amt1_char <= '9' || ls_amt1_char == '.' || ls_amt1_char == '-')
                ls_amt2 = ls_amt2 +ls_amt1_char;
    }

    FieldName.value = ls_amt2;
}

function SPIN_InsertComma(FieldName, MinValue, MaxValue,Step) {
    if (FieldName.value <1 ){
        return;
    }

    var ls_amt1 = FieldName.value;
    var ls_amt2 = ls_amt1;

    if (ls_amt1.substring(0,1)=="-")
        ls_amt2 = ls_amt1.substring(1);

    var point = ls_amt2.indexOf('.');
    if (point == -1) point = ls_amt2.length;

    var ret = "";
    var cnt = 1;

    for (var i = ls_amt2.length - 1; i >= 0; i--) {
        if (point <= i) {
            ret = ls_amt2.charAt(i) + ret;
        } else {
            if (cnt == 4) {
                ret = ',' + ret;
                cnt = 1;
            }
            cnt++;
            ret = ls_amt2.charAt(i) + ret;
        }
    }
    if (ls_amt1.substring(0,1)=="-")
        ret = "-" + ret;
    FieldName.value = ret;
}

function POW(num, exp){
    var PowValue = 1;
    for (exp; exp>0; exp-- ){
        PowValue *= num;
    }
    return PowValue;
}

// 그리드 컬럼크기 자동조절(문자열 크기만큼 컬럼 크기가 늘어남)
function ChangeSize(obj,iWidth,percent) {
    if (obj != 'undefined') {
        if (obj.RowCount > 0) {
            obj.SheetWidth = (iWidth - Math.round(iWidth*(percent/100)));
        }
    }
}

function ChangeTableSize(obj,iWidth,percent) {
    if (obj != 'undefined') {
        obj.width = (iWidth - (iWidth*(percent/100)));
    }
}


/*
 * 파일다운로드
 * g_path 경로
 * g_file 파일명
 * 화면에 iform필요
 */
function jsGetFile(g_path,g_file){
    iform.location.href = "/file_download.jsp?strFilePath="+g_path+"&strFileName="+g_file;
}


// 재외국인 번호 체크
function check_fgnno(fgnno) {
        var sum=0;
        var odd=0;
        buf = new Array(13);
        for(i=0; i<13; i++) { buf[i]=parseInt(fgnno.charAt(i)); }
        odd = buf[7]*10 + buf[8];
        if(odd%2 != 0) { return false; }
        if( (buf[11]!=6) && (buf[11]!=7) && (buf[11]!=8) && (buf[11]!=9) ) {
                return false;
        }
        multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
        for(i=0, sum=0; i<12; i++) { sum += (buf[i] *= multipliers[i]); }
        sum = 11 - (sum%11);
        if(sum >= 10) { sum -= 10; }
        sum += 2;
        if(sum >= 10) { sum -= 10; }
        if(sum != buf[12]) { return false }
        return true;
}

/////////////////마우스우측버튼금지//////////////////

    var message="오른쪽 버튼은 사용할 수 없습니다";

    function clickIE4(){
    if (event.button==2){
    gfnAlertMsg(message);
    return false;
    }
    }

    function clickNS4(e){
    if (document.layers||document.getElementById&&!document.all){
    if (e.which==2||e.which==3){
    gfnAlertMsg(message);
    return false;
    }
    }
    }

    /* 우측 소스보호 주석  2019.09.22   (c.j.h)
        if (document.layers){
            document.captureEvents(Event.MOUSEDOWN);
            document.onmousedown=clickNS4;
        }
        else if (document.all&&!document.getElementById){
            document.onmousedown=clickIE4;
        }

        document.oncontextmenu=new Function("gfnAlertMsg(message);return false")
    */
////////////////////////////////////////////////////////////////////
