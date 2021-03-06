#! /usr/bin/env python2
import json

from flaskext.mysql import MySQL
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from werkzeug.exceptions import HTTPException

from app import location
from app.db import DB
import urllib
import yaml
import os
import datetime
import urllib
from flight import Flight
from app.util import deserialize
from flask_mail import Mail, Message

config = yaml.load(open('planit.config'))
app = Flask(__name__)
db = DB(app, config)
app.config["DEBUG"] = True  # Only include this while you are testing your app
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'planIt.travelwebsite@gmail.com'
app.config['MAIL_PASSWORD'] = 'dataWizards'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

flight_results = []
'From https://stackoverflow.com/questions/29332056/global-error-handler-for-any-exception/41655397#41655397'
'Makes sure the server stays up worst case scenario'


def handle_error(error):
    code = 500
    if isinstance(error, HTTPException):
        code = error.code
    return jsonify(error='error', code=code)


for cls in HTTPException.__subclasses__():
    app.register_error_handler(cls, handle_error)

'''
SESSION PARAMS:
eventID:    'eventDetailsID'
peopleID:   'personID'
groupID:    'eventGroup'    
Logged in?: 'loggedin'
'''


# Pages
@app.route('/', methods=['POST', 'GET'])
def homepage():
    try:
        if session['loggedIn']:
            render_template('dashboard.html')
        else:
            return render_template('root.html')
    except KeyError:
        return render_template('root.html')


@app.route('/generate', methods=['POST', 'GET'])
def generate_data():
    res = db.generate_data()
    if request.method == 'GET':
        return render_template('generate.html')
    else:
        return res


@app.route('/reset', methods=['POST', 'GET'])
def reset_db():
    res = db.reset()
    if request.method == 'GET':
        return render_template('reset.html')
    else:
        return res


@app.route('/dashboard', methods=['POST', 'GET'])
def dashboard():
    try:
        personID = session['personID']
        eventIDs = db.single_attr_query(
            '''SELECT eventID FROM events WHERE groupID IN ( select groupID FROM memberships WHERE personID = {});'''.format(
                personID))
        names = db.single_attr_query(
            '''SELECT eventName FROM events WHERE groupID IN ( select groupID FROM memberships WHERE personID = {});'''.format(
                personID))
        return render_template('dashboard.html', eventData=zip(eventIDs, names))
    except Exception as e:
        print(e)
        return redirect(url_for('homepage'))


@app.route('/pickPeople', methods=['GET'])  # I don't think this is used anymore
def get_people():
    return render_template('people.html')


@app.route('/signUp')
def signUp():
    return render_template('signup.html')


# Login / Session Management
@app.route('/signIn', methods=['POST'])
def signIn():
    if request.method == 'POST':
        data = request.get_data()
        res = db.sign_in(data)
        if res['valid']:
            personID = res['personID']
            session['personID'] = personID
            session['loggedIn'] = True
            print('1')
            return redirect(url_for('dashboard', personID=personID))

        else:
            print('2')
            session['personID'] = None
            return json.dumps(res)
    else:
        print('3')
        return render_template('root.html')


@app.route('/signOut')
def signOut():
    session['personID'] = None
    session['loggedIn'] = False
    return redirect(url_for('homepage'))


@app.route('/setEventDetailsID', methods=['POST'])
def setEventDetailsID():
    data = request.get_data()
    print "DATA: ", data
    eventID = data.split('=')[1]
    print "eventID: ", eventID
    session['eventDetailsID'] = eventID
    # return redirect(url_for('eventDetails'))
    return eventID


# Pulling Data
@app.route('/getName')
def getName():
    userID = session['personID']
    name = db.query('''SELECT name FROM people WHERE personID={};'''.format(userID))
    return name[0][0]

@app.route('/getGroup')
def getGroup():
    print "session['eventGroup']: {}".format(session['eventGroup'])
    return str(session['eventGroup'])


@app.route('/getGroups', methods=['POST'])
def getGroups():
    res = db.getGroups(session['personID'])
    return res


@app.route('/getPeopleInGroup', methods=['POST'])
def getPeopleInGroup():
    res = db.query(
        '''SELECT personID, name, email, phoneNumber from people where personID in (SELECT personID from memberships where groupID = {});'''.format(
            session['eventGroup']))
    d = {k[1]: (k[0], k[2], k[3]) for k in res}
    return jsonify(d)


