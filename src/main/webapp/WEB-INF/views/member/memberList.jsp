<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<script>
    var memberList = {
        init: function () {
            showLoading();
            this.render_grid();
            this.regist_event();
        },
        render_grid: function () {
            var memberColModel = [
                {coltitle: '이름', name: 'name', align: 'center', sortable: false, editable: false},
                {coltitle: '도시', name: 'city', align: 'center', sortable: false, editable: false},
                {
                    coltitle: '주소',
                    name: 'street',
                    align: 'center',
                    sortable: false,
                    editable: false,
                    classes: 'ui-ellipsis'
                },
                {coltitle: '우편번호', name: 'zipcode', align: 'center', sortable: false, editable: false},
            ]

            var memberColNames = new Array();

            for (i in memberColModel) {
                memberColNames.push(memberColModel[i].coltitle);
            }

            var $grid = $('#memberGrid');
            $grid.jqGrid({
                url: '/api/members',
                datatype: "json",
                mtype: "get",
                postData: {},
                jsonReader: {
                    root: function (obj) {
                        return Array.isArray(obj) ? obj : [];
                    },
                    repeatitems: false,
                    id: 'memberId'
                },
                colNames: memberColNames,
                colModel: memberColModel,

                // --------- paging option start ----------- //
                pgbuttons: false,
                viewrecords: false,
                pgtext: "",
                pginput: false,
                // --------- paging option end ----------- //

                height: '500',        // 그리드의 높이를 지정
                loadui: 'disable',

                autoWidth: true,
                shrinkToFit: true,   // Grid 전체 넓이에 맞춰서 자동으로 컬럼크기를 설정함 (default : true)
                cellEdit: false,
                rownumbers: false,
                rowNum: -1,           // 전체건 표기

                beforeSelectRow: function (rowid, e) {
                    return false;
                },

                // 그리드 건수 출력
                gridComplete: function () {
                    $('#total_td').html("전체 <strong>" + $('#memberGrid').getGridParam('records') + "</strong>건");
                },
                // 데이터 이후 실행 콜백 함수
                loadComplete: function (data) {
                    $("#list_nodata").remove();

                    if (Array.isArray(data) && data.length === 0) { // 정상, 데이터 없음
                        $("#memberGrid.ui-jqgrid-btable").after("<p id='list_nodata' style='margin-top:20px;text-align:center;font-size:16px;'>조회된 데이터가 없습니다.</p>");
                        hideLoading(true);
                        commonGridResize("memberGrid", "memberGridArea"); /* jqGrid 넓이 보정 */
                    } else {
                        // 정상 응답이고 데이터가 있는 경우
                        hideLoading(true);
                        commonGridResize("memberGrid", "memberGridArea"); /* jqGrid 넓이 보정 */
                    }
                },

                loadError: function (xhr, status, error) {
                    // JSON 응답 파싱
                    var response = xhr.responseJSON;

                    // errorMessage 표시
                    if (response && response.errorMessage) {
                        $("#memberGrid.ui-jqgrid-btable").after("<p id='list_nodata' style='margin-top:20px;text-align:center;font-size:16px;color:red;'>"
                            + "데이터 로드에 실패했습니다. 관리자에게 문의해 주세요.<br>" + response.errorMessage + "</p>");
                    }

                    hideLoading(true);
                    commonGridResize("memberGrid", "memberGridArea");
                }
            });

            //브라우져 Resize Event
            window.addEventListener("resize", () => commonGridResize("memberGrid", "memberGridArea"));
        },
        regist_event: function () {

        }
        // ,getSearchParam: function () {
        //     var searchParam = $('#memberListForm').serializeForm();
        //
        //     return searchParam;
        // }
    }

    $(document).ready(function () {
        memberList.init();
    });
</script>
<div id="memberList">
    <!-- search form -->
    <%--    <form id="memberListForm" name="memberListForm">--%>
    <%--        <div class="tableWrap">--%>
    <%--            <table class="tableB">--%>
    <%--                <colgroup>--%>
    <%--                    <col width="5%">--%>
    <%--                    <col width="20%">--%>
    <%--                    <col width="5%">--%>
    <%--                    <col width="20%">--%>
    <%--                    <col width="5%">--%>
    <%--                    <col width="20%">--%>
    <%--                    <col width="6%">--%>
    <%--                    <col width="19%">--%>
    <%--                </colgroup>--%>
    <%--                <tbody>--%>
    <%--                    <tr>--%>
    <%--                        <th>이름</th>--%>
    <%--                        <td>--%>
    <%--                            <input type="text" id="name" name="name" style="width: 50%" placeholder="이름">--%>
    <%--                        </td>--%>
    <%--                        <th>도시</th>--%>
    <%--                        <td>--%>
    <%--                            <input type="text" id="city" name="city" style="width: 50%" placeholder="도시">--%>
    <%--                        </td>--%>
    <%--                        <th>주소</th>--%>
    <%--                        <td>--%>
    <%--                            <input type="text" id="street" name="street" style="width: 50%" placeholder="주소">--%>
    <%--                        </td>--%>
    <%--                        <th>우편번호</th>--%>
    <%--                        <td>--%>
    <%--                            <input type="text" id="zipcode" name="zipcode" style="width: 50%" placeholder="우편번호">--%>
    <%--                        </td>--%>
    <%--                    </tr>--%>
    <%--                </tbody>--%>
    <%--            </table>--%>
    <%--        </div>--%>
    <%--    </form>--%>
    <div class="subtitle2">
        <h3> 회원 목록</h3>
    </div>
    <div class="tableProArea">
        <div class="tablePro_total" id="total_td">전체 <strong>0</strong>건</div>
        <div class="tablePro_right">
            <p>
                <a style="cursor:pointer;" id="btnSearch" class="bluebtn"><i class="xi-search"></i> 조회</a>
            </p>
        </div>
    </div>
    <div class="tableWrap" id="memberGridArea">
        <table id="memberGrid"></table>
    </div>
</div>
