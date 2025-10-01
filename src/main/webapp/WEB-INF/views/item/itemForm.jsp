<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<script>
    var itemForm = {
        init: function () {
            this.set_form();
            this.regist_event();
        },

        set_form: function () {

        },

        regist_event: function () {
            $("#btnSave").click(function () {
                if (!isValid("itemForm")) return;

                gfnConfirmMsg("신청 하시겠습니까?", function () {
                    showLoading();
                    setTimeout(function () {
                        var formData = $('#itemForm').serializeForm();

                        ajax.postRequest("/api/items", formData, function (res) {
                            goScreenSubmit("/main");
                        })
                    }, 200);
                })
            });
        }
    }

    $(document).ready(function () {
        itemForm.init();
        hideLoading(true);
    });
</script>
<div id="itemFormDiv">
    <div class="subtitle2">
        <h3> 상품 등록</h3>
    </div>
    <form id="itemForm" name="itemForm">
        <div class="tableWrap">
            <table class="tableB">
                <colgroup>
                    <col style="width:10%;">
                    <col style="width:40%;">
                </colgroup>
                <tbody>
                    <tr>
                        <th class="point"><label for="name">상품명</label></th>
                        <td><input type="text" id="name" name="name" style="width:90%" required/></td>
                    </tr>
                    <tr>
                        <th class="point"><label for="price">가격</label></th>
                        <td><input type="text" id="price" name="price" style="width:90%" required/></td>
                    </tr>
                    <tr>
                        <th class="point"><label for="stockQuantity">수량</label></th>
                        <td><input type="text" id="stockQuantity" name="stockQuantity" style="width:90%" required/></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </form>

    <div class="btnWrap">
        <p class="tc">
            <a style="cursor:pointer;" class="bluebtn" id="btnSave">
                <i class="xi-save"></i> 등록
            </a>
        </p>
    </div>
</div>