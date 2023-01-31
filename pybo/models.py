from pybo import db  # sqlalchemy 객체를 db 변수에 할당
from datetime import datetime
from marshmallow import fields, Schema


class LocalCenter(db.Model):
    __tablename__ = 'local_center'
    # __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    center_seq = db.Column(db.Integer, primary_key=True)
    center_nm = db.Column(db.String(200), nullable=False)
    center_desc = db.Column(db.String(200), nullable=False)
    brand_nm = db.Column(db.String(200), nullable=False)
    branch_nm = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    detail_address = db.Column(db.String(200), nullable=True)
    target = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    create_dttm = db.Column(db.DateTime, nullable=False)
    lat = db.Column(db.Numeric(precision=18, scale=15), nullable=True)
    lng = db.Column(db.Numeric(precision=18, scale=15), nullable=True)
    option1_nm = db.Column(db.String(200), nullable=True)
    option1_desc = db.Column(db.String(200), nullable=True)
    option2_nm = db.Column(db.String(200), nullable=True)
    option2_desc = db.Column(db.String(200), nullable=True)
    option3_nm = db.Column(db.String(200), nullable=True)
    option3_desc = db.Column(db.String(200), nullable=True)
    option4_nm = db.Column(db.String(200), nullable=True)
    option4_desc = db.Column(db.String(200), nullable=True)
    option5_nm = db.Column(db.String(200), nullable=True)
    option5_desc = db.Column(db.String(200), nullable=True)
    option6_nm = db.Column(db.String(200), nullable=True)
    option6_desc = db.Column(db.String(200), nullable=True)
    option7_nm = db.Column(db.String(200), nullable=True)
    option7_desc = db.Column(db.String(200), nullable=True)
    option8_nm = db.Column(db.String(200), nullable=True)
    option8_desc = db.Column(db.String(200), nullable=True)
    option9_nm = db.Column(db.String(200), nullable=True)
    option9_desc = db.Column(db.String(200), nullable=True)
    option10_nm = db.Column(db.String(200), nullable=True)
    option10_desc = db.Column(db.String(200), nullable=True)
    option11_nm = db.Column(db.String(200), nullable=True)
    option11_desc = db.Column(db.String(200), nullable=True)
    option12_nm = db.Column(db.String(200), nullable=True)
    option12_desc = db.Column(db.String(200), nullable=True)
    option13_nm = db.Column(db.String(200), nullable=True)
    option13_desc = db.Column(db.String(200), nullable=True)
    option14_nm = db.Column(db.String(200), nullable=True)
    option14_desc = db.Column(db.String(200), nullable=True)
    option15_nm = db.Column(db.String(200), nullable=True)
    option15_desc = db.Column(db.String(200), nullable=True)

    def __init__(self, center_nm, center_desc, brand_nm, branch_nm, address, detail_address, target, subject, lat, lng, option1_nm, option1_desc, option2_nm, option2_desc, option3_nm, option3_desc, option4_nm, option4_desc, option5_nm, option5_desc, option6_nm, option6_desc, option7_nm, option7_desc, option8_nm, option8_desc, option9_nm, option9_desc, option10_nm, option10_desc, option11_nm, option11_desc, option12_nm, option12_desc, option13_nm, option13_desc, option14_nm, option14_desc, option15_nm, option15_desc):
        self.center_nm = center_nm
        self.center_desc = center_desc
        self.brand_nm = brand_nm
        self.branch_nm = branch_nm
        self.address = address
        self.detail_address = detail_address
        self.target = target
        self.subject = subject
        self.create_dttm = datetime.now()       # 만들면 자동으로 현재 시간으로 저장
        self.lat = lat
        self.lng = lng
        self.option1_nm = option1_nm
        self.option1_desc = option1_desc
        self.option2_nm = option2_nm
        self.option2_desc = option2_desc
        self.option3_nm = option3_nm
        self.option3_desc = option3_desc
        self.option4_nm = option4_nm
        self.option4_desc = option4_desc
        self.option5_nm = option5_nm
        self.option5_desc = option5_desc
        self.option6_nm = option6_nm
        self.option6_desc = option6_desc
        self.option7_nm = option7_nm
        self.option7_desc = option7_desc
        self.option8_nm = option8_nm
        self.option8_desc = option8_desc
        self.option9_nm = option9_nm
        self.option9_desc = option9_desc
        self.option10_nm = option10_nm
        self.option10_desc = option10_desc
        self.option11_nm = option11_nm
        self.option11_desc = option11_desc
        self.option12_nm = option12_nm
        self.option12_desc = option12_desc
        self.option13_nm = option13_nm
        self.option13_desc = option13_desc
        self.option14_nm = option14_nm
        self.option14_desc = option14_desc
        self.option15_nm = option15_nm
        self.option15_desc = option15_desc


