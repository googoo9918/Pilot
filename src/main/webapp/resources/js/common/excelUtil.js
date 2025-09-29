var excel = {
  download: function (paramJson) {
    if (!paramJson.excelId) {
      gfnAlerMsg('엑셀 ID가 지정되지 않았습니다.');
      return false;
    } else if (!paramJson.excelNm) {
      gfnAlertMsg('엑셀이름이 지정되지 않았습니다.');
      return false;
    }

    $('#excelFrame').remove();
    $('#excelForm').remove();
    $('<iframe id="excelFrame" name="excelFrame" style="display:none;">').appendTo('body');
    $('<form>').attr({
      'id': 'excelForm',
      'action': _CONTEXT_PATH + 'excel/download',
      'target': 'excelFrame',
      'method': 'post'
    }).appendTo('body');


    for (var key in paramJson) {
      $('<input>').attr({
        'type': 'hidden',
        'name': key,
        'value': paramJson[key]
      }).appendTo('form#excelForm');
    }
    $('form#excelForm').submit();
  },
  
  
  downloadJqGrid: function (paramJson, colModel, groupHeaderModel) {
    if (!paramJson.excelId) {
      gfnAlertMsg('엑셀 ID가 지정되지 않았습니다.');
      return false;
    } else if (!paramJson.excelNm) {
      gfnAlertMsg('엑셀이름이 지정되지 않았습니다.');
      return false;
    }

    var excelHeader = new Array();
    var excelGroupHeaderArray = new Array();
    var excelGroupHeader = new Array();
    var excelKey = new Array();
    var paramExcelProp = new Array();
    var paramObj = new Object();
    var paramHeaderObj = new Object();

    paramJson.actionType = 'excelDownload';

    if (groupHeaderModel != undefined) {
      groupHeaderModel.forEach(function (headerModel) {
        excelGroupHeader = [];
        headerModel.forEach(function (header) {
          if (checkUndefined(header.hidden) || !header.hidden) {
            paramHeaderObj = {};

            paramHeaderObj.coltitle = header.coltitle;
            paramHeaderObj.name = header.name;
            paramHeaderObj.width = convertUndefinedToString(header.width, "0");

            excelGroupHeader.push(paramHeaderObj);
          }
        });
        excelGroupHeaderArray.push(excelGroupHeader);
      });
    }

    var excelTotalWidth = 0;

    for (i in colModel) {
      if (checkUndefined(colModel[i].hidden) || !colModel[i].hidden) {

        excelHeader.push(colModel[i].coltitle);
        excelKey.push(colModel[i].name);

        paramObj = {};

        paramObj.coltitle = colModel[i].coltitle;
        paramObj.name = colModel[i].name;
        paramObj.align = convertUndefinedToString(colModel[i].align, "left");
        paramObj.width = convertUndefinedToString(colModel[i].width, "50");

        if (convertUndefinedToString(paramObj.width) != "") {
          excelTotalWidth = excelTotalWidth + parseInt(paramObj.width);
        }
        paramExcelProp.push(paramObj);
      }
    }

    $('#excelDiv').remove();
    $('#excelForm').remove();
    $('<div id="excelDiv" name="excelDiv" style="display:none;">').appendTo('body');
    $('<form>').attr({
      'id': 'excelForm',
      'action': _CONTEXT_PATH + 'excel/downloadJspExcel',
      'target': 'excelFrame',
      'method': 'post'
    }).appendTo('body');

    if (excelGroupHeaderArray.length > 0) {
      paramJson.excelGroupHeader = JSON.stringify(excelGroupHeaderArray);
    }
    paramJson.excelTotalWidth = excelTotalWidth;
    paramJson.excelHeaderRows = excelGroupHeaderArray.length;
    paramJson.excelProp = JSON.stringify(paramExcelProp);

    for (var key in paramJson) {
      $('<input>').attr({
        'type': 'hidden',
        'name': key,
        'value': paramJson[key]
      }).appendTo('form#excelForm');
    }

    $('#excelDiv').hide()
    ajax.updateDivForExcel(
      _CONTEXT_PATH + 'excel/downloadJspExcel',
      $('#excelForm').serializeForm(),
      'excelDiv',
      function () {
        $('#excelForm').remove();
        $('#excelDiv').remove();
      },
      true
    );
  },
  uploadPop: function (excelType, templateName, templatePath, typeGubun, optionParam, confirmCallback) {
    this.uploadPopClose();

    var $div = $('<div id="pop_excelUpload" class="tableWrap">');

    if (typeGubun == "fileUploadList") {
      $('<table class="tableB">').appendTo($div);
      $('  <tbody>').appendTo($div);
      $('    <tr>').appendTo($div);
      $('      <th style="width:200px;padding:5px 10px;border-bottom:1px solid #cacaca;background:#f1f1f1;font-weight:600;color:#000000;text-align:center;font-size:13px;height:30px;">구분</th>').appendTo($div);
      $('      <td style="width:400px;padding:5px 10px;border-bottom:1px solid #cacaca;font-weight:600;color:#000000;text-align:left;font-size:13px;height:30px;">' + optionParam.popUploadTypeNm + '</td>').appendTo($div);
      $('    </tr>').appendTo($div);
      $('  </tbody>').appendTo($div);
      $('</table>').appendTo($div);
      $('<p style="height:30px"></p>').appendTo($div);
    }

    $('<div class="tablePro_right">').appendTo($div);
    $('  <a href="#" id="pop_btnSelect" name="pop_btnSelect" class="bluebtn btn_s">파일선택</a>').appendTo($div);
    $('  <input type="text" id="pop_fileName" value="" class="readonly" readonly="readonly" style="width:340px;margin-left:5px;">').appendTo($div);
    $('  <input type="file" id="pop_file" name="file" style="display:none;" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">').appendTo($div);
    $('  <a href="#" id="pop_btnConfirm" name="pop_btnConfirm" class="bluebtn btn_s">업로드</a>').appendTo($div);
    $('  <a href="#" id="pop_btnClose" name="pop_btnClose" class="bluebtn btn_s">닫기</a>').appendTo($div);
    $('</div>').appendTo($div);

    if (templateName != "") {
      $('<p style="height:30px"></p>').appendTo($div);
      $('<table class="tableB">').appendTo($div);
      $('  <tbody>').appendTo($div);
      $('    <tr>').appendTo($div);
      $('      <th style="width:200px;padding:5px 10px;border-bottom:1px solid #cacaca;background:#f1f1f1;font-weight:600;color:#000000;text-align:center;font-size:13px;height:30px;">양식</th>').appendTo($div);
      $('      <td style="width:400px;padding:5px 10px;border-bottom:1px solid #cacaca;font-weight:600;color:#000000;text-align:center;font-size:13px;height:30px;"><a href="#" id="pop_btnTemplateDownload" name="pop_btnTemplateDownload">' + templateName + '</a></td>').appendTo($div);
      $('    </tr>').appendTo($div);
      $('  </tbody>').appendTo($div);
      $('</table>').appendTo($div);
    }

    $('</div>').appendTo($div);

    $('<div>').appendTo($div);
    $('  <img id="asxLoading" src="/resources/images/loading.gif" style="display:none ; width:50px; height:50px; top : 50%; left :50% ; position:absolute ; margin-top:-25px; margin-left:-25px;opacity: 0.5;">').appendTo($div);
    $('</div>').appendTo($div);


    // 파일선택 버튼 click
    $('#pop_btnSelect', $div).click(function () {
      $('#pop_file', $div).click();
    });

    $('#pop_file', $div).change(function (e) {
      $('#pop_fileName').val($('#pop_file')[0].files[0].name);
    })

    // 업로드 버튼 click
    $('#pop_btnConfirm', $div).click(function () {
      if ($('#pop_file')[0].files[0]) {
        var formData = new FormData();
        formData.append("file", $("#pop_file")[0].files[0]);
        formData.append('excelType', excelType);
        formData.append('excelPopNm', typeGubun);
        formData.append('optionParam', JSON.stringify(optionParam));

        $.ajax({
          url: _CONTEXT_PATH + 'excel/upload.json',
          processData: false,
          contentType: false,
          data: formData,
          type: 'POST',
          success: confirmCallback
        });
      } else {
        gfnAlertMsg('파일을 선택하여 주십시오.');
      }
    })

    // 다운로드 버튼 click
    $('#pop_btnTemplateDownload', $div).click(function () {
      downloadTemplate(templateName, templatePath, typeGubun);
    })

    $('#pop_btnClose', $div).click(this.uploadPopClose);

    var vHeight = "0";
    if (templateName != "" || typeGubun == "fileUploadList") {
      vHeight = "160";
    } else if (typeGubun == "acseReport") {
      vHeight = "190";
    } else {
      vHeight = "120";
    }

    $div.appendTo('#wrap');
    $('#wrap #pop_excelUpload').dialog({
      title: '엑셀업로드',
      autoOpen: false,
      resizable: false,
      height: vHeight,
      width: "560",
      modal: true
    }).dialog('open');
  },
  uploadPopClose: function () {
    if ($("#pop_excelUpload").hasClass('ui-dialog-content')) {
      try {
        $("#pop_excelUpload").dialog('destroy');
      } catch (e) {}
      $("#pop_excelUpload").remove();
    }
  }
}


