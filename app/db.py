#! /usr/bin/env DB
import json
from flask import session, jsonify
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
        try: 
            res = [l[0] for l in cur.fetchall()]
            res = str(res)
            self.conn.commit()
            return res
        except:
            res = [l[0] for  l in curr.fetchall()]
            self.conn.commit()
            return res

    def sign_in(self, data):
        d = deserialize(data)
        email = urllib.unquote_plus(d['inputEmail'])
        password = d['inputPassword']
        res = self.query('''SELECT personID, password FROM people WHERE email like "{}" limit 1;'''.format(email))
        if len(res) is 0:
            return {'valid': False}
        else:
            if check_password_hash(res[0][1], password):
                return {'personID': str(res[0][0]), 'valid' : True}
            else:
                return {'valid' : False}

    def add_person(self,data):
        d = deserialize(data)
        name = urllib.unquote_plus(d['inputName'])
        email = urllib.unquote_plus(d['inputEmail'])
        newUserForGroup = False 
        try:
            num = d['inputNum']
        except KeyError:
            num = None
        try:
            password = generate_password_hash(d['inputPassword'])
        except KeyError:
            # No password, don't log in
            newUserForGroup = True
            password = generate_password_hash(d['inputEmail'])

        res = self.query('''INSERT into people (name, phoneNumber, email, password) 
                        VALUES ('{}','{}', '{}', '{}');'''.format(name, num, email, password))
        new_id = self.query('select LAST_INSERT_ID()')[0][0]
        print('add_res{}'.format(res))

        if len(res) is not 0:
            return {'error': str(data[0])}
        elif not newUserForGroup: 
            session['loggedIn']=True
            session['personID'] = new_id
            print "personID: ", session['personID']
            return {'message': 'User created successfully !', 'id':new_id}
        else:
            print "personID in else: ", session['personID']            
            return {'message': 'User created successfully !', 'id':new_id}

    def add_group(self, data):
        print(session)
        data = deserialize(data)
        print(data)
        if data['new_group'] == 'true':
            name = urllib.unquote_plus(data['name'])
            name.replace("'","''")
            print('INSERTING new group')
            res = self.query('''INSERT into groups (groupID, groupName) 
                        VALUES ({},'{}');'''.format(0, name))
            new_id = self.query('select LAST_INSERT_ID()')[0][0]

            res = self.query('''INSERT into memberships (groupID, personID) 
                        VALUES ({},{})'''.format(new_id, session['personID']))

            session['eventGroup'] = new_id

            if 'eventID' in session.keys():
                print('Updating EVENT with GROUPID')
                self.query(''' UPDATE events SET groupID={}
                    WHERE eventID = {};\n'''.format(new_id, session['eventID']))

            print(session)
            return jsonify({'valid':True, 'id':new_id})
        else:
            assert 'id' in data.keys()
            session['eventGroup'] = data['id']

            if 'eventID' in session.keys():
                print('Updating EVENT with GROUPID')
                q = ''' UPDATE events SET groupID={}
                     WHERE eventID = {};\n'''.format(data['id'], session['eventID'])
                self.query(q)


            return jsonify({'valid':True})


    def add_location(self, data):
        print('INSERTING new location')
        #eventID = session['eventID']
        eventID = 1;
        data = deserialize(data)
        location = urllib.unquote_plus(data['location'])
        res = self.query('''INSERT into locations (location, eventID, votes) VALUES ('{}', {}, 0);'''.format(location, eventID))

        if len(res) is 0:
            return json.dumps({'message': 'Location added successfully !','id':location})
        else:
            return json.dumps({'error': str(data[0])})

    def add_event(self, data):
        d = deserialize(data)
        eventName = urllib.unquote_plus(d['eventName'])
        groupID = session['eventGroup']
        print "eventName: ", eventName
        if groupID == "_createNewGroup":
            groupID = self.query('''SELECT LAST_INSERT_ID() from groups''')[0][0]
            print "groupID: ", groupID
        print('INSERTING new event')
        res = self.query('''INSERT into events (eventID, eventName, groupID) VALUES (0, '{}', {});'''.format(eventName, groupID))
        newID = self.query('''SELECT LAST_INSERT_ID() from events''')[0][0]
        print(newID)
        session['eventID'] = newID

        if len(res) is 0:
            return json.dumps({'message': 'Event created successfully !','id':newID})
        else:
            return json.dumps({'error': str(data[0])})


    def delete_event(self, data):
        res = self.query('''DELETE FROM events WHERE eventID='{}';'''.format(data))

        if len(res) is 0:
            return json.dumps({'message': 'Event deleted successfully !'})
        else:
            return json.dumps({'error': str(data[0])})

    def getGroups(self, uid):
        # uid = 1
        print('SELECTING group IDS')
        res = self.query('''
            SELECT g.groupID, g.groupName from groups g WHERE g.groupID in (
            SELECT groupID from memberships where personID = {});
            '''.format(uid))

        groups = {l[1]:l[0] for l in res}

        print(groups)
        return jsonify({'groups':groups, 'valid': True})

    def add_membership(self, data):
        data = json.loads(data)
        assert 'ids' in data.keys()
        for id in data['ids']:
            id = int(id)
            res = self.query('''INSERT into memberships (groupID, personID) 
                        VALUES ({},{})'''.format(session['eventGroup'], id))

        return jsonify({'valid': True})
