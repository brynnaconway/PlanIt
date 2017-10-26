#! /usr/bin/env DB

from flaskext.mysql import MySQL
from data_gen.generate_data import get_functions

class DB(object):
    """docstring for ClassName"""
    def __init__(self, app, config):
        mysql = MySQL()

        # MySQL configurations
        app.config['MYSQL_DATABASE_USER'] = 'root'
        app.config['MYSQL_DATABASE_PASSWORD'] = config['mysql_password']
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
        print 'Generating data...'
        self.reset()
        cur = self.conn.cursor()
        for func in get_functions():
            print 'Running ' + func.__name__ + '...'
            query = func(self)
            cur.execute(query)
            print 'ok'
        self.conn.commit()
        print 'all ok'

    def query(self, q):
        cur = self.conn.cursor()
        cur.execute(q)
        res = cur.fetchall()
        self.conn.commit()
        return res

    def single_attr_query(self, q):
        cur = self.conn.cursor()
        cur.execute(q)
        res = [l[0] for l in cur.fetchall()]
        self.conn.commit()
        return res
