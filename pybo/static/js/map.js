/* ****************** Kakao map API 관련 전역 변수 설정 ******************** */
const container = document.getElementById('map');

// 표시할 지도 옵션
var options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 4
};
var map = new kakao.maps.Map(container, options);

// 지도에 표시할 오버레이 마커들의 정보를 가지고 있을 배열입니다
var markers = [];

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

//  마커를 클릭했을 때 장소명을 표출할 커스텀 오버레이를 생성합니다
var customOverlay = new kakao.maps.CustomOverlay({
    map: map,
    clickable: true
});
// 드로잉 매니저 객체를 생성합니다
var opt = {
    map: map,
    drawlingMode: [
        kakao.maps.drawing.OverlayType.MARKER,
        kakao.maps.drawing.OverlayType.POLYLINE,
        kakao.maps.drawing.OverlayType.RECTANGLE,
        kakao.maps.drawing.OverlayType.CIRCLE,
        kakao.maps.drawing.OverlayType.POLYGON
    ],
    guideTooltip: ['draw', 'drag', 'edit'],
    markerOptions: {
        draggable: true,
        removable: false,
        title: '등록하시려는 위치를 선택해주세요.' // 마커에 마우스 올렸을 때 나오는 툴팁
    }
};
var manager = new kakao.maps.drawing.DrawingManager(opt);



/* 마커 드로잉 */
function addLocation(drwngtype) {
    setDrawingManager(); // 그리기 (취소 & 바로 이전 상태 원복)
    manager.select(kakao.maps.drawing.OverlayType[drwngtype]); // 드로잉 타입 선택

    manager.addListener('drawend', function () {
        let bindData = manager.getData();

        let bindInfo = bindData.marker; // 마커에 바인딩된 정보 로드
        let lastestMarker = bindInfo[bindInfo.length - 1]; // 가장 마지막에 그린 바인딩 데이터 로드

        console.log(lastestMarker.y, lastestMarker.x);
        setTimeout(getAddr, 500, "addr", lastestMarker.y, lastestMarker.x); // 좌표로 주소 변환

    });
}
/* 그리기 (취소 & 바로 이전 상태 원복) */
function setDrawingManager() {
    manager.cancel(); // 드로잉 취소
    manager.undo();
}

/* 좌표 -> 주소 변환 */
function getAddr(type, x, y) {
    if (type == "addr") {
        var geocoder1 = new kakao.maps.services.Geocoder();
        var coord = new kakao.maps.LatLng(x, y);
        var addrCB = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                if (result[0].road_address == null) {
                    alert('도로명 주소가 없습니다.');
                    return;
                } else {
                    var address = result[0].road_address.address_name;
                    openPopupAddMarker(address, x, y); // 마커 등록창 열기
                }
            }
        }
        geocoder1.coord2Address(coord.getLng(), coord.getLat(), addrCB);
    } else if (type == "coord") {
        // 주소 -> 좌표 변환
        var geocoder2 = new kakao.maps.services.Geocoder();
        var coordCB = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {

                $('#centerLat').attr('value', result[0].y);
                $('#centerLng').attr('value', result[0].x);

                $('#propertyLat').attr('value', result[0].y);
                $('#propertyLng').attr('value', result[0].x);

                console.log("coord#2");
                console.log($('#centerLat').val(), "  ", $('#centerLng').val());
                console.log($('#propertyLat').val(), "  ", $('#propertyLng').val());
            }
        }
        geocoder2.addressSearch(x, coordCB);
    }

}

/* 마커 등록창 */
function openPopupAddMarker(address, x, y) {
    $('#popup_layer').show();
    $('input[name^=address').attr('value', address);
    $('#centerLat').attr('value', x);
    $('#centerLng').attr('value', y);
    $('#propertyLat').attr('value', x);
    $('#propertyLng').attr('value', y);
}