@app.route('/searchpeople', methods=['POST'])
def search_people():
    data = request.get_data()
    d = deserialize(data)
    res = db.query('''SELECT name,phoneNumber,personID FROM people WHERE name LIKE '%{}%';'''.format(d['queryName']))
    jres = jsonify(data=res)
    # jres = json.dumps(dict(res))
    return jres


@app.route('/searchpeople2', methods=['POST'])  # I'm sorry for this, I really am
def search_people2():
    data = request.get_data()
    d = deserialize(data)
    res = db.query(
        '''SELECT personID,name, email, phoneNumber FROM people WHERE name LIKE '%{}%';'''.format(d['queryName']))
    d = {k[1]: (k[0], k[2], k[3]) for k in res}
    return jsonify(d)


@app.route('/getLocationSuggestions', methods=['POST'])
def getLocationSuggestions():
    data = request.get_data()
    return location.getLocationSuggestions(data)


# Add new data
@app.route('/addperson', methods=['POST'])
def add_person():
    sendEmail = False
    data = request.get_data()
    emailRecipient = urllib.unquote_plus(deserialize(data)['inputEmail'])
    recipientName = urllib.unquote_plus(deserialize(data)['inputName'])

    try:
        password = deserialize(data)['inputPassword']
        sendEmail = False
    except:
        sendEmail = True

    try:
        addToGroup = deserialize(data)['addToGroup']
        sendEmail = True
    except:
        sendEmail = False

    if sendEmail:
        msg = Message('You\'ve been invited to PlanIt!', sender='planIt.travelwebsite@gmail.com',
                      recipients=[emailRecipient])
        msg.body = "{},\n\nYour friend has invited you to join PlanIt, the group travel planning website! Login to see who has invited you and what event you have been added to.\n\nEmail: {}\nPassword: password".format(
            recipientName, emailRecipient)
        mail.send(msg)

    res = db.add_person(data)
    print "Response: ", res
    return jsonify(res)


@app.route('/addgroup', methods=['POST'])
def add_group():
    data = request.get_data()
    res = db.add_group(data)
    return res


@app.route('/addmembership', methods=['POST'])
def add_membership():
    data = request.get_data()
    res = db.add_membership(data)
    return res


@app.route('/eventDetails', methods=['POST', 'GET'])
def eventDetails():

    flight = False
    print "session[eventDetailsID]: ", session['eventDetailsID']

    session['eventGroup'] = \
        db.single_attr_query('SELECT groupID FROM events where eventID = {}'.format(session['eventDetailsID']))[0]

    eventID = session['eventDetailsID']
    admin = db.query('''SELECT admin from events where eventID = {};'''.format(eventID))
    if int(admin[0][0]) == int(session['personID']):
        print "IN***"
        adminBool = True
    else:
        print "FALSE*****"
        adminBool = False
    print "adminBOOL: ", adminBool

    finalLocation = db.query(
        '''SELECT location from locations WHERE eventID = {} ORDER BY votes DESC limit 1;'''.format(eventID))

    finalLodge = db.query(
        '''SELECT name from lodging WHERE eventID= {} ORDER BY votes DESC limit 1;'''.format(eventID))

    finalTime = db.query(
        '''SELECT start, stop from timerange WHERE eventID = {} ORDER BY votes DESC limit 1;'''.format(eventID))

    try:
        finalLocation = finalLocation[0][0]
        print "finalLocation in try: ", finalLocation
    except:
        finalLocation = "No locations available."

    try:
        finalLodge = finalLodge[0][0]
    except:
        finalLodge = "No lodging available."

    try:
        finalTime = finalTime[0]
    except:

        finalTime = (datetime.date(2018, 3, 11), datetime.date(2018, 3, 12))

    print "finalTime: ", finalTime

    try:
        data = request.get_data()
        d = deserialize(data)
        departure_city = d['departure_city']
        departure_time = finalTime[0].strftime('%m/%d/%Y')
        f = Flight()
        results = f.parse(str(departure_city), str(finalLocation), str(departure_time))
        for i in range(0, len(results)):
            departure = urllib.unquote(departure_city).replace('+', ' ')
            if departure in str(results[i][0]):
                flight_results.append(results[i])

    except:
        departure_city = "No city chosen"

    inProgressData = db.query(
        '''SELECT locationsInProgress, timeInProgress, lodgingInProgress FROM events WHERE eventID = {};'''.format(
            eventID))
    locations = db.query('''SELECT location FROM locations WHERE eventID = {};'''.format(eventID))
    lodgeData = db.query('''SELECT name, address, url, price FROM lodging where eventID = {};'''.format(eventID))
    times = db.query('''SELECT timeID, start, stop FROM timerange where eventID = {};'''.format(eventID))
    people = db.query(
        '''SELECT name, email, phoneNumber, personID from people where personID in (SELECT personID from memberships where groupID = {});'''.format(
            session['eventGroup']))

    return render_template('eventDetails.html', finalTime=finalTime, finalLocation=finalLocation, finalLodge=finalLodge,
                           inProgressData=inProgressData,
                           locations=locations, adminBool=adminBool, lodgeData=lodgeData, timeData=times,
                           peopleData=people, flight_results=flight_results)

