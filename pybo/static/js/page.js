
/*  ********************** utils **********************  */

/* tab 초기화 */
function initTab(ele) {
    $('ul.tab li:eq(1)').removeClass('active');
    $('.tabcont').removeClass('active');
    $('ul.tab li:eq(0)').addClass('active'); // 탭 활성화
    $('#' + ele).addClass('active');
}
/* checkbox 초기화 */
function initCheckbox(eleNm) {
    // 초기화할 checkbox 선택
    const checkboxes = document.getElementsByName(eleNm);

    // 체크박스 목록을 순회하며 checked 값을 초기화
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    })
}

/* 숫자를 세자리마다 콤마를 찍어주는 함수 */
function numberFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/* 숫자를 한국 통화로 변환하는 함수 */
function numberToKorean(number) {
    var inputNumber = number < 0 ? false : number;
    var unitWords = ['', '만', '억', '조', '경'];
    var splitUnit = 10000;
    var splitCount = unitWords.length;
    var resultArray = [];
    var resultString = '';

    for (var i = 0; i < splitCount; i++) {
        var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
        unitResult = Math.floor(unitResult);
        if (unitResult > 0) {
            resultArray[i] = unitResult;
        }
    }

    for (var i = 0; i < resultArray.length; i++) {
        if (!resultArray[i]) continue;
        resultString = String(numberFormat(resultArray[i])) + unitWords[i] + resultString;
    }

    return resultString + "원";
}

/* null, undefined, "" 일 경우 defaultStr로 치환 */
function nvl(str, defaultStr) {
    if (typeof str == "undefined" || str == null || str == "")
        str = defaultStr;

    return str;
}
/* 탭 이동 */
$(function () {
    $('ul.tab li').click(function () {
        let activeTab = $(this).attr('data-tab');

        $('ul.tab li').removeClass('active');
        $('.tabcont').removeClass('active');

        $(this).addClass('active');
        $('#' + activeTab).addClass('active');
    })
});

/*  ********************** page **********************  */

/* 선택 항목 추가 */
function addOptsBtn(id) {
    let i = $('#' + id + ' .subitem-box').length;
    let add_item = "";
    console.log(id + "   ", i, "개");
    if (i == 0) {
        i = 1;
        if (id === "frm_property") {
            add_item = optionItemEleFactory(i, id);
            $("#optsWrap2").append(add_item);
        } else if (id === "frm_center") {
            add_item = optionItemEleFactory(i, id);
            $("#optsWrap1").append(add_item);
        }

    } else if (i > 0 && i < 15) {
        if (id === "frm_property") {
            add_item = optionItemEleFactory(i + 1, id);
            $("#optsWrap2").append(add_item);
        } else if (id === "frm_center") {
            add_item = optionItemEleFactory(i + 1, id);
            $("#optsWrap1").append(add_item);
        }

    } else {
        alert("선택항목은 최대 15개까지 추가할 수 있습니다.");
        return false;
    }
};
/* 선택 항목 div Element 생성 */
function optionItemEleFactory(idx, schema) {
    let add_option = "";
    if (schema === "frm_property") {
        add_option = '<div class="subitem-box multi-box">' +
            '<div class="box short">' +
            '<input class="form-control" name="option' + (idx) + 'Nm" id="option' + (idx) + 'Nm-p" maxlength="100" placeholder="제목" type="text" value="" />' +
            '</div>' +
            '<div class="box long">' +
            '<input class="form-control"  name="option' + (idx) + 'Desc" id="option' + (idx) + 'Desc-p" maxlength="100" placeholder="선택항목을 입력하세요." type="text" value="" />' +
            '</div>' +
            `<button type="button" class="btn btn-light" onclick="removeOptsBtn(this,'` + schema + `')">삭제</button>` +
            '</div>';
    } else if (schema === "frm_center") {
        add_option = '<div class="subitem-box multi-box">' +
            '<div class="box short">' +
            '<input class="form-control" name="option' + (idx) + 'Nm" id="option' + (idx) + 'Nm" maxlength="100" placeholder="제목" type="text" value="" />' +
            '</div>' +
            '<div class="box long">' +
            '<input class="form-control"  name="option' + (idx) + 'Desc" id="option' + (idx) + 'Desc" maxlength="100" placeholder="선택항목을 입력하세요." type="text" value="" />' +
            '</div>' +
            `<button type="button" class="btn btn-light" onclick="removeOptsBtn(this,'` + schema + `')">삭제</button>` +
            '</div>';
    }

    return add_option;
}
/* 선택 항목 초기화  */
function removeAllOptsBtn() {
    $('#optsWrap1').empty();
    $('#optsWrap2').empty();
};

