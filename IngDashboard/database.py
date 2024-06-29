import psycopg2
from psycopg2.extras import RealDictCursor
import config

class Database:
    @staticmethod
    def get_db_connection():
        conn = psycopg2.connect(
            host=config.DB_HOST,
            database=config.DB_NAME,
            user=config.DB_USER,
            password=config.DB_PASS,
            cursor_factory=RealDictCursor
        )
        return conn