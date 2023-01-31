import pandas as pd
from pprint import pprint
import requests
from datetime import datetime

from flask import Flask, Blueprint, render_template, request, json, Response, url_for, redirect, flash, session, g
from config import get_api_key

from pybo.models import LocalCenter as Center, LocalProperty as Property
from pybo.models import CenterListSchema, CenterDetailSchema
from pybo.models import PropertyListSchema, PropertyDetailSchema

import pybo.data as data

from pybo.forms import AddMarkerForm1, AddMarkerForm2
from pybo import db  # mysql db 연결 객체를 가져옵니다.

from pybo.utils import convert_number_to_krw, is_json_key_present

centers_schema = CenterListSchema()
center_detail_schema = CenterDetailSchema()

property_schema = PropertyListSchema()
property_detail_schema = PropertyDetailSchema()

bp = Blueprint('main', __name__, url_prefix='/')


# 임시 페이지
@bp.route('/test', methods=['GET', 'POST'])
def test():
    context = {'api_key': get_api_key()}

    return render_template('map/popup_marker.html', context=context)


# 메인 페이지
@bp.route('/', methods=['GET', 'POST'])
def main_page():
    context = {'api_key': get_api_key()}
    form = AddMarkerForm1()
    form2 = AddMarkerForm2()

    return render_template('map/index.html', context=context, form=form, form2=form2)


# 마이맵 리스트 데이터 로드
@bp.route('/loaddata', methods=['GET'])
def loaddata():
    pprint("리스트 데이터 로드")
    centers = Center.query.order_by(Center.create_dttm.desc()).all()
    centers_data = centers_schema.dump(centers, many=True)

    property = Property.query.order_by(Property.create_dttm.desc()).all()
    property_data = property_schema.dump(property, many=True)
    pprint(property_data)
    pprint(centers_data)

    print('Load data')
    rdata = {"center": centers_data, "property": property_data}
    pprint(rdata)

    return custom_response(rdata, 200)


# 교육기관 상세 페이지
@ bp.route('/detailcenter/<int:center_seq>', methods=['GET', 'POST'])
def centerDetailpage(center_seq):
    print("센터 상세 페이지 요청")
    rdata = request
    center_detail = Center.query.get(center_seq)
    center_detail = center_detail_schema.dump(center_detail, many=False)
    pprint(center_detail)
    rdata = {"center": center_detail}
    pprint(rdata)

    return custom_response(rdata, 200)


# 부동산 상세 페이지
@ bp.route('/detailproperty/<int:property_seq>', methods=['GET', 'POST'])
def propertyDetailpage(property_seq):
    print("부동산 상세 페이지 요청")
    rdata = request
    property_detail = Property.query.get(property_seq)
    property_detail = property_detail_schema.dump(property_detail, many=False)

    pprint(property_detail)

    rdata = {"property": property_detail}
    pprint(rdata)

    return custom_response(rdata, 200)


# 데이터 삭제 부동산


@bp.route("/deleteproperty", methods=['POST'])
def deleteproperty():
    rdata = request.get_json()
    pprint(rdata)
    property_seq = rdata['property_seq']
    print("데이터 삭제 요청")
    pprint(property_seq)
    property = Property.query.filter_by(
        property_seq=int(property_seq)).first_or_404()
    db.session.delete(property)
    db.session.commit()

    return "1"


# 데이터 삭제 교육기관
@bp.route("/deletecenter", methods=['POST'])
def deletecenter():
    rdata = request.get_json()
    print("데이터 삭제 요청")
    pprint(rdata)
    center_seq = rdata['center_seq']
    pprint(center_seq)
    center = Center.query.filter_by(center_seq=int(center_seq)).first_or_404()
    db.session.delete(center)
    db.session.commit()

    return "1"


# 가장 최근에 등록된 부동산 정보 로드
@bp.route('/property/latest', methods=['GET'])
def getLatestProperty():
    print(" ------------ 최신 데이터 로드 ------------ ")
    property = Property.query.order_by(Property.property_seq.desc()).first()
    property = property_detail_schema.dump(property, many=False)
    pprint(property)
    rdata = {"property": property}
    pprint(rdata)

    return custom_response(rdata, 200)


# 가장 최근에 등록된 교육기관 정보 로드
@bp.route('/center/latest', methods=['GET'])
def getLatestCenter():
    print(" ------------ 최신 데이터 로드 ------------ ")
    center = Center.query.order_by(Center.center_seq.desc()).first()
    center = center_detail_schema.dump(center, many=False)
    pprint(center)
    rdata = {"center": center}

    pprint(rdata)

    return custom_response(rdata, 200)


