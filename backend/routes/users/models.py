from werkzeug.security import check_password_hash

class User:
    def __init__(self, username: str):
        self.username = username
        self.is_authenticated = True

    @staticmethod
    def is_active():
        return True

    @staticmethod
    def is_anonymous():
        return False
    
    def get_id(self):
        return self.username
    
    @staticmethod
    def check_password(password_hash: str, password:str):
        return check_password_hash(password_hash, password)

