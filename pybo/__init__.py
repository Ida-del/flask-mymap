from flask import Flask, Blueprint
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

import config

# 전역변수로 선언
db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # config.py 파일에서 작성한 항목을 app.config 환경변수로 적용
    app.config.from_object(config)
    # ORM 초기화 : flask db init 최초 1회만 실행, migration 폴더 생성 확인
    # 이후 모델 변경 시 flask db migrate 실행, migration 폴더에 변경 내역 확인
    # 변경 내역을 데이터베이스에 적용하려면 flask db upgrade 실행
    db.init_app(app)
    migrate.init_app(app, db)
    from . import models

    from .views import main_views
    app.register_blueprint(main_views.bp)

    return app
