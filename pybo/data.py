from pybo.models import LocalCenter as Center
from pybo.models import LocalProperty as Property


def get_latest_center(cnt=1):
    return Center.query.order_by(Center.create_dttm.desc()).limit(cnt).all()


def get_center(center_seq):
    return Center.query.get(center_seq)


def get_centers_by_seq_desc():
    return Center.query.order_by(Center.center_seq.desc()).all()


def get_centers_all():
    return Center.query.filter_by().all()


def get_latest_property(cnt=1):
    return Property.query.order_by(Property.create_dttm.desc()).limit(cnt).all()


def get_properties_by_seq_desc():
    return Property.query.order_by(Property.property_seq.desc()).all()


def get_property(property_seq):
    return Property.query.get(property_seq)


def get_properties_all():
    return Property.query.filter_by().all()


# def get_comics(classify_id=None):
#     if classify_id is None:
#         return Comic.query.all()
#     else:
#         return Comic.query.filter_by(classify_id=classify_id).all()

# def count_chapters(comic_id=None):
#     if comic_id is None:
#         return Chapter.query.count()
#     return Chapter.query.filter_by(comic_id=comic_id).count()


# def get_chapters(comic_id=None):
#     if comic_id is None:
#         return Chapter.query.order_by(Chapter.chapter_number.desc()).all()
#     return Chapter.query.filter_by(comic_id=comic_id).order_by(Chapter.chapter_number.desc()).all()


# def get_next_chapter(comic_id, chapter_number):
#     chapter = Chapter.query.filter(
#         and_(Chapter.comic_id == comic_id, Chapter.chapter_number > chapter_number)).order_by(
#         Chapter.chapter_number.asc()).first()
#     return chapter


# def get_prev_chapter(comic_id, chapter_number):
#     chapter = Chapter.query.filter(
#         and_(Chapter.comic_id == comic_id, Chapter.chapter_number < chapter_number)).order_by(
#         Chapter.chapter_number.desc()).first()
#     return chapter


# def get_chapter(chapter_id):
#     return Chapter.query.get(chapter_id)
