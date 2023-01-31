from flask_wtf import FlaskForm
from wtforms import StringField, RadioField, FloatField, SelectField, IntegerField, SelectMultipleField, TextAreaField, BooleanField
from wtforms.validators import DataRequired, length, StopValidation


list1 = ['미래탐구\r\n소마\r\n뉴스터디\r\n하이스트\r\n플레이팩토\r\n르네상스\r\nELC']
list_of_brand = list1[0].split()
brand_choices = [(x, x) for x in list_of_brand]

list2 = ['대치지점\r\n성북지점\r\n동대문지점\r\n광화문지점\r\n목동지점']
list_of_branch = list2[0].split()
branch_choices = [(x, x) for x in list_of_branch]


class AddMarkerForm1(FlaskForm):
    centerNm = StringField('centerNm',  validators=[
        DataRequired(), length(max=100)])
    centerDesc = TextAreaField('centerDesc', validators=[
        DataRequired(), length(max=100)])
    brandNm = SelectField('brandNm', choices=brand_choices)
    branchNm = SelectField('branchNm', choices=branch_choices)
    address1 = StringField('address1', validators=[DataRequired()])
    detailAddress1 = StringField('detailAddress1')
    centerLat = FloatField('centerLat', validators=[DataRequired()])
    centerLng = FloatField('centerLng', validators=[DataRequired()])


class AddMarkerForm2(FlaskForm):
    propertyNm = StringField('propertyNm',  validators=[
        DataRequired(), length(max=100)])
    propertyDesc = TextAreaField('propertyDesc', validators=[
        DataRequired(), length(max=100)])
    address2 = StringField('address2', validators=[DataRequired()])
    detailAddress2 = StringField('detailAddress2')
    areaFeet = IntegerField('areaFeet', validators=[
        DataRequired(), length(max=99999)])
    floor = IntegerField('floor', validators=[DataRequired()])
    undrgrndYn = BooleanField('undrgrndYn')
    price = IntegerField('price', validators=[
        DataRequired()])
    propertyLat = FloatField('propertyLat', validators=[DataRequired()])
    propertyLng = FloatField('propertyLng', validators=[DataRequired()])
   # tradingState = RadioField('tradingState', choices=[('A','임대 가능'),('P','승인 대기'),('R','거래 중'),('T','거래 완료')], default='value_two')