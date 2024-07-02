from database import Database

class Client(Database):
    def __init__(self, id=None, name=None, email=None, phone_number=None):
        self.id = id
        self.name = name
        self.email = email
        self.phone_number = phone_number

    @classmethod
    def get_all_clients(cls):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM client;')
        clients = cur.fetchall()
        cur.close()
        conn.close()
        return [cls(**client) for client in clients]

    @classmethod
    def add_client(cls, name, email, phone_number):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO client (name, email, phone_number) VALUES (%s, %s, %s) RETURNING id;', (name, email, phone_number))
        new_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()
        return cls(id=new_id, name=name, email=email, phone_number=phone_number)

    @classmethod
    def update_client(cls, client_id, name=None, email=None, phone_number=None):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        if name:
            cur.execute('UPDATE client SET name = %s WHERE id = %s;', (name, client_id))
        if email:
            cur.execute('UPDATE client SET email = %s WHERE id = %s;', (email, client_id))
        if phone_number:
            cur.execute('UPDATE client SET phone_number = %s WHERE id = %s', (phone_number, client_id))
        conn.commit()
        cur.close()
        conn.close()
        return cls.get_client_by_id(client_id)

    @classmethod
    def delete_client(cls, client_id):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM client WHERE id = %s;', (client_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {'message': 'Client deleted'}

    @classmethod
    def get_client_by_id(cls, client_id):
        conn = cls.get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM client WHERE id = %s;', (client_id,))
        client = cur.fetchone()
        cur.close()
        conn.close()
        if client:
            return cls(**client)
        return None

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'email': self.email, 'phone_number': self.phone_number}