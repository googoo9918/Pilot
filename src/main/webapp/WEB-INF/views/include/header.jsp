<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"       uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring"  uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!-- 파비콘 -->
<link rel="shortcut icon" href="/resources/icon/favicon.ico" />

<!-- 디자인 -->
<link rel="stylesheet" type="text/css" media="all" href="/resources/css/main.css">
<link rel="stylesheet" type="text/css" media="all" href="/resources/css/basic.css">
<%--<link rel="stylesheet" type="text/css" media="all" href="/resources/css/orange-color.css">--%>
<link rel="stylesheet" type="text/css" media="all" href="/resources/css/green-color.css">
<link rel="stylesheet" type="text/css" media="all" href="/resources/css/jquery-ui.css">
<%--<link rel="stylesheet" type="text/css" media="all" href="/resources/css/jquery-ui.theme_orange-color.css">--%>
<link rel="stylesheet" type="text/css" media="all" href="/resources/css/jquery-ui.theme_green-color.css">
<link rel="stylesheet" type="text/css" media="all" href="/resources/css/xeicon.min.css">

<!-- jqGrid 4.7.0 CSS -->
<link rel="stylesheet" type="text/css" href="/resources/js/jqGrid-4.7.0/css/ui.jqgrid.css"/>

<%-- timepicker-addon --%>
<link rel="stylesheet" type="text/css" href="/resources/css/jquery-ui-timepicker-addon.min.css">
<style>
  /* 그리드 그림자 제거*/
  .ui-jqgrid.ui-widget.ui-widget-content.ui-corner-all{
    box-shadow: none;
  }
  /* 탭 그림자 제거*/
  .ui-tabs.ui-corner-all.ui-widget.ui-widget-content{
    box-shadow: none;
  }

</style>
<!-- jquery -->
<script src="/resources/js/jquery/3.7.1/jquery.min.js"></script>
<script src="/resources/js/jquery-ui/1.13.2/jquery-ui.min.js"></script>
<script src="/resources/js/jquery-confirm/3.3.4/jquery-confirm.min.js"></script>

<!-- jqGrid 4.7.0 JS -->
<script src="/resources/js/jqGrid-4.7.0/jquery.jqGrid.js"></script>
<script src="/resources/js/jqGrid-4.7.0/i18n/grid.locale-kr.js"></script>
<script type="text/javascript" src="/resources/js/common/excelUtil.js"></script>

<!-- legacy에서 사용 -->
<script type="text/javascript" src="/resources/js/common/common.js?version=20241016"></script>
<script type="text/javascript" src="/resources/js/common/module.js"></script>
<script type="text/javascript" src="/resources/js/common/util.js"></script>

<!-- Excel -->
<script src="/resources/js/sheetJS/0.20.1/xlsx.full.min.js"></script>
<script src="/resources/js/xlsx-js-style/1.2.0/xlsx.min.js"></script>

<%-- timepicker-addon --%>
<script src="/resources/js/jquery-ui/jquery-ui-timepicker-addon.min.js"></script>

<script type="text/javascript">
  var _CONTEXT_PATH = '/';
  var _TOP_MENU_ID = '';
  var _CURRENT_GROUP_ID = '';
  var _CURRENT_MENU_ID = '';

  /* mobile desktop 체크 */
  var filter = "win16|win32|win64|mac|macintel";
  var isMobile = false;
  if ( navigator.platform ) {
    if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) {
      isMobile = true;
    } else {
      isMobile = false;
    }
  }
</script>
<script type="text/javascript" src="/resources/js/common/ajaxCommon.js?version=20250825"></script>