/* 팝업 닫기 */
function closePopup() {
    $('#popup_layer').hide();

    // 폼 초기화
    resetFrmCenter();
    resetFrmProperty();

    // 선택항목 전부 삭제
    removeAllOptsBtn();

    // 드로잉 취소 & 바로 이전 상태 원복
    setDrawingManager();

    // tab 초기화
    initTab('popup_center');
}
/* 교육기관 폼 초기화 */
function resetFrmCenter() {
    $('input[name=centerSeq').val('');
    $('input[name=centerNm').val('');
    $('textarea[name=centerDesc').val('');
    $('input[name=address1').val('');
    $('input[name=detailAddress1').val('');

    // 체크박스 checked true -> false
    initCheckbox('target');
    initCheckbox('subject');
}
/* 부동산 폼 초기화 */
function resetFrmProperty() {
    $('input[name=propertySeq').val('');
    $('input[name=propertyNm').val('');
    $('textarea[name=propertyDesc').val('');
    $('input[name=address2').val('');
    $('input[name=detailAddress2').val('');
    $('input[name=areaFeet').val('');
    $('input[name=floor').val('');
    $('input[name=price').val('');

    // 체크박스 checked true -> false
    initCheckbox('undrgrndYn');
    initCheckbox('tradingState');
}
/* 부동산 입력 폼 확인 */
function checkFrmProperty(self) {
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {

                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    let json = JSON.stringify($("#frm_property").serializeObject()); // json 직렬화
    console.log(json);
    $("#propertySeq").val() == "" ? createProperty(json) : updateProperty(json);

}
/* 부동산 데이터 수정 후, 팝업 닫힌 다음, 상세 정보 노출 */
function updateProperty(json) {
    $.ajax({
        url: "/property/create",
        type: "POST",
        data: json,
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (result) {
            console.log(result.property_seq);
            if (result.property_seq != null) {
                loaddata();
                alert("수정이 완료되었습니다.");
                closePopup();
                moveDetailPage('property', result.property_seq);
            } else {
                alert("입력 된 정보를 저장할 수 없습니다. 관리자에게 문의하세요");
                return;
            }
        },
        fail: function (result) {
            console.log(result.responseText);
        }
    });
}
/* 부동산 등록 후, 최신 부동산 정보 로드 후, 주소로 장소 표시  */
function createProperty(json) {
    new Promise((succ, fail) => {
        $.ajax({
            url: "/property/create",
            type: "POST",
            data: json,
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (result) {
                succ(result);
                console.log(result);
                if (result == "1") {
                    alert("등록이 완료되었습니다.");
                    closePopup();
                } else {
                    alert("입력 된 정보를 저장할 수 없습니다. 관리자에게 문의하세요");
                    return;
                }
            },
            fail: function (result) {
                fail(error);
                console.log(result.responseText);
            }
        });

    }).then((arg) => {
        /* 최신 부동산 정보 로드 후 마커 표시  */
        setDrawingManager();  // 드로잉 매니저 초기화

        $.ajax({
            url: "/property/latest",
            type: 'GET',
            contentType: "application/json; charset=utf-8",
        })
            .done(function (result) {
                if (arg == "1") {
                    let property = result.property,
                        position = new kakao.maps.LatLng(property.lat, property.lng),
                        marker = setMarker(position);

                    // 마커에 클릭이벤트를 등록합니다
                    setCustomOverlay(marker, 'property', property);

                    //  좌표로 지도를 부드럽게 이동시킵니다
                    map.panTo(position);

                    // 상세정보 박스를 오픈합니다
                    openMymapList("2");
                    // 상세정보를 표출합니다
                    moveDetailPage("property", property.property_seq);
                }
            })
    });
}


/* 교육기관 입력 폼 확인 */
function checkFrmCenter(self) {
    /* 센터 폼 입력 양식 확인 */
    if ($("input:checkbox[name='target']:checked").val() == undefined) {
        alert("체크된 대상이 없습니다. 대상을 선택해주세요.");
        return false;
    }

    if ($("input:checkbox[name='subject']:checked").val() == undefined) {
        alert("체크된 과목이 없습니다. 과목을 선택해주세요.");
        return false;
    }

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {

                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    let json = JSON.stringify($("#frm_center").serializeObject()); // json 직렬화
    console.log(json);
    $("#centerSeq").val() == "" ? createCenter(json) : updateCenter(json);

}
/* 교육기관 데이터 수정 후, 팝업 닫힌 다음, 상세 정보 노출 */
function updateCenter(json) {
    $.ajax({
        url: "/center/create",
        type: "POST",
        data: json,
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (result) {
            console.log(result.center_seq, " / ", typeof (result.center_seq));
            if (result.center_seq != null) {
                loaddata();
                alert("수정이 완료되었습니다.");
                closePopup();
                moveDetailPage('center', result.center_seq);
            } else {
                alert("입력 된 정보를 저장할 수 없습니다. 관리자에게 문의하세요");
                return;
            }
        },
        fail: function (result) {
            console.log(result.responseText);
        }
    });
}
/* 교육기관 등록 후, 최신 교육기관 정보 로드 후, 주소로 장소 표시  */
function createCenter(json) {
    new Promise((succ, fail) => { /* 교육기관 등록 */
        $.ajax({
            url: "/center/create",
            type: "POST",
            data: json,
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (result) {
                succ(result);
                console.log(result);
                if (result == "1") {
                    alert("등록이 완료되었습니다.");
                    closePopup();
                } else {
                    alert("입력 된 정보를 저장할 수 없습니다. 관리자에게 문의하세요");
                    return;
                }
            },
            fail: function (result) {
                fail(error);
                console.log(result.responseText);
            }
        });

    }).then((arg) => {
        /* 최신 교육기관 정보 로드 후 마커 표시  */
        setDrawingManager();  // 드로잉 매니저 초기화

        $.ajax({
            url: "/center/latest",
            type: 'GET',
            contentType: "application/json; charset=utf-8",
        })
            .done(function (result) {
                if (arg == "1") {
                    let center = result.center,
                        position = new kakao.maps.LatLng(center.lat, center.lng),
                        marker = setMarker(position);

                    // 마커에 클릭이벤트를 등록합니다
                    setCustomOverlay(marker, 'center', center);

                    //  좌표로 지도를 부드럽게 이동시킵니다
                    map.panTo(position);

                    // 상세정보 박스를 오픈합니다
                    openMymapList("2");
                    // 상세정보를 표출합니다
                    moveDetailPage("center", center.center_seq);
                }
            })
    });
}

/* 마커 노출 설정 */
function setMarker(position) {
    let imgSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
        imgSize = new kakao.maps.Size(24, 35);
    var markerImg = new kakao.maps.MarkerImage(imgSrc, imgSize),
        marker = new kakao.maps.Marker({
            position: position,
            image: markerImg
        });
    marker.setMap(map);
    markers.push(marker);

    return marker;
}
/* 인포윈도우 노출 설정 */
function setInfoWindow(marker, schema, schemaData) {
    if (schema == 'center') {
        let content = '<div class="wrap">' +
            '    <div class="info">' +
            '        <div class="title">' +
            '            ' + schemaData.center_nm +
            '        </div>' +
            '        <div class="body">' +
            '            <div class="desc">' +
            '                ' + schemaData.brand_nm + ' / ' + schemaData.branch_nm + '' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>';
        infowindow.setContent(content);
        infowindow.open(map, marker);
    }
}
/* 커스텀 오버레이 노출 설정 */
function setCustomOverlay(marker, schema, schemaData) {
    if (schema == 'center') {
        console.log(schemaData);
        let content = '<div class="wrap">' +
            '    <div class="info">' +
            `        <div class="title" onclick="moveDetailPage('center',` + schemaData.center_seq + `)">` +
            `        <div class="title">` +
            '            ' + schemaData.center_nm +
            '           <div class="close" onclick="closeOverlay()" title="닫기"></div>' +
            '        </div>' +
            '        <div class="body">' +
            '           <input type="hidden" value="' + schemaData.lat + '" name="' + schema + '_lat"' + ' id="' + schema + '_lat" />' +
            '           <input type="hidden" value="' + schemaData.lng + '" name="' + schema + '_lng"' + ' id="' + schema + '_lng" />' +
            '           <div class="ellipsis">' + schemaData.brand_nm + ' / ' + schemaData.branch_nm + '</div>' +
            '        </div>' +
            '    </div>' +
            '</div>';


        customOverlay.setMap(map);
        customOverlay.setContent(content);
        customOverlay.setPosition(marker.getPosition());
        customOverlay.setVisible(true);

        kakao.maps.event.addListener(marker, 'click', function () {
            if (customOverlay.getVisible()) {
                customOverlay.setVisible(false);
            } else {
                customOverlay.setVisible(true);

            }
        });
    } else if (schema == 'property') {
        console.log(schemaData);
        let content = '<div class="wrap">' +
            '    <div class="info">' +
            `        <div class="title" onclick="moveDetailPage('property',` + schemaData.property_seq + `)">` +
            `        <div class="title">` +
            '            ' + schemaData.property_nm +
            '           <div class="close" onclick="closeOverlay()" title="닫기"></div>' +
            '        </div>' +
            '        <div class="body">' +
            '           <input type="hidden" value="' + schemaData.lat + '" name="' + schema + '_lat"' + ' id="' + schema + '_lat" />' +
            '           <input type="hidden" value="' + schemaData.lng + '" name="' + schema + '_lng"' + ' id="' + schema + '_lng" />' +
            '           <div class="ellipsis">' + numberToKorean(schemaData.price) + '</div>' +
            '        </div>' +
            '    </div>' +
            '</div>';

        customOverlay.setMap(map);
        customOverlay.setContent(content);
        customOverlay.setPosition(marker.getPosition());
        customOverlay.setVisible(true);

        kakao.maps.event.addListener(marker, 'click', function () {
            if (customOverlay.getVisible()) {
                customOverlay.setVisible(false);
            } else {
                customOverlay.setVisible(true);

            }
        });
    }
}
/* 마이맵 리스트 데이터 로드 | 교육기관+부동산  */
function loaddata() {
    $("#mymapList").html('');
    createDivCardArea();

    $.ajax({
        url: "/loaddata",
        type: "GET",
        success: function (rdata) {
            // console.log(rdata);
            // console.log("리스트 데이터 로드");
            let contents = "";
            if (rdata == null || rdata == undefined || rdata == "") {
                contents += "<div class='data-header'>등록된 데이터가 없습니다.</div>";
            } else {
                removeMarker();
                var listEl = document.getElementById('load-data'),
                    fragment = document.createDocumentFragment(),
                    bounds = new kakao.maps.LatLngBounds();
                let center = rdata.center;
                let property = rdata.property;
                /* 교육기관 리스트 건 수*/
                // contents += "<div class='data-header'>교육기관 : " + center.length + "건</div><hr />";
                // $.each(property, function (key, value) {
                //     let price = numberToKorean(value.price);
                //     contents += propertyListEleFactory(value, 'property', price);
                // });

                /* 교육기관 마커 데이터 조회 */
                for (var i = 0; i < center.length; i++) {

                    if (i == 0) {
                        hasDataEl = centerLengthEleFactory(center.length);
                        fragment.appendChild(hasDataEl);
                    }

                    let markerPosition = new kakao.maps.LatLng(center[i].lat, center[i].lng),
                        marker = createMarker(markerPosition, 'center'),
                        itemEl = centerListEleFactory(center[i], 'center');

                    bounds.extend(markerPosition);

                    // 리스트 항목에 mouseover 했을 때
                    // 해당되는 마커에 교육기관 이름을 표시합니다
                    // mouseout 했을 때는 인포윈도우를 닫습니다
                    (function (marker, title, branch_nm, brand_nm, center_seq) {


                        kakao.maps.event.addListener(marker, 'mouseover', function () {
                            centerInfowindowWithTitle(marker, title, brand_nm, branch_nm);
                        });
                        kakao.maps.event.addListener(marker, 'mouseout', function () {
                            infowindow.close();
                        });


                        kakao.maps.event.addListener(marker, 'click', function () {
                            moveDetailPage('center', center_seq);
                        });


                        itemEl.onmouseover = function () {
                            centerInfowindowWithTitle(marker, title, brand_nm, branch_nm);
                        };
                        itemEl.onmouseout = function () {
                            infowindow.close();
                        };


                    })(marker, center[i].center_nm, center[i].branch_nm, center[i].brand_nm, center[i].center_seq);

                    fragment.appendChild(itemEl);

                }



                /* 부동산 마커 데이터 조회 */
                for (var i = 0; i < property.length; i++) {

                    if (i == 0) {
                        hasDataEl = propertyLengthEleFactory(property.length);
                        fragment.appendChild(hasDataEl);
                    }

                    let markerPosition = new kakao.maps.LatLng(property[i].lat, property[i].lng),
                        marker = createMarker(markerPosition, 'property'),
                        itemEl = propertyListEleFactory(property[i], 'property', numberToKorean(property[i].price));

                    bounds.extend(markerPosition);

                    // 리스트 항목에 mouseover 했을 때
                    // 해당되는 마커에 건물의 이름을 표시합니다
                    // mouseout 했을 때는 인포윈도우를 닫습니다
                    (function (marker, title, price, property_seq) {


                        kakao.maps.event.addListener(marker, 'mouseover', function () {
                            propertyInfowindowWithTitle(marker, title, price);
                        });
                        kakao.maps.event.addListener(marker, 'mouseout', function () {
                            infowindow.close();
                        });


                        kakao.maps.event.addListener(marker, 'click', function () {
                            moveDetailPage('property', property_seq);
                        });


                        itemEl.onmouseover = function () {
                            propertyInfowindowWithTitle(marker, title, price);
                        };
                        itemEl.onmouseout = function () {
                            infowindow.close();
                        };


                    })(marker, property[i].property_nm, numberToKorean(property[i].price), property[i].property_seq);

                    fragment.appendChild(itemEl);
                }

                if (listEl != null) {  // Uncaught TypeError: Cannot read properties of null
                    listEl.appendChild(fragment); // fragment를 리스트에 추가합니다
                }

                map.setBounds(bounds);
            }
        }, error: function (result) {
            console.log(result);
        }
    });
}
/* 교육기관 리스트 항목 노드 생성 */
function centerListEleFactory(value, schema) {

    var el = document.createElement('div'),
        contents = "";

    if (value.detail_address == null || value.detail_address == undefined || value.detail_address == "") {
        value.detail_address = "";
    }

    contents += "   <div class='multi-box'> ";
    contents += `       <h3><a href="javascript:moveDetailPage('` + schema + `',` + `'` + value.center_seq + `')">` + value.center_nm + ` </a></h3>`;
    contents += '       <input type="hidden" value="' + value.lat + '" name="' + schema + '_lat"' + ' id="' + schema + '_lat" />';
    contents += '       <input type="hidden" value="' + value.lng + '" name="' + schema + '_lng"' + ' id="' + schema + '_lng" />';
    contents += "       <div align='right'>";
    contents += '           <button type="button" id="edit" data-seq="' + value.center_seq + '"  class="btn btn-primary">수정</button>';
    contents += '           <button type="button" id="delete" data-schema="' + schema + '" data-seq="' + value.center_seq + '" class="btn btn-primary">삭제</button>';
    contents += "       </div>";
    contents += "   </div>";
    contents += "   <p>" + value.address + " " + value.detail_address + "</p>";
    contents += "   <p>대상: " + value.target + " | 과목: " + value.subject + "</p>";

    el.innerHTML = contents;
    el.className = 'item';

    return el;
}
/* 데이터 건 수 요소 노드 생성 */
function centerLengthEleFactory(cnt) {
    var el = document.createElement('div'),
        contents = "";

    contents += "<div class='data-header'>교육기관 : " + cnt + "건</div><hr />";

    el.innerHTML = contents;
    el.className = 'has-data';

    return el;
}
/* 부동산 리스트 항목 노드 생성 */
function propertyListEleFactory(value, schema, price) {

    var el = document.createElement('div'),
        contents = "";


    if (value.detail_address == null || value.detail_address == undefined || value.detail_address == "") {
        value.detail_address = "";
    }
    if (value.undrgrnd_yn === "Y") {
        undrgrnd_flr = "지하";
    } else {
        undrgrnd_flr = " ";
    }
    contents += "<div> ";
    contents += "   <div class='multi-box'> ";
    contents += `       <h3><a href="javascript:moveDetailPage('` + schema + `',` + `'` + value.property_seq + `')">` + value.property_nm + ` </a></h3>`;
    contents += '       <input type="hidden" value="' + value.lat + '" name="' + schema + '_lat"' + ' id="' + schema + '_lat" />';
    contents += '       <input type="hidden" value="' + value.lng + '" name="' + schema + '_lng"' + ' id="' + schema + '_lng" />';
    contents += "       <div align='right'>";
    contents += '           <button type="button" id="edit-p" data-seq="' + value.property_seq + '"  class="btn btn-primary">수정</button>';
    contents += '           <button type="button" id="delete-p" data-schema="' + schema + '" data-seq="' + value.property_seq + '" class="btn btn-primary">삭제</button>';
    contents += "       </div>";
    contents += "   </div>";
    contents += "   <p>" + value.address + " " + value.detail_address + "</p>";
    contents += "   <div class='row'>";
    contents += "       <p class='col-sm-4'>평수 : " + value.area_feet + "평</p> | ";
    contents += "       <p class='col-sm-4'> 층수 : " + undrgrnd_flr + value.floor + "층</p>";
    contents += "   </div>";
    contents += "   <div class='row'> ";
    contents += "       <h6 class='col-sm-4'>매물 가격 : </h6>";
    contents += "       <h6 class='col-sm-4'>" + price + "</h6>";
    contents += "   </div>";
    contents += "</div>";


    el.innerHTML = contents;
    el.className = 'item';

    return el;
}
/* 데이터 건 수 요소 노드 생성 */
function propertyLengthEleFactory(cnt) {
    var el = document.createElement('div'),
        contents = "";

    contents += "<div class='data-header'>부동산 : " + cnt + "건</div><hr />";

    el.innerHTML = contents;
    el.className = 'has-data';

    return el;
}


/* 마커 생성 */
function createMarker(markerPosition, schema) {
    let imgSrc = "",
        imgSize = new kakao.maps.Size(31, 34);

    if (schema === "center") {
        imgSrc = 'https://i1.daumcdn.net/dmaps/apis/n_local_blit_04.png';  // 마커이미지의 주소입니다
    } else if (schema === "property") {
        imgSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';  // 마커이미지의 주소입니다
        imgSize = new kakao.maps.Size(30, 33);
    }

    var icon = new kakao.maps.MarkerImage(imgSrc, imgSize),
        marker = new kakao.maps.Marker({
            position: markerPosition,
            image: icon
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

/* 현위치로 이동 */
function moveCurruntPos() {
    // let location = { 'lat': 33.450701, 'lng': 126.570667 };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            var lat = position.coords.latitude,
                lon = position.coords.longitude;

            var loc = new kakao.maps.LatLng(lat, lon);

            var marker = new kakao.maps.Marker({
                map: map,
                position: loc
            });
            console.log("현재 위치 : " + lat + ", " + lon);
            // var infowindow = new kakao.maps.InfoWindow({
            //     content: msg,
            //     removable: true
            // });

            // infowindow.open(map, marker);
            marker.setMap(map); // 지도에 올린다.

            map.panTo(loc);

        }, function (error) {
            console.error(error);
        }, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: Infinity
        });
    } else {
        alert('GPS를 지원하지 않습니다');
    }

}



// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {

    var keyword = document.getElementById('keyword').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data);


    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

    }
}

