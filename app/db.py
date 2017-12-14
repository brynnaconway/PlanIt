#! /usr/bin/env DB
import json

from datetime import datetime
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
        app.config['MYSQL_DATABASE_USER'] = config['user']
        app.config['MYSQL_DATABASE_PASSWORD'] = config['mysql_password']
        app.config['MYSQL_DATABASE_DB'] = config['database']
        app.config['MYSQL_DATABASE_HOST'] = '0.0.0.0'
        mysql.init_app(app)
        self.mysql = mysql
        self.conn = mysql.connect()

    # Database management
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

    # Query helping functions
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

    # Sign in
    def sign_in(self, data):
        d = deserialize(data)
        email = urllib.unquote_plus(d['inputEmail'])
        password = d['inputPassword']
        res = self.query('''SELECT personID, password FROM people WHERE email like "{}" limit 1;'''.format(email))
        print(session)
        if len(res) is 0:
            return {'valid': False}
        else:
            if check_password_hash(res[0][1], password):
                return {'personID': str(res[0][0]), 'valid': True}
            else:
                return {'valid': False}

    # Getting data
    def getGroups(self, uid):
        # uid = 1
        print('SELECTING group IDS')
        res = self.query('''
            SELECT g.groupID, g.groupName from groups g WHERE g.groupID in (
            SELECT groupID from memberships where personID = {});
            '''.format(uid))

        groups = {l[1]: l[0] for l in res}

        print(groups)
        return jsonify({'groups': groups, 'valid': True})

    # Adding data
    def add_person(self, data):
        d = deserialize(data)
        print(d)
        name = urllib.unquote_plus(d['inputName'])
        email = urllib.unquote_plus(d['inputEmail'])
        newUserForGroup = False 
        addToGroup = None        

        try:
            num = d['inputNum']
        except KeyError:
            num = None
        
        try: 
            addToGroup = d['addToGroup']
            newUserForGroup = True 
        except KeyError: 
            addToGroup = None 

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

        if addToGroup == 'true':
            self.query('INSERT INTO memberships (groupID, personID) VALUES ({},{});'.format(session['eventGroup'], new_id))

        if len(res) is not 0:
            return {'error': str(data[0])}
        elif not newUserForGroup: 
            session['loggedIn'] = True
            session['personID'] = new_id
            return {'message': 'User created successfully !', 'id': new_id}
        else:
            return {'message': 'User created successfully !', 'id': new_id}

    def add_group(self, data):
        print(session)
        data = deserialize(data)
        print(data)
        if data['new_group'] == 'true':
            name = urllib.unquote_plus(data['name'])
            name.replace("'", "''")
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
                    WHERE eventID = {};\n'''.format(new_id, session['eventDetailsId']))

            print(session)
            return jsonify({'valid': True, 'id': new_id})
        else:
            assert 'id' in data.keys()
            session['eventGroup'] = data['id']

            if 'eventDetailsID' in session.keys():
                print('Updating EVENT with GROUPID')
                q = ''' UPDATE events SET groupID={}
                     WHERE eventID = {};\n'''.format(data['id'], session['eventID'])
                self.query(q)

            return jsonify({'valid': True})

    def add_location(self, data, eventID):
        print('INSERTING new location')
        data = deserialize(data)
        print(data)
        location = data['location'].replace("'", "''")
        location = urllib.unquote_plus(location)
        res = self.query(
            '''INSERT into locations (location, eventID, votes) VALUES ('{}', {}, 0);'''.format(location, eventID))

        if len(res) is 0:
            return json.dumps({'message': 'Location added successfully !', 'id': location})
        else:
            return json.dumps({'error': str(data[0])})

    def add_lodge(self, data, eventID):
        d = deserialize(data)
        lodgeName = urllib.unquote_plus(d['lodgeName'])
        lodgeName.replace("'", "''")
        lodgeAddress = urllib.unquote_plus(d['lodgeAddress'])
        lodgeAddress.replace("'", "''")
        lodgeURL = urllib.unquote_plus(d['lodgeURL'])
        lodgePrice = d['lodgePrice']
        print('INSERTING new lodge')
        print "lodgeName: ", lodgeName
        res = self.query(
            '''INSERT into lodging (name, address, url, price, votes, eventID) VALUES ('{}', '{}', '{}', {}, 0, {});'''.format(
                lodgeName, lodgeAddress, lodgeURL, lodgePrice, eventID))

        if len(res) is 0:
            return json.dumps({'message': 'Lodge added successfully !'})
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
        res = self.query(
            '''INSERT into events (eventID, eventName, groupID,admin) VALUES (0, '{}', {},{});'''.format(eventName,
                                                                                                         groupID,
                                                                                                         session[
                                                                                                             'personID']))
        newID = self.query('''SELECT LAST_INSERT_ID() from events''')[0][0]
        print(newID)
        session['eventDetailsId'] = newID

        if len(res) is 0:
            return json.dumps({'message': 'Event created successfully !', 'id': newID})
        else:
            return json.dumps({'error': str(data[0])})

    def add_membership(self, data):
        data = json.loads(data)
        assert 'ids' in data.keys()
        for id in data['ids']:
            id = int(id)
            res = self.query('''INSERT into memberships (groupID, personID) 
                        VALUES ({},{})'''.format(session['eventGroup'], id))

        return jsonify({'valid': True})

    def add_message(self, data):
        message = urllib.unquote_plus(data['message']).replace("'", "''")

        res = self.query('''INSERT INTO messages (personID, timestamp, eventID, message)
                VALUES ({},'{}',{},'{}');'''.format(int(data['personID']),
                                                    urllib.unquote_plus(data['timestamp']), int(data['eventID']),
                                                    message))

        return jsonify({'valid': True})

    def addNewTime(self, data):
        in_for = '%a %b %d %Y %H:%M:%S'
        out_for = '%Y-%m-%d %H:%M:%S'

        data = deserialize(data)
        start_raw = urllib.unquote_plus(data['start'])
        print(start_raw)
        stop_raw = urllib.unquote_plus(data['stop'])
        start = ' '.join(start_raw.lower().split(' ')[:-2])
        stop = ' '.join(stop_raw.lower().split(' ')[:-2])
        start_str = datetime.strptime(start, in_for).strftime(out_for)
        stop_str = datetime.strptime(stop, in_for).strftime(out_for)
        res = self.query('''INSERT into timerange (personID, eventID, start, stop, votes) 
                    VALUES ({},{},'{}','{}', 0);'''.format(session['personID'], session['eventDetailsID'], start_str,
                                                        stop_str))
        return jsonify({'valid': 'true'})

    # Voting
        # Voting
    def submit_time_vote(self, data, eventID):
        print('UPDATING timerange vote')
        data = deserialize(data)
        print "TIME DATA: ", data
        time = data['timeID']
        res = self.query(
            '''UPDATE timerange set votes = votes + 1 where timeID={} and eventID = {};'''.format(time, eventID))
        if len(res) is 0:
            return json.dumps({'message': 'Time vote updated successfully !', 'id': time})
        else:
            return json.dumps({'error': str(data[0])})

    def submit_location_vote(self, data, eventID):
        print('UPDATING location vote')
        data = deserialize(data)
        location = data['location'].replace("'", "''")
        location = urllib.unquote_plus(location)
        res = self.query(
            '''UPDATE locations set votes = votes + 1 where location = '{}' and eventID = {};'''.format(location,
                                                                                                        eventID))
        if len(res) is 0:
            return json.dumps({'message': 'Location vote updated successfully !', 'id': location})
        else:
            return json.dumps({'error': str(data[0])})

    def submit_location(self, eventID, location):
        eventID = eventID
        res = self.query(
            '''UPDATE events SET locationID = (select locationID from locations where eventID = {} and location = '{}');'''.format(
                eventID, location))
        if len(res) is 0:
            return json.dumps({'message': 'Location updated in events !', 'id': eventID})
        else:
            return json.dumps({'error': str(data[0])})

    def submit_time(self, eventID, timeID):
        eventID = eventID
        res = self.query(
            '''UPDATE events SET timeID={} where eventID={};'''.format(
                timeID, eventID))
        if len(res) is 0:
            return json.dumps({'message': 'Time updated in events !', 'id': eventID})
        else:
            return json.dumps({'error': str(data[0])})

    def submit_lodge_vote(self, data, eventID):
        print('UPDATING lodge vote')
        eventID = eventID;
        data = deserialize(data)
        print(data)
        lodgeName = urllib.unquote_plus(data['lodgeName'])
        print "LodgeName: ", lodgeName
        res = self.query(
            '''UPDATE lodging set votes = votes + 1 where name = '{}' and eventID = {};'''.format(lodgeName, eventID))
        if len(res) is 0:
            return json.dumps({'message': 'Location vote updated successfully !', 'id': lodgeName})
        else:
            return json.dumps({'error': str(data[0])})

    def submit_lodge(self, eventID, lodgeID):
        eventID = eventID
        lodgeID = lodgeID
        res = self.query('''UPDATE events SET lodgeID = {} where eventID = {};'''.format(lodgeID, eventID))
        if len(res) is 0:
            return json.dumps({'message': 'Location updated in events !', 'id': lodgeID})
        else:
            return json.dumps({'error': str(data[0])})

    # Deletion
    def delete_event(self, data):
        res = self.query('''DELETE FROM events WHERE eventID='{}';'''.format(data))

        if len(res) is 0:
            return json.dumps({'message': 'Event deleted successfully !'})
        else:
            return json.dumps({'error': str(data[0])})
