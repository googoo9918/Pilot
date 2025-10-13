<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<script>
    var orderForm = {
        init: function () {
            this.set_form();
            this.regist_event();
            this.addRow();
        },

        set_form: function () {
        },

        // 주문 항목 행 추가
        addRow: function () {
            var idx = $("#orderItemsBody .orderRow").length;

            var $row = $(`
                <tr class="orderRow">
                    <td>
                        <select class="itemId" name="orderItems[${idx}].itemId" style="width: 200px" required>
                            <option value="">- 선택 -</option>
                            <c:forEach items="${items}" var="it">
                                <option value="<c:out value='${it.itemId}'/>">
                                    <c:out value="${it.name}"/>
                                </option>
                            </c:forEach>
                        </select>
                    </td>
                    <td>
                        <select class="count" name="orderItems[${idx}].count" style="width: 200px; display: inline-block;">
                            <c:forEach var="i" begin="1" end="10">
                                <option value="${i}">${i}</option>
                            </c:forEach>
                        </select>
                    </td>
                    <td class="tc">
                        <button type="button" class="bluebtn btnRemoveRow">삭제</button>
                    </td>
                </tr>
            `);

            $("#orderItemsBody").append($row);
        },

        // 삭제 후 name 인덱스 정합성 유지
        reindex: function () {
            $("#orderItemsBody .orderRow").each(function (i, el) {
                $(el).find(".itemId").attr("name", `orderItems[${i}].itemId`);
                $(el).find(".count").attr("name", `orderItems[${i}].count`);
            });
        },

        // JSON Body 구성
        buildFormDataJson: function () {
            var memberId = $("#memberId").val();
            var items = [];

            $("#orderItemsBody .orderRow").each(function () {
                var itemId = $(this).find(".itemId").val();
                var count = $(this).find(".count").val();
                if (itemId) {
                    items.push({
                        itemId: Number(itemId),
                        count: Number(count || 1)
                    });
                }
            });

            return {
                memberId: memberId ? Number(memberId) : null,
                orderItems: items
            };
        },

        validate: function (payload) {
            if (!payload.memberId) {
                gfnAlertMsg("주문회원을 선택하세요.");
                return false;
            }
            if (!payload.orderItems || payload.orderItems.length === 0) {
                gfnAlertMsg("최소 1개 이상의 상품을 선택하세요.");
                return false;
            }
            return true;
        },

        regist_event: function () {
            var self = this;

            // 행 추가
            $(document).on("click", "#btnAddRow", function () {
                self.addRow();
            });

            // 행 삭제
            $(document).on("click", ".btnRemoveRow", function (e) {
                $(e.currentTarget).closest(".orderRow").remove();
                self.reindex();
            });

            // 저장
            $("#btnSave").click(function () {
                if (!isValid("orderForm")) return;

                // 기존 변수명 formData 유지
                var formData = self.buildFormDataJson();
                if (!self.validate(formData)) return;

                gfnConfirmMsg("신청 하시겠습니까?", function () {
                    showLoading();
                    setTimeout(function () {
                        ajax.postRequest("/api/orders", formData, function (res) {
                            goScreenSubmit("/main");
                        });
                    }, 200);
                })
            });
        }
    }

    $(document).ready(function () {
        orderForm.init();
        hideLoading(true);
    });
</script>

<div id="orderFormDiv">
    <div class="subtitle2">
        <h3> 상품 주문</h3>
    </div>
    <form id="orderForm" name="orderForm">
        <div class="tableWrap">
            <table class="tableB">
                <colgroup>
                    <col style="width:10%;">
                    <col style="width:90%;">
                </colgroup>
                <tbody>
                    <tr>
                        <th class="point"><label for="memberId">주문회원</label></th>
                        <td>
                            <select id="memberId" name="memberId" style="width: 200px" required>
                                <option value="">- 선택 -</option>
                                <c:forEach items="${members}" var="item">
                                    <option value="<c:out value='${item.memberId}'/>">
                                        <c:out value="${item.name}"/>
                                    </option>
                                </c:forEach>
                            </select>
                        </td>
                    </tr>

                    <!-- 다중 주문 상품 영역 -->
                    <tr>
                        <th class="point">주문상품</th>
                        <td>
                            <table class="tableB" style="margin-bottom:8px;">
                                <colgroup>
                                    <col style="width:50%;">
                                    <col style="width:30%;">
                                    <col style="width:20%;">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th><label>상품명</label></th>
                                        <th><label>주문수량</label></th>
                                        <th class="tc">관리</th>
                                    </tr>
                                </thead>
                                <tbody id="orderItemsBody"><!-- 동적 행 영역 --></tbody>
                            </table>

                            <button type="button" id="btnAddRow" class="bluebtn">+ 상품 추가</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </form>

    <div class="btnWrap">
        <p class="tc">
            <a style="cursor:pointer;" class="bluebtn" id="btnSave">
                <i class="xi-save"></i> 신청
            </a>
        </p>
    </div>
</div>