function displayMyPlaces() {
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods();

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    // api 호출해서 추가하고 장소 id 받기
    $.ajax({
        'url': './place/',
        'type': 'get',
        'beforeSend': function () {
            // 로딩중 표시
        }
    })
        .done(function (response) {
            let places = response['places'];

            for (let i = 0; i < places.length; i++) {
                let place = places[i]['place_data'];
                var placePosition = new kakao.maps.LatLng(place.lat, place.lng),
                    marker = addMarker(placePosition, i, 'myplace');

                (function (marker, place) {
                    kakao.maps.event.addListener(marker, 'mouseover', function () {
                        displayInfowindow(marker, place);
                    });

                    kakao.maps.event.addListener(marker, 'mouseout', function () {
                        infowindow.close();
                    });

                })(marker, places[i]);
                addCustomOverlay(marker, places[i]);
            }
        })

}

function addCustomOverlay(marker, place) {
    // 커스텀 오버레이
    // 커스텀 오버레이에 표시할 컨텐츠 입니다
    // 커스텀 오버레이는 아래와 같이 사용자가 자유롭게 컨텐츠를 구성하고 이벤트를 제어할 수 있기 때문에
    // 별도의 이벤트 메소드를 제공하지 않습니다

    let content = '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">' +
        place["place_data"]["place_name"] +
        '               <span style="position:absolute;right:1rem;font-size:1rem;"><i class="fa fa-star" style="color: #F4D03F;"></i> ' + place['rate_avg'] + '</span>' +
        '        </div>' +
        '        <div class="body" style="padding:1rem;">' +
        '               <input type="hidden" value="' + place['place_data']['lat'] + '" name="latitude">' +
        '               <input type="hidden" value="' + place['place_data']['lng'] + '" name="longitude">' +
        '                <div class="ellipsis">' + place["place_data"]["address_name"] + '</div>' +
        '                <div class="jibun ellipsis">Tel: ' + place["place_data"]["phone"] + '</div>' +
        '                <div class="hover-the-rainbow" onclick="openConsole(`rate-place`)">❤맛집 평가하기</div>' +
        '        </div>' +
        '    </div>' +
        '</div>';

    // 마커 위에 커스텀오버레이를 표시합니다
    // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
    let overlay = new kakao.maps.CustomOverlay({
        content: content,
        map: map,
        clickable: true,
        position: marker.getPosition()
    });
    overlay.setVisible(false);
    // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    kakao.maps.event.addListener(marker, 'click', function () {
        if (overlay.getVisible())
            overlay.setVisible(false);
        else {
            overlay.setVisible(true);
            $("#place-info-title").text(place['place_data']['place_name']);
            openConsole('place-info');
        }
    });
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
    var scrollArea = document.getElementById('scroll-area'),
        bounds = new kakao.maps.LatLngBounds(),
        listStr = '';

    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(scrollArea);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    for (var i = 0; i < places.length; i++) {

        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i, "add-place"),
            itemEl = getListItemCustom(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function (marker, title) {
            kakao.maps.event.addListener(marker, 'mouseover', function () {
                displayInfowindowWithTitle(marker, title);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function () {
                infowindow.close();
            });

            itemEl.onmouseover = function () {
                displayInfowindowWithTitle(marker, title);
            };

            itemEl.onmouseout = function () {
                infowindow.close();
            };
        })(marker, places[i].place_name);

        //$('#scroll-area').append(itemEl);
        listStr += itemEl;
    }

    $('#scroll-area').append(listStr);

    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    scrollArea.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItemCustom(index, places) {
    let itemStr = '<div class="card place-card" id="' + places.y + '' + places.x + '">' +
        '<form class="add-place-form" action="/place" method="post">' +
        '<input type="hidden" value="' + places.place_name + '" name="place_name" >' +
        '<input type="hidden" value="' + places.y + '" name="latitude">' +
        '<input type="hidden" value="' + places.x + '" name="longitude">' +
        '<input type="hidden" value="' + places.address_name + '" name="address_name">' +
        '<input type="hidden" value="' + places.phone + '" name="phone">' +

        '<div id="btn-' + (index + 1) + '" class="submit-add-place-form add-this-place-btn" onclick="addPlaceForm(`#btn-' + (index + 1) + '`)"><i class="fa fa-plus"></i></div>' +
        '</form>' +
        '<span class="markerbg marker_' + (index + 1) + '"></span>' +
        '<div class="card-body">' +
        '<h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
            '   <span class="jibun gray">' + places.address_name + '</span>';
    } else {
        itemStr += '    <span>' + places.address_name + '</span>';
    }

    itemStr += '  <span class="tel">' + places.phone + '</span>' +
        '</div></div>';
    return itemStr;
}


