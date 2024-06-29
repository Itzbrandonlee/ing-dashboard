from database import Database

class User(Database):
    def __init__(self, id=None, name=None, password=None):
        self.id = id
        self.name = name
        self.password = password

    @classmethod
    def get_all_users(cls):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM users;')
        users = cur.fetchall()
        cur.close()
        conn.close()
        return [cls(**user) for user in users]

    @classmethod
    def add_user(cls, name, password):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO users (name, password) VALUES (%s, %s) RETURNING id;', (name, password))
        new_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()
        return cls(id=new_id, name=name, password=password)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'password': self.password}