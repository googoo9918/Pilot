<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<script>
    var memberForm = {
        init: function () {
            this.set_form();
            this.regist_event();
        },

        set_form: function () {

        },

        regist_event: function () {
            $("#btnSave").click(function () {
                if (!isValid("memberForm")) return;

                gfnAlertMsg2("신청 하시겠습니까?", function () {
                    var formData = $('#memberForm').serializeForm();

                    ajax.postRequest("/api/members", formData, function (res) {
                        gfnAlertMsg2("신청이 완료되었습니다.", function () {
                            goScreenSubmit("/main");
                        })
                    })
                })
            })
        }
    }

    $(document).ready(function () {
        memberForm.init();
        hideLoading(true);
    });
</script>
<div id="memberFormDiv">
    <div class="subtitle2">
        <h3> 회원 가입</h3>
    </div>
    <form id="memberForm" name="memberForm">
        <div class="tableWrap">
            <table class="tableB">
                <colgroup>
                    <col style="width:10%;">
                    <col style="width:40%;">
                    <col style="width:10%;">
                    <col style="width:40%;">
                </colgroup>
                <tbody>
                    <tr>
                        <th class="point"><label for="name">이름</label></th>
                        <td><input type="text" id="name" name="name" style="width:80%" required/></td>
                        <th class="point"><label for="city">도시</label></th>
                        <td><input type="text" id="city" name="city" style="width:80%" required/></td>
                    </tr>
                    <tr>
                        <th class="point"><label for="street">거리</label></th>
                        <td><input type="text" id="street" name="street" style="width:80%" required/></td>
                        <th class="point"><label for="zipcode">우편번호</label></th>
                        <td><input type="text" id="zipcode" name="zipcode" style="width:80%" required/></td>
                    </tr>
                    <tr>
                        <th class="point">
                            연락처
                        </th>
                        <td colspan="3">
                            <select id="phonePrefix" name="phonePrefix" style="width: 65px; display: inline-block;">
                                <option value="010">010</option>
                                <option value="011">011</option>
                                <option value="016">016</option>
                                <option value="017">017</option>
                                <option value="018">018</option>
                                <option value="019">019</option>
                            </select>
                            -
                            <input type="text" id="phoneMiddle" name="phoneMiddle"
                                   style="width: 65px; display: inline-block;" maxlength="4"/>
                            -
                            <input type="text" id="phoneLast" name="phoneLast" style="width: 65px; display: inline-block;"
                                   maxlength="4"/>
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