function displayMyPlacesList(places, color) {
    for (let idx = 0; idx < places.length; idx++) {
        let el = placeListElementFactory(places[idx], color);

        $('#group-timeline').append(el);
    }
}

function placeListElementFactory(place_info, color) {
    let place = place_info['place_data'];
    let el = $('<div>');
    el.addClass('card place-card');
    el.css('border-left', '3px solid ' + color);

    let content = $('<div>');
    content.addClass('card-body');
    content.append('<h5>' + place.place_name + '</h5>');
    content.append('<p style="position: absolute; right: 2rem; top: 1rem;"><i class="fa fa-star" style="color: #f6c933;"></i> ' + place_info.rate_avg + '</p>');
    content.append('<span>' + place.address_name + '</span>');
    content.append('<span>' + place.phone + '</span>');

    el.append(content);

    // 클릭하면 해당 위치로 zoom하는 이벤트 추가
    el.click(function () {
        map.panTo(new kakao.maps.LatLng(place['lat'], place['lng']));
        map.setLevel(2);
    })

    return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, mode) {

    let imageSrc = '';
    let imageSize;
    let imgOptions = {}

    if (mode == 'myplace') {
        imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
        imageSize = new kakao.maps.Size(24, 35);
    }
    else if (mode == 'add-place') {
        imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png'
        imageSize = new kakao.maps.Size(36, 37); // 마커 이미지의 크기
        imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        };
    }

    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function displayInfowindow(marker, place_info) {
    if (place_info['place_data'] != null) {
        let place = place_info['place_data']; // 해당 맛집의 kakao map 정보
        let content = '<div style="padding:5px;z-index:1;">' + place['place_name'] + '';

        if (place_info['rate_avg'] != null) {
            content += '<br><span><i class="fa fa-star" style="color: #F4D03F;"></i> ' + place_info['rate_avg'] + '</span>' +
                '</div>';
        }
        else {
            content += '</div>';
        }

        infowindow.setContent(content);
        infowindow.open(map, marker);
    }
    else { // 맛집 정보가 마커에 바인딩되지 않는 경우
        displayInfowindowWithTitle(marker, place_info);
    }
}