/* 선택 항목 삭제 */
function removeOptsBtn(self, schema) {
    // console.log("option item 삭제, id : " + schema);

    $(self).parent().remove();
    changeOptsName(schema);
};

/* 선택 항목 속성 (name, id) 변경 */
function changeOptsName(schema) {
    if (schema === "frm_property") {

        let i = $('#' + schema + ' .subitem-box').length;
        for (let j = 0; j < (i + 1); j++) {
            $('#' + schema + ' .subitem-box').eq(j).find('input').eq(0).attr('name', 'option' + (j + 1) + 'Nm');
            $('#' + schema + ' .subitem-box').eq(j).find('input').eq(0).attr('id', 'option' + (j + 1) + 'Nm-p');
            $('#' + schema + ' .subitem-box').eq(j).find('input').eq(1).attr('name', 'option' + (j + 1) + 'Desc');
            $('#' + schema + ' .subitem-box').eq(j).find('input').eq(1).attr('id', 'option' + (j + 1) + 'Desc-p');
        }

    } else if (schema === "frm_center") {
        // console.log(" #### 선택 항목 (name, id) 변경 #### ");
        let i = $('#' + schema + ' .subitem-box').length;
        // console.log("last option index : " + i);
        for (let j = 0; j < (i + 1); j++) {
            // console.log("선택항목 (name, id) : " + j);
            $('#' + schema + ' .subitem-box').eq(j).find('input').eq(0).attr('name', 'option' + (j + 1) + 'Nm');
            $('#' + schema + ' .subitem-box').eq(j).find('input').eq(0).attr('id', 'option' + (j + 1) + 'Nm');
            $('#' + schema + ' .subitem-box').eq(j).find('input').eq(1).attr('name', 'option' + (j + 1) + 'Desc');
            $('#' + schema + ' .subitem-box').eq(j).find('input').eq(1).attr('id', 'option' + (j + 1) + 'Desc');
        }
    }
};

/* 마이맵 리스트 div 요소 생성  */
function createDivCardArea() {
    let tagArea = document.getElementById('mymapList');
    let divCardHeader = document.createElement('div');
    divCardHeader.setAttribute('class', 'card-header');

    let cardHeaderInner = " 마이맵 리스트 ";
    cardHeaderInner += `    <button type="button" onclick="openMymapList('0')" class="btn btn-light">닫기</button>`;
    divCardHeader.innerHTML = cardHeaderInner;

    tagArea.appendChild(divCardHeader);

    let divCardBody = document.createElement('div');
    divCardBody.setAttribute('class', 'card-body');
    divCardBody.setAttribute('id', 'load-data');
    tagArea.appendChild(divCardBody);
}

/* 부동산 데이터 삭제 클릭 */
$(document).on('click', '#delete-p', function (e) {
    if (confirm("해당 마커 정보를 삭제하시겠습니까?")) {
        let seq = $(this).data("seq");
        let schema = $(this).data("schema");
        console.log("seq : " + seq + ", schema : " + schema);
        if (schema == 'property') {
            $.ajax({
                url: "/deleteproperty",
                type: "POST",
                data: JSON.stringify({ property_seq: seq }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data == "1") {
                        loaddata();
                        alert('삭제 완료되었습니다.');
                    } else {
                        alert("Can't Delete Record.");
                    }
                }
            });
        }
    }
});

/* 교육기관 데이터 삭제 클릭 */
$(document).on('click', '#delete', function (e) {
    if (confirm("해당 마커 정보를 삭제하시겠습니까?")) {
        let seq = $(this).data("seq");
        let schema = $(this).data("schema");

        if (schema == 'center') {
            $.ajax({
                url: "/deletecenter",
                type: "POST",
                data: JSON.stringify({ center_seq: seq }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data == "1") {
                        loaddata();
                        alert('삭제 완료되었습니다.');
                    } else {
                        alert("Can't Delete Record.");
                    }
                }
            });
        }
    }
});


