<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%--<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>--%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>

<body>

    <!-- Content -->
    <div align="center">
        <img src="/resources/images/img_error.jpg" usemap="#Map" border="0">
        <map name="Map" id="Map">
            <area shape="rect" coords="255,131,356,155" alt="이전 페이지 가기" href="Javascript:history.back();">
        </map>
    </div>
    <!-- Content //-->

</body>
<script>
if(typeof hideLoading == 'function') hideLoading();
</script>
</html>
