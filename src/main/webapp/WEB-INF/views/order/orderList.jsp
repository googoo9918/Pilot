<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<script>
    var orderList = {
        init: function () {
            showLoading();
            this.render_grid();
            this.regist_event();
        },
        render_grid: function () {
            var orderColModel = [
                {coltitle: '주문상품Id', name: 'orderItemId', width: 0, hidden: true},
                {coltitle: '주문번호', name: 'orderId', align: 'center', width: 25, sortable: false, editable: false},
                {coltitle: '상품번호', name: 'itemId', align: 'center', width: 25, sortable: false, editable: false},
                {coltitle: '회원명', name: 'memberName', align: 'center', width: 50, sortable: false, editable: false},
                {coltitle: '상품명', name: 'itemName', align: 'center', width: 50, sortable: false, editable: false},
                {coltitle: '가격', name: 'orderPrice', align: 'center', width: 50, sortable: false, editable: false},
                {coltitle: '수량', name: 'count', align: 'center', width: 50, sortable: false, editable: false},
                {coltitle: '상태', name: 'orderStatus', align: 'center', width: 50, sortable: false, editable: false},
                {
                    coltitle: '주소',
                    name: 'address',
                    align: 'center',
                    width: 100,
                    sortable: false,
                    editable: false,
                    classes: 'ui-ellipsis'
                },
                {coltitle: '우편번호', name: 'zipcode', align: 'center', width: 50, sortable: false, editable: false},
                {coltitle: '일시', name: 'orderDate', align: 'center', width: 100, sortable: false, editable: false},
                {
                    coltitle: '삭제',
                    name: 'actions',
                    align: 'center',
                    width: 50,
                    sortable: false,
                    formatter: orderList.renderLink,
                    classes: 'ui-click-nc'
                }
            ]

            var orderColNames = new Array();

            for (i in orderColModel) {
                orderColNames.push(orderColModel[i].coltitle);
            }

            var $grid = $('#orderGrid');
            $grid.jqGrid({
                url: '/api/orders',
                datatype: "json",
                mtype: "get",
                postData: {},
                colNames: orderColNames,
                colModel: orderColModel,

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
                    $('#total_td').html("전체 <strong>" + $('#orderGrid').getGridParam('records') + "</strong>건");
                },
                // 데이터 이후 실행 콜백 함수
                loadComplete: function (data) {
                    $("#list_nodata").remove();

                    if (Array.isArray(data) && data.length === 0) { // 정상, 데이터 없음
                        $("#orderGrid.ui-jqgrid-btable").after("<p id='list_nodata' style='margin-top:20px;text-align:center;font-size:16px;'>조회된 데이터가 없습니다.</p>");
                        hideLoading(true);
                        commonGridResize("orderGrid", "orderGridArea"); /* jqGrid 넓이 보정 */
                    } else {
                        // 정상 응답이고 데이터가 있는 경우
                        hideLoading(true);
                        commonGridResize("orderGrid", "orderGridArea"); /* jqGrid 넓이 보정 */
                    }
                },

                loadError: function (xhr, status, error) {
                    // JSON 응답 파싱
                    var response = xhr.responseJSON;

                    // errorMessage 표시
                    if (response && response.errorMessage) {
                        $("#orderGrid.ui-jqgrid-btable").after("<p id='list_nodata' style='margin-top:20px;text-align:center;font-size:16px;color:red;'>"
                            + "데이터 로드에 실패했습니다. 관리자에게 문의해 주세요.<br>" + response.errorMessage + "</p>");
                    }

                    hideLoading(true);
                    commonGridResize("orderGrid", "orderGridArea");
                }
            });

            //브라우져 Resize Event
            window.addEventListener("resize", () => commonGridResize("orderGrid", "orderGridArea"));
        },
        regist_event: function () {

        },
        renderLink: function (cellValue, options, rowObject) {
            // ORDER 상태인 경우에만 삭제 버튼 표시
            if (rowObject.orderStatus === 'ORDER') {
                return '<span style="cursor:pointer; color: red;"'
                    + ' onclick="orderList.deleteOrder(' + rowObject.itemId + ')">'
                    + '삭제</span>';
            } else {
                return '<span style="color: gray;">취소됨</span>';
            }
        },
        deleteOrder: function (orderId) {
            gfnConfirmMsg("취소 하시겠습니까?", function () {
                showLoading();
                setTimeout(function () {
                    ajax.deleteRequest("/api/orders/" + orderId, {}, function (res) {
                        // 그리드 새로고침
                        $('#orderGrid').trigger('reloadGrid');
                    }, 200)
                });
            })
        }

    }

    $(document).ready(function () {
        orderList.init();
    });
</script>
<div id="orderList">
    <div class="subtitle2">
        <h3> 주문 내역</h3>
    </div>
    <div class="tableProArea">
        <div class="tablePro_total" id="total_td">전체 <strong>0</strong>건</div>
    </div>
    <div class="tableWrap" id="orderGridArea">
        <table id="orderGrid"></table>
    </div>
</div>
