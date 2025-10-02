<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<script>
    var itemList = {
        init: function () {
            showLoading();
            this.render_grid();
            this.regist_event();
        },
        render_grid: function () {
            var itemColModel = [
                {coltitle: '상품Id', name: 'itemId', width: 0, hidden: true},
                {coltitle: '상품명', name: 'name', align: 'center', width: 100, sortable: false, editable: false},
                {coltitle: '가격', name: 'price', align: 'center', width: 50, sortable: false, editable: false},
                {
                    coltitle: '재고수량',
                    name: 'stockQuantity',
                    align: 'center',
                    width: 50,
                    sortable: false,
                    editable: false
                },
                {
                    coltitle: '관리',
                    name: 'actions',
                    align: 'center',
                    width: 50,
                    sortable: false,
                    formatter: itemList.renderLink,
                    classes: 'ui-click-nc'
                }
            ]

            var itemColNames = new Array();

            for (i in itemColModel) {
                itemColNames.push(itemColModel[i].coltitle);
            }

            var $grid = $('#itemGrid');
            $grid.jqGrid({
                url: '/api/items',
                datatype: "json",
                mtype: "get",
                postData: {},
                colNames: itemColNames,
                colModel: itemColModel,

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
                    $('#total_td').html("전체 <strong>" + $('#itemGrid').getGridParam('records') + "</strong>건");
                },
                // 데이터 이후 실행 콜백 함수
                loadComplete: function (data) {
                    $("#list_nodata").remove();

                    if (Array.isArray(data) && data.length === 0) { // 정상, 데이터 없음
                        $("#itemGrid.ui-jqgrid-btable").after("<p id='list_nodata' style='margin-top:20px;text-align:center;font-size:16px;'>조회된 데이터가 없습니다.</p>");
                        hideLoading(true);
                        commonGridResize("itemGrid", "itemGridArea"); /* jqGrid 넓이 보정 */
                    } else {
                        // 정상 응답이고 데이터가 있는 경우
                        hideLoading(true);
                        commonGridResize("itemGrid", "itemGridArea"); /* jqGrid 넓이 보정 */
                    }
                },

                loadError: function (xhr, status, error) {
                    // JSON 응답 파싱
                    var response = xhr.responseJSON;

                    // errorMessage 표시
                    if (response && response.errorMessage) {
                        $("#itemGrid.ui-jqgrid-btable").after("<p id='list_nodata' style='margin-top:20px;text-align:center;font-size:16px;color:red;'>"
                            + "데이터 로드에 실패했습니다. 관리자에게 문의해 주세요.<br>" + response.errorMessage + "</p>");
                    }

                    hideLoading(true);
                    commonGridResize("itemGrid", "itemGridArea");
                }
            });

            //브라우져 Resize Event
            window.addEventListener("resize", () => commonGridResize("itemGrid", "itemGridArea"));
        },
        regist_event: function () {

        },
        renderLink: function (cellValue, options, rowObject) {
            return '<span style="cursor:pointer;"'
                + ' onclick="goScreenSubmit(\'/item/itemForm\', {itemId: \'' + rowObject.itemId + '\'})">'
                + '수정</span>';
        }

    }

    $(document).ready(function () {
        itemList.init();
    });
</script>
<div id="itemList">
    <div class="subtitle2">
        <h3> 회원 목록</h3>
    </div>
    <div class="tableProArea">
        <div class="tablePro_total" id="total_td">전체 <strong>0</strong>건</div>
    </div>
    <div class="tableWrap" id="itemGridArea">
        <table id="itemGrid"></table>
    </div>
</div>