/* 부동산 데이터 수정 팝업 오픈  */
$(document).on("click", "#edit-p", function (e) {
    let seq = $(this).data("seq");
    // console.log("seq: " + seq);
    $.ajax({
        url: "/detailproperty/" + seq,
        type: "get",
        success: function (rdata) {
            // console.log(rdata);
            let property = rdata.property;
            if (property == null || property == undefined || property == "") {
                alert("데이터가 없습니다.");
            } else {
                $('#popup_layer').show();

                // 부동산 탭 활성화
                $('ul.tab li:eq(0)').removeClass('active');
                $('.tabcont').removeClass('active');
                $('ul.tab li:eq(1)').addClass('active'); // 클릭한 탭에 해당하는 메뉴만 활성화
                $('#popup_property').addClass('active');
                console.log("데이터 수정 팝업 오픈");

                // 선택 항목 입력 영역 초기화
                removeAllOptsBtn();

                // 선택 항목 입력 영역 생성
                addOptsBtn("frm_center");
                addOptsBtn("frm_property");

                // 체크박스 선택 항목
                let undrgrndYn = property.undrgrnd_yn;
                let tradingState = property.trading_state;
                console.log("undrgrndYn: " + undrgrndYn);
                console.log("tradingState: " + tradingState);
                // 필수항목
                $('#propertySeq').val(seq);
                $('#propertyNm').val(property.property_nm);
                $('#propertyDesc').val(property.property_desc);
                $('#address2').val(property.address);
                $('#propertyLat').val(property.lat);
                $('#propertyLng').val(property.lng);
                $('#detailAddress2').val(property.detail_address);
                $('#areaFeet').val(property.area_feet);
                $('#floor').val(property.floor);
                $('#price').val(property.price);

                if (undrgrndYn === "Y") {
                    $("#undrgrndYn").prop("checked", true);
                } else {
                    $("#undrgrndYn").prop("checked", false);
                }

                if (tradingState === "A") {
                    $("#tradeState-1").prop("checked", true);
                } else if (tradingState === "P") {
                    $("#tradeState-2").prop("checked", true);
                } else if (tradingState === "R") {
                    $("#tradeState-3").prop("checked", true);
                } else if (tradingState === "T") {
                    $("#tradeState-4").prop("checked", true);
                }

                // 선택항목
                if (property.option1_nm.length > 0) {

                    $('#option1Nm-p').val(property.option1_nm);
                    $('#option1Desc-p').val(property.option1_desc);
                }
                if (property.option2_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option2Nm-p').val(property.option2_nm);
                    $('#option2Desc-p').val(property.option2_desc);
                }
                if (property.option3_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option3Nm-p').val(property.option3_nm);
                    $('#option3Desc-p').val(property.option3_desc);
                }
                if (property.option4_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option4Nm-p').val(property.option4_nm);
                    $('#option4Desc-p').val(property.option4_desc);
                }
                if (property.option5_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option5Nm-p').val(property.option5_nm);
                    $('#option5Desc-p').val(property.option5_desc);
                }
                if (property.option6_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option6Nm-p').val(property.option6_nm);
                    $('#option6Desc-p').val(property.option6_desc);
                }
                if (property.option7_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option7Nm-p').val(property.option7_nm);
                    $('#option7Desc-p').val(property.option7_desc);
                }
                if (property.option8_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option8Nm-p').val(property.option8_nm);
                    $('#option8Desc-p').val(property.option8_desc);
                }
                if (property.option9_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option9Nm-p').val(property.option9_nm);
                    $('#option9Desc-p').val(property.option9_desc);
                }
                if (property.option10_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option10Nm-p').val(property.option10_nm);
                    $('#option10Desc-p').val(property.option10_desc);
                }
                if (property.option11_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option11Nm-p').val(property.option11_nm);
                    $('#option11Desc-p').val(property.option11_desc);
                }
                if (property.option12_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option12Nm-p').val(property.option12_nm);
                    $('#option12Desc-p').val(property.option12_desc);
                }
                if (property.option13_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option13Nm-p').val(property.option13_nm);
                    $('#option13Desc-p').val(property.option13_desc);
                }
                if (property.option14_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option14Nm-p').val(property.option14_nm);
                    $('#option14Desc-p').val(property.option14_desc);
                }
                if (property.option15_nm.length > 0) {
                    addOptsBtn('frm_property');
                    $('#option15Nm-p').val(property.option15_nm);
                    $('#option15Desc-p').val(property.option15_desc);
                }

            }
        }, error: function (result) {
            console.log(result);
        }
    });
});
/* 교육기관 데이터 수정 팝업 오픈  */
$(document).on("click", "#edit", function (e) {
    let seq = $(this).data("seq");
    // console.log("seq: " + seq);
    $.ajax({
        url: "/detailcenter/" + seq,
        type: "get",
        success: function (rdata) {
            // console.log(rdata);
            let center = rdata.center;
            if (center == null || center == undefined || center == "") {
                alert("데이터가 없습니다.");
            } else {
                $('#popup_layer').show();
                console.log("데이터 수정 팝업 오픈");

                // 선택 항목 입력 영역 초기화
                removeAllOptsBtn();

                // 선택 항목 입력 영역 생성
                addOptsBtn("frm_center");
                addOptsBtn("frm_property");

                // 체크박스 체크 항목
                let checkedTarget = center.target.split(',');
                let checkedSubject = center.subject.split(',');
                console.log(checkedTarget);
                console.log(checkedSubject);

                // 필수항목
                $('#centerSeq').val(seq);
                $('#centerNm').val(center.center_nm);
                $('#centerDesc').val(center.center_desc);
                $('#brandNm').val(center.brand_nm).prop("selected", true);
                $('#branchNm').val(center.branch_nm).prop("selected", true);
                $('#address1').val(center.address);
                $('#centerLat').val(center.lat);
                $('#centerLng').val(center.lng);
                $('#detailAddress1').val(center.detail_address);

                for (let nArrCnt in checkedTarget) {
                    $("input[name=target][value=" + checkedTarget[nArrCnt] + "]").prop("checked", true);
                }
                for (let nArrCnt in checkedSubject) {
                    $("input[name=subject][value=" + checkedSubject[nArrCnt] + "]").prop("checked", true);
                }

                // 선택항목
                if (center.option1_nm.length > 0) {
                    $('#option1Nm').val(center.option1_nm);
                    $('#option1Desc').val(center.option1_desc);
                }
                if (center.option2_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option2Nm').val(center.option2_nm);
                    $('#option2Desc').val(center.option2_desc);
                }
                if (center.option3_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option3Nm').val(center.option3_nm);
                    $('#option3Desc').val(center.option3_desc);
                }
                if (center.option4_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option4Nm').val(center.option4_nm);
                    $('#option4Desc').val(center.option4_desc);
                }
                if (center.option5_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option5Nm').val(center.option5_nm);
                    $('#option5Desc').val(center.option5_desc);
                }
                if (center.option6_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option6Nm').val(center.option6_nm);
                    $('#option6Desc').val(center.option6_desc);
                }
                if (center.option7_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option7Nm').val(center.option7_nm);
                    $('#option7Desc').val(center.option7_desc);
                }
                if (center.option8_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option8Nm').val(center.option8_nm);
                    $('#option8Desc').val(center.option8_desc);
                }
                if (center.option9_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option9Nm').val(center.option9_nm);
                    $('#option9Desc').val(center.option9_desc);
                }
                if (center.option10_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option10Nm').val(center.option10_nm);
                    $('#option10Desc').val(center.option10_desc);
                }
                if (center.option11_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option11Nm').val(center.option11_nm);
                    $('#option11Desc').val(center.option11_desc);
                }
                if (center.option12_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option12Nm').val(center.option12_nm);
                    $('#option12Desc').val(center.option12_desc);
                }
                if (center.option13_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option13Nm').val(center.option13_nm);
                    $('#option13Desc').val(center.option13_desc);
                }
                if (center.option14_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option14Nm').val(center.option14_nm);
                    $('#option14Desc').val(center.option14_desc);
                }
                if (center.option15_nm.length > 0) {
                    addOptsBtn('frm_center');
                    $('#option15Nm').val(center.option15_nm);
                    $('#option15Desc').val(center.option15_desc);
                }

            }
        }, error: function (result) {
            console.log(result);
        }
    });
});