// function displayInfowindowWithTitle(marker, title) {
//     var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

//     infowindow.setContent(content);
//     infowindow.open(map, marker);
// }
/* 부동산 마커 데이터 인포윈도우  */
function propertyInfowindowWithTitle(marker, title, info_01) {
    var content = '<div class="info-title">' +
        title +
        '<div style="color: #1E5DF8; font-weight: bold;">' +
        info_01 +
        '</div>';
    '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);

    let infoTitle = document.querySelectorAll('.info-title');
    infoTitle.forEach(function (e) {
        var w = e.offsetWidth + 2;
        var ml = w / 2;
        e.parentElement.style.top = "0px";
        e.parentElement.style.left = "50%";
        e.parentElement.style.marginLeft = -ml + "px";
        e.parentElement.style.width = w + "px";
        e.parentElement.previousSibling.style.display = "none";
        e.parentElement.parentElement.style.border = "0px";
        e.parentElement.parentElement.style.background = "unset";
    });

}
/* 교육기관 마커 데이터 인포윈도우  */
function centerInfowindowWithTitle(marker, title, info_01, info_02) {
    var content = '<div class="info-title">' +
        title +
        '<div class="info-content">' +
        info_01 + '/ ' + info_02 +
        '</div>';
    '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);

    let infoTitle = document.querySelectorAll('.info-title');
    infoTitle.forEach(function (e) {
        var w = e.offsetWidth + 1;
        var ml = w / 2;
        e.parentElement.style.top = "0px";
        e.parentElement.style.left = "50%";
        e.parentElement.style.marginLeft = -ml + "px";
        e.parentElement.style.width = w + "px";
        e.parentElement.previousSibling.style.display = "none";
        e.parentElement.parentElement.style.border = "0px";
        e.parentElement.parentElement.style.background = "unset";
    });


}
// function removeAllChildNods(el) {
//     $('.place-card').remove();
// }
function removeAllChildNods(el) {
    $('#mymapList *').remove();
}

