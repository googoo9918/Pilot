<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<script>
    var orderForm = {
        init: function () {
            this.set_form();
            this.regist_event();
        },

        set_form: function () {

        },

        regist_event: function () {
            $("#btnSave").click(function () {
                if (!isValid("orderForm")) return;

                gfnConfirmMsg("신청 하시겠습니까?", function () {
                    showLoading();
                    setTimeout(function () {
                        var formData = $('#orderForm').serializeForm();

                        ajax.postRequest("/api/orders", formData, function (res) {
                            goScreenSubmit("/main");
                        })
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
                        <th class="point"><label for="mebmer">주문회원</label></th>
                        <td>
                            <select id="mebmer" name="mebmer" style="width: 200px" required>
                                <option value="">- 선택 -</option>
                                <c:forEach items="${member}" var="item">
                                    <option value="<c:out value='${item.memberId}'/>">
                                        <c:out value="${item.name}"/>
                                    </option>
                                </c:forEach>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th class="point"><label for="item">상품명</label></th>
                        <td>
                            <select id="item" name="item" style="width: 200px" required>
                                <option value="">- 선택 -</option>
                                <c:forEach items="${item}" var="item">
                                    <option value="<c:out value='${item.itemId}'/>">
                                        <c:out value="${item.name}"/>
                                    </option>
                                </c:forEach>
                            </select>
                        </td>
                    </tr>
                    <tr>

                        <th class="point"><label for="count">주문수량</label></th>
                        <td>
                            <select id="count" name="count" style="width: 200px; display: inline-block;">
                                <c:forEach var="i" begin="1" end="10">
                                    <option value="${i}">${i}</option>
                                </c:forEach>
                            </select>
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