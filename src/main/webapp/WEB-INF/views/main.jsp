<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script>
    $(document).ready(function () {
    hideLoading();
    });
</script>
<div id="mainHome" class="main-wrap">
    <style>
        /* 스코프 한정 스타일 */
        #mainHome {
            font-family: "Segoe UI", Arial, sans-serif;
            color: #1f2937;
            text-align: center; /* 전체 가운데 정렬 */
        }

        #mainHome .panel {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 10px 28px rgba(0, 0, 0, .08);
            padding: 50px 30px;
            max-width: 700px;
            margin: 0 auto; /* 가운데 배치 */
        }

        /* 큰 타이틀 */
        #mainHome .title {
            font-size: 40px;
            font-weight: 800;
            margin-bottom: 40px;
        }

        /* 세로 정렬 */
        #mainHome .stack {
            display: flex;
            flex-direction: column;
            gap: 40px; /* 섹션 간격 */
            align-items: center; /* 버튼 가운데 정렬 */
        }

        /* 섹션 제목 */
        #mainHome .section-title {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 20px;
        }

        /* 버튼 */
        #mainHome .btn {
            display: inline-block;
            padding: 18px 28px;
            min-width: 260px;
            border-radius: 10px;
            border: 1px solid transparent;
            font-size: 20px;
            font-weight: 700;
            cursor: pointer;
            color: #fff;
            margin: 8px 0;
            transition: transform .08s ease, box-shadow .12s ease;
        }

        #mainHome .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, .15);
        }

        /* 색상 */
        #mainHome .btn.secondary {
            background: #4b5563;
        }

        #mainHome .btn.dark {
            background: #111827;
        }

        #mainHome .btn.info {
            background: #0ea5e9;
        }

        /* 반응형 */
        @media (max-width: 720px) {
            #mainHome .btn {
                width: 100%;
                min-width: auto;
            }
        }
    </style>

    <div class="panel">
        <div class="stack">

            <!-- 회원 기능 -->
            <div class="section">
                <div class="section-title">회원 기능</div>
                <button class="btn secondary"
                        onclick="goScreenSubmit('/member/memberForm')">
                    회원 가입
                </button>
                <button class="btn secondary"
                        onclick="goScreenSubmit('<c:url value='/members'/>')">
                    회원 목록
                </button>
            </div>

            <!-- 상품 기능 -->
            <div class="section">
                <div class="section-title">상품 기능</div>
                <button class="btn dark"
                        onclick="goScreenSubmit('<c:url value='/items/new'/>')">
                    상품 등록
                </button>
                <button class="btn dark"
                        onclick="goScreenSubmit('<c:url value='/items'/>')">
                    상품 목록
                </button>
            </div>

            <!-- 주문 기능 -->
            <div class="section">
                <div class="section-title">주문 기능</div>
                <button class="btn info"
                        onclick="goScreenSubmit('<c:url value='/order'/>')">
                    상품 주문
                </button>
                <button class="btn info"
                        onclick="goScreenSubmit('<c:url value='/orders'/>')">
                    주문 내역
                </button>
            </div>

        </div>
    </div>
</div>
