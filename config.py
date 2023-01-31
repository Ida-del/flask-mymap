import os

BASE_DIR = 'C:\\Users\\user\\Desktop\\pybo\\myproject'

db = {
    'user': 'root',
    'password': '1234',
    'host': '127.0.0.1',
    'port': '3306',
    'database': 'local_db'
}

# pybo.db 파일을 생성하고, 데이터베이스 연결 정보를 저장
SQLALCHEMY_DATABASE_URI = f"mysql+mysqlconnector://{db['user']}:{db['password']}@{db['host']}:{db['port']}/{db['database']}?charset=utf8".format(
    os.path.join(BASE_DIR, 'pybo.db'))
SQLALCHEMY_TRACK_MODIFICATIONS = False


def get_api_key():
    return "c2b5ac428eca9c499e56a2557c7f24a5"


WTF_CSRF_ENABLED = True
SECRET_KEY = "dev"
