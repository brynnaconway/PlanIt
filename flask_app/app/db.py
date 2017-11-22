#! /usr/bin/env DB
import json

from flaskext.mysql import MySQL
from data_gen.generate_data import get_functions
from util import deserialize, qfy
from werkzeug import generate_password_hash, check_password_hash
import urllib

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
        res = curr.fetchall()
        self.conn.commit()

        if len(res) is 0:
            return json.dumps({'message': 'Database reset successfully !'})
        else:
            return json.dumps({'error': str(res)})


    def generate_data(self):
        print 'Generating data...'
        self.reset()
        cur = self.conn.cursor()
        for func in get_functions():
            print 'Running ' + func.__name__ + '...'
            query = func(self)
            cur.execute(query)
            print 'ok'
        res = cur.fetchall()
        self.conn.commit()

        if len(res) is 0:
            return json.dumps({'message': 'Database generated successfully !'})
        else:
            return json.dumps({'error': str(res)})

        print 'all ok'

    def query(self, q):
        print q
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

    def sign_in(self, data):
        d = deserialize(data)
        email = urllib.unquote_plus(d['inputEmail'])
        password = d['inputPassword']
        res = self.query('''SELECT personID, password FROM people WHERE email like "{}" limit 1;'''.format(email))
        if len(res) is 0:
            return json.dumps({'error': "User does not exist"})
        else:
            if check_password_hash(res[0][1], password):
                return {'personID': str(res[0][0]), 'valid' : True}
            else:
                return {'valid' : False}

    def add_person(self,data):
        d = deserialize(data)
        name = urllib.unquote_plus(d['inputName'])
        num = d['inputNum']
        email = urllib.unquote_plus(d['inputEmail'])
        password = d['inputPassword']

        res = self.query('''INSERT into people (name, phoneNumber, email, password) 
                        VALUES ('{}','{}', '{}', '{}');'''.format(name, num, email, generate_password_hash(password)))

        if len(res) is 0:
            return json.dumps({'message': 'User created successfully !'})
        else:
            return json.dumps({'error': str(data[0])})

    def add_group(self, data):
        res = self.query('''INSERT into groups (groupID, groupName) 
                        VALUES ({},'{}');'''.format(0, data))

        id = self.query('''SELECT groupID from groups where groupName = {};'''.format(qfy(data)))
        return str(id[0][0])

    def add_event(self, data):
        res = self.query('''INSERT into events (eventID, groupID) VALUES (0,'{}');'''.format('171'))
        newID = self.query('''SELECT last_insert_id() FROM events;''')

        if len(res) is 0:
            return json.dumps({'message': 'Event created successfully !'})
        else:
            return json.dumps({'error': str(data[0])})


    def delete_event(self, data):
        res = self.query('''DELETE FROM events WHERE eventID='{}';'''.format('422'))

        if len(res) is 0:
            return json.dumps({'message': 'Event deleted successfully !'})
        else:
            return json.dumps({'error': str(data[0])})