# kakao map api 주소 좌표 변환
@bp.route('/coord', methods=['GET'])
def getCoord(addr='서울 송파구 오금로32길 31'):
    url = "https://dapi.kakao.com/v2/local/search/address.json"

    queryString = {'query': addr}
    header = {'Authorization': 'KakaoAK 61b0e22977c8f913e6847d3c12019ca2'}

    response = requests.get(url, headers=header, params=queryString)
    tokens = response.json()
    lat = tokens['documents'][0]['y']
    lan = tokens['documents'][0]['x']
    rdata = {"lat": lat, "lan": lan}

    print(rdata)

    return custom_response(rdata, 200)


# 부동산 등록/수정
@bp.route('/property/create', methods=['POST'])
def createProperty():
    center_json = request.get_json()
    pprint(center_json)
    property_seq = center_json['propertySeq']
    property_nm = center_json['propertyNm']
    property_desc = center_json['propertyDesc']

    area_feet = round(float(center_json['areaFeet']))
    print(area_feet)
    floor = int(center_json['floor'])

    if is_json_key_present(center_json, 'undrgrndYn'):
        undrgrnd_yn = 'Y'
    else:
        undrgrnd_yn = 'N'

    price = int(center_json['price'])

    trading_state = center_json['tradingState']
    print(trading_state)

    address = center_json['address2']

    if center_json['detailAddress2'] == None:
        detail_address = ""
    else:
        detail_address = center_json['detailAddress2']

    lat = center_json['propertyLat']
    lng = center_json['propertyLng']

    if is_json_key_present(center_json, 'option1Nm'):
        option1_nm = center_json['option1Nm']
    else:
        option1_nm = ""

    if is_json_key_present(center_json, 'option1Desc'):
        option1_desc = center_json['option1Desc']
    else:
        option1_desc = ""

    if is_json_key_present(center_json, 'option2Nm'):
        option2_nm = center_json['option2Nm']
    else:
        option2_nm = ""

    if is_json_key_present(center_json, 'option2Desc'):
        option2_desc = center_json['option2Desc']
    else:
        option2_desc = ""

    if is_json_key_present(center_json, 'option3Nm'):
        option3_nm = center_json['option3Nm']
    else:
        option3_nm = ""

    if is_json_key_present(center_json, 'option3Desc'):
        option3_desc = center_json['option3Desc']
    else:
        option3_desc = ""

    if is_json_key_present(center_json, 'option4Nm'):
        option4_nm = center_json['option4Nm']
    else:
        option4_nm = ""

    if is_json_key_present(center_json, 'option4Desc'):
        option4_desc = center_json['option4Desc']
    else:
        option4_desc = ""

    if is_json_key_present(center_json, 'option5Nm'):
        option5_nm = center_json['option5Nm']
    else:
        option5_nm = ""

    if is_json_key_present(center_json, 'option5Desc'):
        option5_desc = center_json['option5Desc']
    else:
        option5_desc = ""

    if is_json_key_present(center_json, 'option6Nm'):
        option6_nm = center_json['option6Nm']
    else:
        option6_nm = ""

    if is_json_key_present(center_json, 'option6Desc'):
        option6_desc = center_json['option6Desc']
    else:
        option6_desc = ""

    if is_json_key_present(center_json, 'option7Nm'):
        option7_nm = center_json['option7Nm']
    else:
        option7_nm = ""

    if is_json_key_present(center_json, 'option7Desc'):
        option7_desc = center_json['option7Desc']
    else:
        option7_desc = ""

    if is_json_key_present(center_json, 'option8Nm'):
        option8_nm = center_json['option8Nm']
    else:
        option8_nm = ""

    if is_json_key_present(center_json, 'option8Desc'):
        option8_desc = center_json['option8Desc']
    else:
        option8_desc = ""

    if is_json_key_present(center_json, 'option9Nm'):
        option9_nm = center_json['option9Nm']
    else:
        option9_nm = ""

    if is_json_key_present(center_json, 'option9Desc'):
        option9_desc = center_json['option9Desc']
    else:
        option9_desc = ""

    if is_json_key_present(center_json, 'option10Nm'):
        option10_nm = center_json['option10Nm']
    else:
        option10_nm = ""

    if is_json_key_present(center_json, 'option10Desc'):
        option10_desc = center_json['option10Desc']
    else:
        option10_desc = ""

    if is_json_key_present(center_json, 'option11Nm'):
        option11_nm = center_json['option11Nm']
    else:
        option11_nm = ""

    if is_json_key_present(center_json, 'option11Desc'):
        option11_desc = center_json['option11Desc']
    else:
        option11_desc = ""

    if is_json_key_present(center_json, 'option12Nm'):
        option12_nm = center_json['option12Nm']
    else:
        option12_nm = ""

    if is_json_key_present(center_json, 'option12Desc'):
        option12_desc = center_json['option12Desc']
    else:
        option12_desc = ""

    if is_json_key_present(center_json, 'option13Nm'):
        option13_nm = center_json['option13Nm']
    else:
        option13_nm = ""

    if is_json_key_present(center_json, 'option13Desc'):
        option13_desc = center_json['option13Desc']
    else:
        option13_desc = ""

    if is_json_key_present(center_json, 'option14Nm'):
        option14_nm = center_json['option14Nm']
    else:
        option14_nm = ""

    if is_json_key_present(center_json, 'option14Desc'):
        option14_desc = center_json['option14Desc']
    else:
        option14_desc = ""

    if is_json_key_present(center_json, 'option15Nm'):
        option15_nm = center_json['option15Nm']
    else:
        option15_nm = ""

    if is_json_key_present(center_json, 'option15Desc'):
        option15_desc = center_json['option15Desc']
    else:
        option15_desc = ""

    if (property_seq == ""):
        print("건물 등록 요청")

        # property 정보를 저장합니다.
        try:
            property = Property(property_nm=property_nm, property_desc=property_desc, address=address, detail_address=detail_address, lat=lat, lng=lng, area_feet=area_feet, floor=floor, undrgrnd_yn=undrgrnd_yn, price=price, trading_state=trading_state, option1_nm=option1_nm, option1_desc=option1_desc, option2_nm=option2_nm, option2_desc=option2_desc, option3_nm=option3_nm, option3_desc=option3_desc, option4_nm=option4_nm, option4_desc=option4_desc, option5_nm=option5_nm, option5_desc=option5_desc, option6_nm=option6_nm,
                                option6_desc=option6_desc, option7_nm=option7_nm, option7_desc=option7_desc, option8_nm=option8_nm, option8_desc=option8_desc, option9_nm=option9_nm, option9_desc=option9_desc, option10_nm=option10_nm, option10_desc=option10_desc, option11_nm=option11_nm, option11_desc=option11_desc, option12_nm=option12_nm, option12_desc=option12_desc, option13_nm=option13_nm, option13_desc=option13_desc, option14_nm=option14_nm, option14_desc=option14_desc, option15_nm=option15_nm, option15_desc=option15_desc)
            db.session.add(property)
            db.session.commit()
            pprint(property)
            print("property 추가 성공")

            return "1"
        except Exception as e:
            print("property 추가 실패")
            print(e)

            return "0"

    elif property_seq != "":
        property_seq = int(property_seq)
        print("부동산 수정 요청 : ", property_seq)

        # 부동산 정보를 저장합니다.
        try:
            property = Property.query.filter_by(
                property_seq=property_seq).first()
            property.property_nm = property_nm
            property.property_desc = property_desc
            property.area_feet = area_feet
            property.floor = floor
            property.undrgrnd_yn = undrgrnd_yn
            property.price = price
            property.trading_state = trading_state
            property.address = address
            property.detail_address = detail_address
            property.lat = lat
            property.lng = lng
            property.create_dttm = datetime.now()       # 만들면 자동으로 현재 시간으로 저장
            property.option1_nm = option1_nm
            property.option1_desc = option1_desc
            property.option2_nm = option2_nm
            property.option2_desc = option2_desc
            property.option3_nm = option3_nm
            property.option3_desc = option3_desc
            property.option4_nm = option4_nm
            property.option4_desc = option4_desc
            property.option5_nm = option5_nm
            property.option5_desc = option5_desc
            property.option6_nm = option6_nm
            property.option6_desc = option6_desc
            property.option7_nm = option7_nm
            property.option7_desc = option7_desc
            property.option8_nm = option8_nm
            property.option8_desc = option8_desc
            property.option9_nm = option9_nm
            property.option9_desc = option9_desc
            property.option10_nm = option10_nm
            property.option10_desc = option10_desc
            property.option11_nm = option11_nm
            property.option11_desc = option11_desc
            property.option12_nm = option12_nm
            property.option12_desc = option12_desc
            property.option13_nm = option13_nm
            property.option13_desc = option13_desc
            property.option14_nm = option14_nm
            property.option14_desc = option14_desc
            property.option15_nm = option15_nm
            property.option15_desc = option15_desc

            db.session.commit()
            print("property update 성공")
            rdata = {"property_seq": property.property_seq}
            pprint(rdata)

            return custom_response(rdata, 200)
        except Exception as e:
            print("property update 실패")
            print(e)

            return "0"


