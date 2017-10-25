#! /usr/bin/env DB

from flaskext.mysql import MySQL
from data_gen.generate_data import gen_people

class DB(object):
    """docstring for ClassName"""
    def __init__(self, app):
        mysql = MySQL()

        # MySQL configurations
        app.config['MYSQL_DATABASE_USER'] = 'root'
        app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
        app.config['MYSQL_DATABASE_DB'] = 'planit'
        app.config['MYSQL_DATABASE_HOST'] = 'localhost'
        mysql.init_app(app)
        self.mysql = mysql
        self.conn = mysql.connect()

    def reset(self):
        query = open('./resources/schema.sql').read()
        curr = self.conn.cursor()
        curr.execute(query)
        self.conn.commit()

    def generate_data(self):
        query = gen_people()
        curr = self.conn.cursor()
        curr.execute(query)
        self.conn.commit()