class CenterListSchema(Schema):
    center_seq = fields.Int(dump_only=True)
    center_nm = fields.Str(required=True)
    address = fields.Str(required=True)
    detail_address = fields.Str(required=False)
    target = fields.Str(required=True)
    subject = fields.Str(required=True)
    lat = fields.Float(required=False)
    lng = fields.Float(required=False)
    brand_nm = fields.Str(required=True)
    branch_nm = fields.Str(required=True)


class CenterDetailSchema(Schema):
    center_seq = fields.Int(dump_only=True)
    center_nm = fields.Str(required=True)
    center_desc = fields.Str(required=True)
    address = fields.Str(required=True)
    detail_address = fields.Str(required=False)
    target = fields.Str(required=True)
    subject = fields.Str(required=True)
    brand_nm = fields.Str(required=True)
    branch_nm = fields.Str(required=True)
    lat = fields.Float(required=False)
    lng = fields.Float(required=False)
    option1_nm = fields.Str(required=False)
    option1_desc = fields.Str(required=False)
    option2_nm = fields.Str(required=False)
    option2_desc = fields.Str(required=False)
    option3_nm = fields.Str(required=False)
    option3_desc = fields.Str(required=False)
    option4_nm = fields.Str(required=False)
    option4_desc = fields.Str(required=False)
    option5_nm = fields.Str(required=False)
    option5_desc = fields.Str(required=False)
    option6_nm = fields.Str(required=False)
    option6_desc = fields.Str(required=False)
    option7_nm = fields.Str(required=False)
    option7_desc = fields.Str(required=False)
    option8_nm = fields.Str(required=False)
    option8_desc = fields.Str(required=False)
    option9_nm = fields.Str(required=False)
    option9_desc = fields.Str(required=False)
    option10_nm = fields.Str(required=False)
    option10_desc = fields.Str(required=False)
    option11_nm = fields.Str(required=False)
    option11_desc = fields.Str(required=False)
    option12_nm = fields.Str(required=False)
    option12_desc = fields.Str(required=False)
    option13_nm = fields.Str(required=False)
    option13_desc = fields.Str(required=False)
    option14_nm = fields.Str(required=False)
    option14_desc = fields.Str(required=False)
    option15_nm = fields.Str(required=False)
    option15_desc = fields.Str(required=False)


class LocalProperty(db.Model):
    __tablename__ = 'local_property'
    # __table_args__ = {'mysql_collate': 'utf8_general_ci'}

    property_seq = db.Column(db.Integer, primary_key=True)
    property_nm = db.Column(db.String(200), nullable=False)
    property_desc = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    detail_address = db.Column(db.String(200), nullable=True)
    area_feet = db.Column(db.Integer, nullable=False)
    undrgrnd_yn = db.Column(db.String(1), nullable=False)
    floor = db.Column(db.Numeric(precision=3, scale=0), nullable=False)
    price = db.Column(db.Numeric(precision=12, scale=0), nullable=False)
    trading_state = db.Column(db.String(10), nullable=False)
    create_dttm = db.Column(db.DateTime, nullable=False)
    lat = db.Column(db.Numeric(precision=18, scale=15), nullable=True)
    lng = db.Column(db.Numeric(precision=18, scale=15), nullable=True)
    option1_nm = db.Column(db.String(200), nullable=True)
    option1_desc = db.Column(db.String(200), nullable=True)
    option2_nm = db.Column(db.String(200), nullable=True)
    option2_desc = db.Column(db.String(200), nullable=True)
    option3_nm = db.Column(db.String(200), nullable=True)
    option3_desc = db.Column(db.String(200), nullable=True)
    option4_nm = db.Column(db.String(200), nullable=True)
    option4_desc = db.Column(db.String(200), nullable=True)
    option5_nm = db.Column(db.String(200), nullable=True)
    option5_desc = db.Column(db.String(200), nullable=True)
    option6_nm = db.Column(db.String(200), nullable=True)
    option6_desc = db.Column(db.String(200), nullable=True)
    option7_nm = db.Column(db.String(200), nullable=True)
    option7_desc = db.Column(db.String(200), nullable=True)
    option8_nm = db.Column(db.String(200), nullable=True)
    option8_desc = db.Column(db.String(200), nullable=True)
    option9_nm = db.Column(db.String(200), nullable=True)
    option9_desc = db.Column(db.String(200), nullable=True)
    option10_nm = db.Column(db.String(200), nullable=True)
    option10_desc = db.Column(db.String(200), nullable=True)
    option11_nm = db.Column(db.String(200), nullable=True)
    option11_desc = db.Column(db.String(200), nullable=True)
    option12_nm = db.Column(db.String(200), nullable=True)
    option12_desc = db.Column(db.String(200), nullable=True)
    option13_nm = db.Column(db.String(200), nullable=True)
    option13_desc = db.Column(db.String(200), nullable=True)
    option14_nm = db.Column(db.String(200), nullable=True)
    option14_desc = db.Column(db.String(200), nullable=True)
    option15_nm = db.Column(db.String(200), nullable=True)
    option15_desc = db.Column(db.String(200), nullable=True)

    def __init__(self, property_nm, property_desc, address, detail_address, area_feet, undrgrnd_yn, floor, price, trading_state, lat, lng, option1_nm, option1_desc, option2_nm, option2_desc, option3_nm, option3_desc, option4_nm, option4_desc, option5_nm, option5_desc, option6_nm, option6_desc, option7_nm, option7_desc, option8_nm, option8_desc, option9_nm, option9_desc, option10_nm, option10_desc, option11_nm, option11_desc, option12_nm, option12_desc, option13_nm, option13_desc, option14_nm, option14_desc, option15_nm, option15_desc):
        self.property_nm = property_nm
        self.property_desc = property_desc
        self.address = address
        self.detail_address = detail_address
        self.area_feet = area_feet
        self.undrgrnd_yn = undrgrnd_yn
        self.floor = floor
        self.price = price
        self.trading_state = trading_state
        self.create_dttm = datetime.now()       # 만들면 자동으로 현재 시간으로 저장
        self.lat = lat
        self.lng = lng
        self.option1_nm = option1_nm
        self.option1_desc = option1_desc
        self.option2_nm = option2_nm
        self.option2_desc = option2_desc
        self.option3_nm = option3_nm
        self.option3_desc = option3_desc
        self.option4_nm = option4_nm
        self.option4_desc = option4_desc
        self.option5_nm = option5_nm
        self.option5_desc = option5_desc
        self.option6_nm = option6_nm
        self.option6_desc = option6_desc
        self.option7_nm = option7_nm
        self.option7_desc = option7_desc
        self.option8_nm = option8_nm
        self.option8_desc = option8_desc
        self.option9_nm = option9_nm
        self.option9_desc = option9_desc
        self.option10_nm = option10_nm
        self.option10_desc = option10_desc
        self.option11_nm = option11_nm
        self.option11_desc = option11_desc
        self.option12_nm = option12_nm
        self.option12_desc = option12_desc
        self.option13_nm = option13_nm
        self.option13_desc = option13_desc
        self.option14_nm = option14_nm
        self.option14_desc = option14_desc
        self.option15_nm = option15_nm
        self.option15_desc = option15_desc


