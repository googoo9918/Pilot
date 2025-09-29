/**
 * 기준 대상의 높이를 기준으로 jqGrid의 사이즈를 조정
 *
 * @param {string} reqParam.baseId 높이 기준이 되는 영역의 id
 * @param {string} reqParam.gridId jqGrid의 id
 * @param {string} reqParam.pagerId pager 영역의 id
 * @param {number} reqParam.manualAdj 임의보정값
 * @param {number} reqParam.titleRowCnt 헤더(타이틀)의 row 수
 */
function adjustJqGridHeight(reqParam) {
  let baseId = reqParam.baseId||'';
  let gridId = reqParam.gridId||'';
  let pagerId = reqParam.pagerId||'';
  let manualAdj = reqParam.manualAdj||0;
  let titleRowCnt = reqParam.titleRowCnt||1;

  let baseHeight = 0;

  if (baseId == "window") {
    baseHeight = window.innerHeight;
  } else {
    baseHeight = $("#" + baseId).height();
  }

  let pagerHeight = 13;
  let manualAdjHeight = 0;

  if (!isNull(pagerId) && $("#" + pagerId).height() > 0) {
    pagerHeight = $("#" + pagerId).height();
  }

  if (!isNull(manualAdj)) {
    manualAdjHeight = manualAdj;
  }
  
  let adjHeightByTitleRowCnt = (titleRowCnt - 1) * 27;

  $("#gbox_" + gridId).height(baseHeight + manualAdjHeight + 1);
  $("#gbox_" + gridId).css("backgroundColor", "#ECECEC");
  $("#gbox_" + gridId + " .ui-jqgrid-view").height(baseHeight - pagerHeight + manualAdjHeight - adjHeightByTitleRowCnt - 1);
  $("#gbox_" + gridId + " .ui-jqgrid-bdiv").height(baseHeight - 2 * pagerHeight + manualAdjHeight - adjHeightByTitleRowCnt - 4);

  $("#gview_" + gridId).css("maxHeight", baseHeight - pagerHeight + manualAdjHeight + "px");
  $("#gview_" + gridId).height(baseHeight - pagerHeight + manualAdjHeight - 1);
  $("#gview_" + gridId + " .ui-jqgrid-bdiv").css("maxHeight", baseHeight + manualAdjHeight + "px");
}