function srchByCate(codeNm) {
    console.log(codeNm, "카테고리를 클릭했습니다.");

    var srchPlcObj = new kakao.maps.services.Places(map);

    console.log(srchPlcObj);
    console.log('장소검색 객체를 생성했습니다.');

    srchPlcObj.categorySearch(
        codeNm,
        srchPlcCallBack,
        {
            radius: 1000, // 1km 반경 내에서 검색
            useMapBounds: true // 검색 범위를 지도 화면으로 제한
        }
    );

    console.log


        ('장소검색을 실행합니다.');
    // search place call back function run
}

function srchPlcCallBack(srchPlc, status, pagination) {
    console.log('장소검색 콜백함수를 실행했습니다.');
    console.log(srchPlc);
    if (status == kakao.maps.services.Status.OK) {
        console.log('검색결과가 있습니다.');

        for (var i = 0; i < srchPlc.length; i++) {
            var srchLoc = new kakao.maps.LatLng(srchPlc[i].y, srchPlc[i].x);
            var marker = showMarker(srchLoc, i, srchPlc[i].category_group_code);
            (function (marker, srchPlc) {
                kakao.maps.event.addListener(marker, 'mouseover', function () {
                    showCustomOverlay(marker, srchPlc);
                });

                kakao.maps.event.addListener(marker, 'mouseout', function () {
                    infowindow.close();
                });

            })(marker, srchPlc[i]);
            showCustomOverlay(marker, srchPlc[i]);
            // display drawn 
        }
    } else if (status == kakao.maps.services.Status.ZERO_RESULT) {
        console.log('검색결과가 없습니다.');
    } else if (status == kakao.maps.services.Status.ERROR) {
        console.log('검색결과 중 오류가 발생했습니다.');
    }

}
/* 학군정보 위젯 */
function showMarker(srchLoc, index, codeNm) {
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(srchLoc)
    });

    if (codeNm == 'AC5') {
        imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
        imageSize = new kakao.maps.Size(24, 35);
    } else if (codeNm == 'SC4') {
        imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
        imageSize = new kakao.maps.Size(24, 35);
    }
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
        marker = new kakao.maps.Marker({
            position: srchLoc, // 마커의 위치
            image: markerImage
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}
function showCustomOverlay(srchPlcCB) {
    var content = ' <div class="label">' +
        '    <span class="left"></span>' +
        '       <span class="center">' +
        srchPlcCB.place_name +
        '       </span>' +
        '   <span class="right"></span>' +
        '</div>';

    let overlay = new kakao.maps.CustomOverlay({
        map: map,
        position: new kakao.maps.LatLng(srchPlcCB.y, srchPlcCB.x),
        clickable: true,
        content: content
    });

    overlay.setVisible(false);

    // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    kakao.maps.event.addListener(marker, 'click', function () {
        if (overlay.getVisible())
            overlay.setVisible(false);
        else {
            overlay.setVisible(true);
        }
    });
}


function srchByPostcode(target) {
    new daum.Postcode({
        oncomplete: function (data) {
            getAddr("coord", data.address, target);
            console.log(data);
            console.log(data.address);
            console.log(target);
            if (target == "frm_center") {
                $("#address1").val(data.address);
            } else if (target == "frm_property") {
                $("#address2").val(data.address);
            }

        }
    }).open();

}

$(document).ready(function () {
    moveCurruntPos(); // 현위치로 이동

    openMymapList('0'); // 0 : 마이맵 리스트 닫기 , 1 : 마이맵 리스트 열기

    $(".chb").change(function () {
        $(".chb").prop('checked', false);
        $(this).prop('checked', true);
    });


})