class PropertyListSchema(Schema):
    property_seq = fields.Int(dump_only=True)
    property_nm = fields.Str(required=True)
    address = fields.Str(required=True)
    detail_address = fields.Str(required=False)
    area_feet = fields.Int(required=True)
    floor = fields.Int(required=True)
    undrgrnd_yn = fields.Str(required=False)
    price = fields.Int(required=True)
    lat = fields.Float(required=False)
    lng = fields.Float(required=False)


class PropertyDetailSchema(Schema):
    property_seq = fields.Int(dump_only=True)
    property_nm = fields.Str(required=True)
    property_desc = fields.Str(required=True)
    address = fields.Str(required=True)
    detail_address = fields.Str(required=False)
    price = fields.Int(required=True)
    area_feet = fields.Int(required=True)
    floor = fields.Int(required=True)
    undrgrnd_yn = fields.Str(required=True)
    trading_state = fields.Str(required=True)
    lat = fields.Float(required=False)
    lng = fields.Float(required=False)
    option1_nm = fields.Str(required=False)
    option1_desc = fields.Str(required=False)
    option2_nm = fields.Str(required=False)
    option2_desc = fields.Str(required=False)
    option3_nm = fields.Str(required=False)
    option3_desc = fields.Str(required=False)
    option4_nm = fields.Str(required=False)
    option4_desc = fields.Str(required=False)
    option5_nm = fields.Str(required=False)
    option5_desc = fields.Str(required=False)
    option6_nm = fields.Str(required=False)
    option6_desc = fields.Str(required=False)
    option7_nm = fields.Str(required=False)
    option7_desc = fields.Str(required=False)
    option8_nm = fields.Str(required=False)
    option8_desc = fields.Str(required=False)
    option9_nm = fields.Str(required=False)
    option9_desc = fields.Str(required=False)
    option10_nm = fields.Str(required=False)
    option10_desc = fields.Str(required=False)
    option11_nm = fields.Str(required=False)
    option11_desc = fields.Str(required=False)
    option12_nm = fields.Str(required=False)
    option12_desc = fields.Str(required=False)
    option13_nm = fields.Str(required=False)
    option13_desc = fields.Str(required=False)
    option14_nm = fields.Str(required=False)
    option14_desc = fields.Str(required=False)
    option15_nm = fields.Str(required=False)
    option15_desc = fields.Str(required=False)



