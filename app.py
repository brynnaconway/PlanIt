#! /usr/bin/env python2
import json

from flaskext.mysql import MySQL
from flask import Flask, render_template,request, jsonify, redirect, url_for, session

from app import location
from app.db import DB
import yaml
import os
import urllib
from app.util import deserialize

config = yaml.load(open('planit.config'))
app = Flask(__name__)
db = DB(app, config)
app.config["DEBUG"] = True  # Only include this while you are testing your app

@app.route('/', methods=['POST', 'GET'])
def homepage():
    try:
        if session['loggedIn']:
            render_template('dashboard.html')
        else:
            return render_template('root.html')
    except KeyError:
        return render_template('root.html')


@app.route('/signUp')
def signUp():
    return render_template('signup.html') 

@app.route('/signIn', methods=['POST'])  
def signIn():
    if request.method == 'POST':
        data = request.get_data()
        res = db.sign_in(data)
        if res['valid']:
            personID = res['personID']
            session['personID'] = personID
            session['loggedIn'] = True 
            return redirect(url_for('dashboard', personID=personID))
        else:
            session['personID'] = None
            return json.dumps(res)
    else:
       return render_template('root.html')

@app.route('/dashboard', methods=['POST', 'GET'])  
def dashboard():
    try:
        personID = session['personID']
        eventIDs = db.single_attr_query('''SELECT eventID FROM events WHERE groupID IN ( select groupID FROM memberships WHERE personID = {});'''.format(personID))
        names = db.single_attr_query('''SELECT eventName FROM events WHERE groupID IN ( select groupID FROM memberships WHERE personID = {});'''.format(personID))
        return render_template('dashboard.html', eventData=zip(eventIDs, names))
    except Exception as e:
        print(e)
        return redirect(url_for('homepage'))

@app.route('/signOut')
def signOut(): 
    session['personID'] = None
    session['loggedIn'] = False
    return redirect(url_for('homepage'))
    
@app.route('/generate',methods=['POST','GET'])
def generate_data():
    res = db.generate_data()
    if request.method == 'GET':
        return render_template('generate.html')
    else:
        return res

@app.route('/reset',methods=['POST','GET'])
def reset_db():
    res = db.reset()
    if request.method == 'GET':
        return render_template('reset.html')
    else:
        return res

@app.route('/addperson', methods=['POST'])
def add_person():
    data = request.get_data()
    res = db.add_person(data)
    print "Response: ", res
    return jsonify(res)

@app.route('/pickPeople')
def get_people():
    return render_template('people.html')

@app.route('/searchpeople', methods=['POST'])
def search_people():
    data = request.get_data()
    d = deserialize(data)
    res = db.query('''SELECT name,phoneNumber,personID FROM people WHERE name LIKE '%{}%';'''.format(d['queryName']))
    jres = jsonify(data=res)
    # jres = json.dumps(dict(res))
    return jres

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

@app.route('/setEventDetailsID', methods=['POST'])
def setEventDetailsID():
    data = request.get_data()
    print "DATA: ", data 
    eventID = data.split('=')[1]
    print "eventID: ", eventID
    session['eventDetailsID'] = eventID
    #return redirect(url_for('eventDetails'))
    return eventID

@app.route('/eventDetails', methods=['POST', 'GET'])
def eventDetails():
    print "session[eventDetailsID]: ", session['eventDetailsID']
    eventID = session['eventDetailsID']
    locations = db.query('''SELECT location FROM locations WHERE eventID = {};'''.format(eventID))
    return render_template('eventDetails.html', locations = locations)

@app.route('/addlocation', methods=['POST'])
def addLocation():
    data = request.get_data()
    res = db.add_location(data, session['eventDetailsID'])
    return res

@app.route('/submitLocationVote', methods=['POST'])
def submitLocationVote():
    data = request.get_data()
    res = db.submit_location_vote(data, session['eventDetailsID'])
    return res

@app.route('/createEvent', methods=['POST'])
def createEvent():
    data = request.get_data()
    print "data: ", data
    res = db.add_event(data)
    return res

@app.route('/deleteEvent', methods=['POST'])
def deleteEvent():
    data = request.get_data()
    data = data.split('=')[1]
    res = db.delete_event(data)
    return res

@app.route('/getGroups',methods=['POST'])
def getGroups():
    res = db.getGroups(session['personID'])
    return res

@app.route('/createEventDetails')
def createEventDetails():
    return render_template('createEventDetails.html')

@app.route('/getLocationSuggestions', methods=['POST'])
def getLocationSuggestions():
    data = request.get_data()
    return location.getLocationSuggestions(data)


if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    app.run(host="0.0.0.0")
