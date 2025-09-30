<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page trimDirectiveWhitespaces="true" %>
<!DOCTYPE html>
<html>
<head>
    <title>시스템표준 파일럿 시스템</title>

    <jsp:include page="/header" />

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<!-- wrap-->
<div id="wrap">
    <!-- header -->
    <header>
        <h1 style="cursor:pointer" onclick="location.href='/main'">
            <img src="/resources/images/ci_db.png"/> 시스템표준 파일럿 프로그래밍
        </h1>
    </header>
    <nav class="nav">
<%--    <ul>--%>
<%--        <li>--%>
<%--            회원--%>
<%--&lt;%&ndash;            <a href="javascript:void(0)" onclick="goScreenSubmit('/visit/visit_m01')">&ndash;%&gt;--%>
<%--&lt;%&ndash;                방문 신청&ndash;%&gt;--%>
<%--&lt;%&ndash;            </a>&ndash;%&gt;--%>
<%--        </li>--%>
<%--        <li>--%>
<%--            상품--%>
<%--&lt;%&ndash;            <a href="javascript:void(0)" onclick="goScreenSubmit('/admin/admin_m01')">&ndash;%&gt;--%>
<%--&lt;%&ndash;                관리자 로그인&ndash;%&gt;--%>
<%--&lt;%&ndash;            </a>&ndash;%&gt;--%>
<%--        </li>--%>


<%--        <li>--%>
<%--            주문--%>
<%--&lt;%&ndash;            <a href="javascript:void(0)" onclick="goScreenSubmit('/admin/admin_m01_s01')">&ndash;%&gt;--%>
<%--&lt;%&ndash;                방문자 조회&ndash;%&gt;--%>
<%--&lt;%&ndash;            </a>&ndash;%&gt;--%>
<%--        </li>--%>
<%--    </ul>--%>
    </nav>

    <section id="contentsWrap" class="contentWrap">
        <article id="contentWrap" class="contentWrap">
            <c:if test="${not empty includePage}">
                <jsp:include page="${includePage}" />
            </c:if>
        </article>
    </section>

    <div id="loading" style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; opacity: 0.5; background-color: grey; display: none; z-index: 1500">
        <div style="position: fixed; left: 45%; top: 45%;">
            <img id="loadingImg" src="/resources/images/loading.gif">
        </div>
    </div>
</div>
<%--Wrap 종료--%>

<script>
    // Ajax로 partial JSP 가져오기 + pushState
    function goScreenSubmit(url, params = {}) {

        // URL 변경
        const query = $.param(params);

        const fullUrl = query ? url + '?' + query : url;

        window.history.pushState(params, '', fullUrl);
        ajax.getHTML(fullUrl);
    }

    // 뒤로/앞으로가기 시 popstate 이벤트
    window.onpopstate = function(event) {
        const currentUrl = location.pathname + location.search;
        ajax.getHTML(currentUrl);
    };
</script>
</body>
</html>