/* 마이맵 리스트 OPEN/CLOSE */
function openMymapList(flag) {
    if (flag == "1") {
        console.log("마이맵 리스트 오픈");
        $("#mymapList").show();
        loaddata(); // 마이맵 리스트 데이터 로드
    } else if (flag == "0") {
        console.log("마이맵 리스트 닫힘");
        $("#mymapList").hide();
        console.log(markers);

        removeMarker(); // 마커 삭제
    } else if (flag == "2") {
        console.log(" 상세정보 오픈");
        $("#mymapList").show();
    }
}
/* 커스텀 오버레이를 닫기 */
function closeOverlay() {
    customOverlay.setMap(null);
}
/* 마이맵 리스트 상세페이지 이동 */
function moveDetailPage(type, seq) {
    $("#mymapList").html('');

    if (type == "center") {
        $.ajax({
            url: "/detailcenter/" + seq,
            type: "get",
            success: function (rdata) {
                // console.log(rdata);
                let contents = "";
                let center = rdata.center
                if (center == null || center == undefined || center == "") {
                    contents += "<div class='no-detail'>등록된 데이터가 없습니다.</div>";
                } else {
                    let contents = detailCenterEleFactory(center);

                    $("#mymapList").append(contents);
                }
            }, error: function (result) {
                console.log(result);
            }
        });
    } else if (type == "property") {
        $.ajax({
            url: "/detailproperty/" + seq,
            type: "get",
            success: function (rdata) {
                // console.log(rdata);
                let contents = "";
                let property = rdata.property

                if (property == null || property == undefined || property == "") {
                    contents += "<div class='no-detail'>등록된 데이터가 없습니다.</div>";
                } else {
                    contents = detailPropertyEleFactory(property);
                }
                $("#mymapList").append(contents);
            }, error: function (result) {
                console.log(result);
            }
        });
    }

}
/* 교육기관 상세보기 페이지 div 요소 생성 */
function detailCenterEleFactory(center) {
    let contents = "";
    contents += "<div>";
    contents += "   <div class='card-header'>";
    contents += "       상세보기";
    contents += `       <button type='button' onclick='openMymapList("1")' class='btn btn-light'>뒤로</button>`;
    contents += "   </div>";

    contents += "   <form name='frm_center' onSubmit='return false;'> ";
    contents += "   <div class='card-body'> ";
    contents += "       <div class='multi-box'> ";
    contents += "           <h2 align='left'>" + center.center_nm + "</h2>";
    contents += "           <div align='right'>";
    contents += "               <button type='button' id='edit' data-seq='" + center.center_seq + "' class='btn btn-light'>수정</button>";
    contents += "               <button type='button' id='delete' data-schema='center' data-seq='" + center.center_seq + "' class='btn btn-light'>삭제</button>"
    contents += "           </div>";
    contents += "       </div>";
    contents += "       <p>" + center.center_desc + "</p>";
    contents += "   </div>";

    contents += "   <hr />";
    contents += "   <div class='detail card-body'>";
    contents += "       <p class='detail-info'>상세정보</p>";
    contents += '      <input type="hidden" value="' + center.lat + '" name="center_lat" id="center_lat" />';
    contents += '      <input type="hidden" value="' + center.lng + '" name="center_lng" id="center_lng" />';
    contents += "       <p>주소 : " + center.address + " " + center.detail_address + "</p>";
    contents += "       <p>브랜드명 : " + center.brand_nm + "</p>";
    contents += "       <p>지사지점 : " + center.branch_nm + "</p>";
    contents += "       <p>대상 : " + center.target + "</p>";
    contents += "       <p>과목 : " + center.subject + "</p>";

    if (center.option1_nm != null && center.option1_nm != undefined && center.option1_nm != "") {
        contents += "   <p>" + center.option1_nm + " : " + center.option1_desc + "</p>";
    }
    if (center.option2_nm != null && center.option2_nm != undefined && center.option2_nm != "") {
        contents += "   <p>" + center.option2_nm + " : " + center.option2_desc + "</p>";
    }
    if (center.option3_nm != null && center.option3_nm != undefined && center.option3_nm != "") {
        contents += "   <p>" + center.option3_nm + " : " + center.option3_desc + "</p>";
    }
    if (center.option4_nm != null && center.option4_nm != undefined && center.option4_nm != "") {
        contents += "   <p>" + center.option4_nm + " : " + center.option4_desc + "</p>";
    }
    if (center.option5_nm != null && center.option5_nm != undefined && center.option5_nm != "") {
        contents += "   <p>" + center.option5_nm + " : " + center.option5_desc + "</p>";
    }
    if (center.option6_nm != null && center.option6_nm != undefined && center.option6_nm != "") {
        contents += "   <p>" + center.option6_nm + " : " + center.option6_desc + "</p>";
    }
    if (center.option7_nm != null && center.option7_nm != undefined && center.option7_nm != "") {
        contents += "   <p>" + center.option7_nm + " : " + center.option7_desc + "</p>";
    }
    if (center.option8_nm != null && center.option8_nm != undefined && center.option8_nm != "") {
        contents += "   <p>" + center.option8_nm + " : " + center.option8_desc + "</p>";
    }
    if (center.option9_nm != null && center.option9_nm != undefined && center.option9_nm != "") {
        contents += "   <p>" + center.option9_nm + " : " + center.option9_desc + "</p>";
    }
    if (center.option10_nm != null && center.option10_nm != undefined && center.option10_nm != "") {
        contents += "   <p>" + center.option10_nm + " : " + center.option10_desc + "</p>";
    }
    if (center.option11_nm != null && center.option11_nm != undefined && center.option11_nm != "") {
        contents += "   <p>" + center.option11_nm + " : " + center.option11_desc + "</p>";
    }
    if (center.option12_nm != null && center.option12_nm != undefined && center.option12_nm != "") {
        contents += "   <p>" + center.option12_nm + " : " + center.option12_desc + "</p>";
    }
    if (center.option13_nm != null && center.option13_nm != undefined && center.option13_nm != "") {
        contents += "   <p>" + center.option13_nm + " : " + center.option13_desc + "</p>";
    }
    if (center.option14_nm != null && center.option14_nm != undefined && center.option14_nm != "") {
        contents += "   <p>" + center.option14_nm + " : " + center.option14_desc + "</p>";
    }
    if (center.option15_nm != null && center.option15_nm != undefined && center.option15_nm != "") {
        contents += "   <p>" + center.option15_nm + " : " + center.option15_desc + "</p>";
    }
    contents += "   </div>";
    contents += "   </form>";
    contents += "</div>";

    return contents;
}
/* 부동산 상세보기 페이지 div 요소 생성 */
function detailPropertyEleFactory(property) {
    let price = numberToKorean(property.price);
    let trading_state = "";
    let undrgrnd_flr = "";

    if (property.trading_state === "A") {
        trading_state = "임대가능";
    } else if (property.trading_state === "P") {
        trading_state = "승인대기";
    } else if (property.trading_state === "R") {
        trading_state = "거래 중";
    } else if (property.trading_state === "T") {
        trading_state = "거래완료";
    }

    console.log(property.undrgrnd_yn);

    if (property.undrgrnd_yn === "Y") {
        undrgrnd_flr = "지하";
    } else {
        undrgrnd_flr = " ";
    }

    let contents = "";
    contents += "<div>";
    contents += "   <div class='card-header'>";
    contents += "       상세보기";
    contents += `       <button type='button' onclick='openMymapList("1")' class='btn btn-light'>뒤로</button>`;
    contents += "   </div>";

    contents += "   <form name='frm_property' onSubmit='return false;'> ";
    contents += "   <div class='card-body'> ";
    contents += "       <div class='multi-box'> ";
    contents += "           <h2 align='left'>" + property.property_nm + "</h2>";
    contents += "           <div align='right'>";
    contents += "               <button type='button' id='edit-p' data-seq='" + property.property_seq + "' class='btn btn-light'>수정</button>";
    contents += "               <button type='button' id='delete-p' data-schema='property' data-seq='" + property.property_seq + "' class='btn btn-light'>삭제</button>"
    contents += "           </div>";
    contents += "       </div>";
    contents += "       <p style='color: blue;'>" + trading_state + "</p>";
    contents += "       <p>" + property.property_desc + "</p>";
    contents += "   </div>";
    contents += "   <hr />";
    contents += "   <div class='detail card-body row' >";
    contents += "       <div class='detail-info col-sm-4'>매물가격</div>";
    contents += "       <div class='detail-info col-sm-6' style='color:blue;'>" + price + "</div>";
    contents += "   </div>";
    contents += "   <hr />";
    contents += "   <div class='detail card-body'>";
    contents += "       <p class='detail-info'>상세정보</p>";
    contents += '      <input type="hidden" value="' + property.lat + '" name="property_lat" id="property_lat" />';
    contents += '      <input type="hidden" value="' + property.lng + '" name="property_lng" id="property_lng" />';
    contents += "       <p>주소 : " + property.address + " " + property.detail_address + "</p>";
    contents += "       <p>평수 : " + property.area_feet + " 평</p>";
    contents += "       <p>층수 :" + undrgrnd_flr + property.floor + " 층</p>";

    if (property.option1_nm != null && property.option1_nm != undefined && property.option1_nm != "") {
        contents += "   <p>" + property.option1_nm + " : " + property.option1_desc + "</p>";
    }
    if (property.option2_nm != null && property.option2_nm != undefined && property.option2_nm != "") {
        contents += "   <p>" + property.option2_nm + " : " + property.option2_desc + "</p>";
    }
    if (property.option3_nm != null && property.option3_nm != undefined && property.option3_nm != "") {
        contents += "   <p>" + property.option3_nm + " : " + property.option3_desc + "</p>";
    }
    if (property.option4_nm != null && property.option4_nm != undefined && property.option4_nm != "") {
        contents += "   <p>" + property.option4_nm + " : " + property.option4_desc + "</p>";
    }
    if (property.option5_nm != null && property.option5_nm != undefined && property.option5_nm != "") {
        contents += "   <p>" + property.option5_nm + " : " + property.option5_desc + "</p>";
    }
    if (property.option6_nm != null && property.option6_nm != undefined && property.option6_nm != "") {
        contents += "   <p>" + property.option6_nm + " : " + property.option6_desc + "</p>";
    }
    if (property.option7_nm != null && property.option7_nm != undefined && property.option7_nm != "") {
        contents += "   <p>" + property.option7_nm + " : " + property.option7_desc + "</p>";
    }
    if (property.option8_nm != null && property.option8_nm != undefined && property.option8_nm != "") {
        contents += "   <p>" + property.option8_nm + " : " + property.option8_desc + "</p>";
    }
    if (property.option9_nm != null && property.option9_nm != undefined && property.option9_nm != "") {
        contents += "   <p>" + property.option9_nm + " : " + property.option9_desc + "</p>";
    }
    if (property.option10_nm != null && property.option10_nm != undefined && property.option10_nm != "") {
        contents += "   <p>" + property.option10_nm + " : " + property.option10_desc + "</p>";
    }
    if (property.option11_nm != null && property.option11_nm != undefined && property.option11_nm != "") {
        contents += "   <p>" + property.option11_nm + " : " + property.option11_desc + "</p>";
    }
    if (property.option12_nm != null && property.option12_nm != undefined && property.option12_nm != "") {
        contents += "   <p>" + property.option12_nm + " : " + property.option12_desc + "</p>";
    }
    if (property.option13_nm != null && property.option13_nm != undefined && property.option13_nm != "") {
        contents += "   <p>" + property.option13_nm + " : " + property.option13_desc + "</p>";
    }
    if (property.option14_nm != null && property.option14_nm != undefined && property.option14_nm != "") {
        contents += "   <p>" + property.option14_nm + " : " + property.option14_desc + "</p>";
    }
    if (property.option15_nm != null && property.option15_nm != undefined && property.option15_nm != "") {
        contents += "   <p>" + property.option15_nm + " : " + property.option15_desc + "</p>";
    }
    contents += "   </div>";
    contents += "   </form>";
    contents += "</div>";

    return contents;
}