@app.route('/addlocation', methods=['POST'])
def addLocation():
    data = request.get_data()
    res = db.add_location(data, session['eventDetailsID'])
    return res


@app.route('/addlodge', methods=['POST'])
def addLodge():
    data = request.get_data()
    print "LODGE data: ", data
    res = db.add_lodge(data, session['eventDetailsID'])
    return res


@app.route('/createEventDetails')  # I don't think this is used
def createEventDetails():
    return render_template('createEventDetails.html')


@app.route('/createEvent', methods=['POST'])
def createEvent():
    data = request.get_data()
    print "data: ", data
    res = db.add_event(data)
    return res


@app.route('/sendMessage', methods=['POST'])
def sendMessage():
    data = request.get_data()
    d = deserialize(data)

    messageData = {}
    messageData['personID'] = session['personID']
    timestamp = urllib.unquote(d['timestamp']).decode('utf8')
    messageData['timestamp'] = timestamp
    messageData['eventID'] = session['eventDetailsID']
    messageData['message'] = d['message']

    res = db.add_message(messageData)

    return res


# Voting
@app.route('/submitLocationVote', methods=['POST'])
def submitLocationVote():
    data = request.get_data()
    res = db.submit_location_vote(data, session['eventDetailsID'])
    return res


@app.route('/submitLocation', methods=['POST'])
def submitLocation():
    res1 = db.query(
        ''' UPDATE events SET locationsInProgress=1 WHERE eventID = {};\n'''.format(session['eventDetailsID']))
    eventID = session['eventDetailsID']
    location = db.query(
        '''SELECT location from locations WHERE eventID = {} ORDER BY votes DESC limit 1;'''.format(eventID))
    print "LOCATION: ", location
    res = db.submit_location(eventID, location[0][0])
    return res


@app.route('/submitTime', methods=['POST'])
def submitTime():
    res1 = db.query(
        ''' UPDATE events SET timeInProgress=1 WHERE eventID = {};\n'''.format(session['eventDetailsID']))
    eventID = session['eventDetailsID']
    time = db.query(
        '''SELECT start, stop, timeID from timerange WHERE eventID = {} ORDER BY votes DESC limit 1;'''.format(eventID))
    print "TIME: ", time
    res = db.submit_time(eventID, time[0][2])
    return res


@app.route('/submitTimeVote', methods=['POST'])
def submitTimeVote():
    data = request.get_data()
    res = db.submit_time_vote(data, session['eventDetailsID'])
    return res


@app.route('/addTime', methods=['POST'])
def addTime():
    data = request.get_data()
    return db.addNewTime(data)


@app.route('/submitLodging', methods=['POST'])
def submitLodging():
    res1 = db.query(
        ''' UPDATE events SET lodgingInProgress=1 WHERE eventID = {};\n'''.format(session['eventDetailsID']))
    eventID = session['eventDetailsID']
    lodge = db.query('''SELECT lodgeID from lodging WHERE eventID = {} ORDER BY votes DESC limit 1;'''.format(eventID))
    print "Lodge: ", lodge[0][0]
    res = db.submit_lodge(eventID, lodge[0][0])
    return res


@app.route('/submitLodgeVote', methods=['POST'])
def submitLodgeVote():
    data = request.get_data()
    res = db.submit_lodge_vote(data, session['eventDetailsID'])
    return res


# Deletion
@app.route('/deleteEvent', methods=['POST'])
def deleteEvent():
    data = request.get_data()
    data = data.split('=')[1]
    res = db.delete_event(data)
    return res


@app.route('/deleteMembership', methods=['POST'])
def deleteMembership():
    data = request.get_data()
    peopleID = deserialize(data)['id']
    if peopleID != session['personID']:
        res = db.query(
            '''DELETE FROM memberships WHERE groupID={} and personID={};'''.format(session['eventGroup'], peopleID))
        return jsonify(res)
    else:
        return jsonify({'valid': False})


if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    app.run(host="0.0.0.0")