# 교육기관 등록/수정
@bp.route('/center/create', methods=['POST'])
def create():
    center_json = request.get_json()
    pprint(center_json)
    center_seq = center_json['centerSeq']
    print(type(center_seq))
    center_nm = center_json['centerNm']
    center_desc = center_json['centerDesc']
    brand_nm = center_json['brandNm']
    branch_nm = center_json['branchNm']

    target = center_json['target']
    if type(target) is list:
        target = ",".join(target)
        print(target)

    subject = center_json['subject']
    if type(subject) is list:
        subject = ",".join(subject)
        pprint(subject)

    address = center_json['address1']

    if center_json['detailAddress1'] == None:
        detail_address = ""
    else:
        detail_address = center_json['detailAddress1']

    lat = center_json['centerLat']
    lng = center_json['centerLng']

    if is_json_key_present(center_json, 'option1Nm'):
        option1_nm = center_json['option1Nm']
    else:
        option1_nm = ""

    if is_json_key_present(center_json, 'option1Desc'):
        option1_desc = center_json['option1Desc']
    else:
        option1_desc = ""

    if is_json_key_present(center_json, 'option2Nm'):
        option2_nm = center_json['option2Nm']
    else:
        option2_nm = ""

    if is_json_key_present(center_json, 'option2Desc'):
        option2_desc = center_json['option2Desc']
    else:
        option2_desc = ""

    if is_json_key_present(center_json, 'option3Nm'):
        option3_nm = center_json['option3Nm']
    else:
        option3_nm = ""

    if is_json_key_present(center_json, 'option3Desc'):
        option3_desc = center_json['option3Desc']
    else:
        option3_desc = ""

    if is_json_key_present(center_json, 'option4Nm'):
        option4_nm = center_json['option4Nm']
    else:
        option4_nm = ""

    if is_json_key_present(center_json, 'option4Desc'):
        option4_desc = center_json['option4Desc']
    else:
        option4_desc = ""

    if is_json_key_present(center_json, 'option5Nm'):
        option5_nm = center_json['option5Nm']
    else:
        option5_nm = ""

    if is_json_key_present(center_json, 'option5Desc'):
        option5_desc = center_json['option5Desc']
    else:
        option5_desc = ""

    if is_json_key_present(center_json, 'option6Nm'):
        option6_nm = center_json['option6Nm']
    else:
        option6_nm = ""

    if is_json_key_present(center_json, 'option6Desc'):
        option6_desc = center_json['option6Desc']
    else:
        option6_desc = ""

    if is_json_key_present(center_json, 'option7Nm'):
        option7_nm = center_json['option7Nm']
    else:
        option7_nm = ""

    if is_json_key_present(center_json, 'option7Desc'):
        option7_desc = center_json['option7Desc']
    else:
        option7_desc = ""

    if is_json_key_present(center_json, 'option8Nm'):
        option8_nm = center_json['option8Nm']
    else:
        option8_nm = ""

    if is_json_key_present(center_json, 'option8Desc'):
        option8_desc = center_json['option8Desc']
    else:
        option8_desc = ""

    if is_json_key_present(center_json, 'option9Nm'):
        option9_nm = center_json['option9Nm']
    else:
        option9_nm = ""

    if is_json_key_present(center_json, 'option9Desc'):
        option9_desc = center_json['option9Desc']
    else:
        option9_desc = ""

    if is_json_key_present(center_json, 'option10Nm'):
        option10_nm = center_json['option10Nm']
    else:
        option10_nm = ""

    if is_json_key_present(center_json, 'option10Desc'):
        option10_desc = center_json['option10Desc']
    else:
        option10_desc = ""

    if is_json_key_present(center_json, 'option11Nm'):
        option11_nm = center_json['option11Nm']
    else:
        option11_nm = ""

    if is_json_key_present(center_json, 'option11Desc'):
        option11_desc = center_json['option11Desc']
    else:
        option11_desc = ""

    if is_json_key_present(center_json, 'option12Nm'):
        option12_nm = center_json['option12Nm']
    else:
        option12_nm = ""

    if is_json_key_present(center_json, 'option12Desc'):
        option12_desc = center_json['option12Desc']
    else:
        option12_desc = ""

    if is_json_key_present(center_json, 'option13Nm'):
        option13_nm = center_json['option13Nm']
    else:
        option13_nm = ""

    if is_json_key_present(center_json, 'option13Desc'):
        option13_desc = center_json['option13Desc']
    else:
        option13_desc = ""

    if is_json_key_present(center_json, 'option14Nm'):
        option14_nm = center_json['option14Nm']
    else:
        option14_nm = ""

    if is_json_key_present(center_json, 'option14Desc'):
        option14_desc = center_json['option14Desc']
    else:
        option14_desc = ""

    if is_json_key_present(center_json, 'option15Nm'):
        option15_nm = center_json['option15Nm']
    else:
        option15_nm = ""

    if is_json_key_present(center_json, 'option15Desc'):
        option15_desc = center_json['option15Desc']
    else:
        option15_desc = ""

    if (center_seq == ""):
        print("센터 등록 요청")

        # center 정보를 저장합니다.
        try:
            center = Center(center_nm=center_nm, center_desc=center_desc, brand_nm=brand_nm, branch_nm=branch_nm, target=target,
                            subject=subject, address=address, detail_address=detail_address, lat=lat, lng=lng, option1_nm=option1_nm, option1_desc=option1_desc, option2_nm=option2_nm, option2_desc=option2_desc, option3_nm=option3_nm, option3_desc=option3_desc, option4_nm=option4_nm, option4_desc=option4_desc, option5_nm=option5_nm, option5_desc=option5_desc, option6_nm=option6_nm, option6_desc=option6_desc, option7_nm=option7_nm, option7_desc=option7_desc, option8_nm=option8_nm, option8_desc=option8_desc, option9_nm=option9_nm, option9_desc=option9_desc, option10_nm=option10_nm, option10_desc=option10_desc, option11_nm=option11_nm, option11_desc=option11_desc, option12_nm=option12_nm, option12_desc=option12_desc, option13_nm=option13_nm, option13_desc=option13_desc, option14_nm=option14_nm, option14_desc=option14_desc, option15_nm=option15_nm, option15_desc=option15_desc)
            db.session.add(center)
            db.session.commit()
            pprint(center)
            print("center 추가 성공")

            return "1"
        except Exception as e:
            print("center 추가 실패")
            print(e)

            return "0"

    elif center_seq != "":
        center_seq = int(center_seq)
        print("센터 수정 요청 : ", center_seq)

        # center 정보를 저장합니다.
        try:
            center = Center.query.filter_by(center_seq=center_seq).first()
            center.center_nm = center_nm
            center.center_desc = center_desc
            center.brand_nm = brand_nm
            center.branch_nm = branch_nm
            center.target = target
            center.subject = subject
            center.address = address
            center.detail_address = detail_address
            center.lat = lat
            center.lng = lng
            center.create_dttm = datetime.now()       # 만들면 자동으로 현재 시간으로 저장
            center.lat = lat
            center.lng = lng
            center.option1_nm = option1_nm
            center.option1_desc = option1_desc
            center.option2_nm = option2_nm
            center.option2_desc = option2_desc
            center.option3_nm = option3_nm
            center.option3_desc = option3_desc
            center.option4_nm = option4_nm
            center.option4_desc = option4_desc
            center.option5_nm = option5_nm
            center.option5_desc = option5_desc
            center.option6_nm = option6_nm
            center.option6_desc = option6_desc
            center.option7_nm = option7_nm
            center.option7_desc = option7_desc
            center.option8_nm = option8_nm
            center.option8_desc = option8_desc
            center.option9_nm = option9_nm
            center.option9_desc = option9_desc
            center.option10_nm = option10_nm
            center.option10_desc = option10_desc
            center.option11_nm = option11_nm
            center.option11_desc = option11_desc
            center.option12_nm = option12_nm
            center.option12_desc = option12_desc
            center.option13_nm = option13_nm
            center.option13_desc = option13_desc
            center.option14_nm = option14_nm
            center.option14_desc = option14_desc
            center.option15_nm = option15_nm
            center.option15_desc = option15_desc

            db.session.commit()
            print("center update 성공")
            rdata = {"center_seq": center.center_seq}
            pprint(rdata)

            return custom_response(rdata, 200)
        except Exception as e:
            print("center update 실패")
            print(e)

            return "0"


def custom_response(res, status_code):

    return Response(mimetype="application/json", response=json.dumps(res), status=status_code)
