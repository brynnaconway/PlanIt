#! /usr/bin/env python2
import json

from flaskext.mysql import MySQL
from flask import Flask, render_template,request, jsonify, redirect
from app.db import DB
import yaml

from app.util import deserialize

config = yaml.load(open('planit.config'))
app = Flask(__name__)
db = DB(app, config)
app.config["DEBUG"] = True  # Only include this while you are testing your app

@app.route('/')  
def homepage():
    return render_template('root.html')

@app.route('/signUp')
def signUp():
    return render_template('signup.html') 

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
    print "data is ", data
    res = db.add_person(data)
    return res

@app.route('/addmembership')
def get_people():
    return render_template('people.html')

@app.route('/searchpeople', methods=['POST'])
def search_people():
    data = request.get_data()
    d = deserialize(data)
    res = db.query('''SELECT name,phoneNumber,personID FROM people WHERE name LIKE '%{}%';'''.format(d['queryName']))
    jres = jsonify(data=res)
    # jres = json.dumps(dict(res))
    print jres
    return jres

@app.route('/dashboard')  
def dashboard():
    res = db.single_attr_query('''SELECT eventID FROM events WHERE groupID IN ( select groupID FROM memberships WHERE personID = 9);''')
    # jres = json.dumps(dict(res))
    return render_template('dashboard.html', eventIDs=res)

@app.route('/addgroup', methods=['POST'])
def add_group():
    data = request.get_data()
    print data
    res = db.add_group(data)
    return res

@app.route('/addmembership', methods=['POST'])
def add_membership():
    data = request.get_data()
    print data
    res = db.add_membership(data)

@app.route('/eventDetails')
def eventDetails():
    return render_template('eventDetails.html')

@app.route('/createEvent', methods=['POST'])
def createEvent():
    data = request.get_data()
    res = db.add_event(data)
    return res

@app.route('/deleteEvent', methods=['POST'])
def deleteEvent():
    data = request.get_data()
    data = data.split('=')[0]
    res = db.delete_event(data)
    return res

if __name__ == "__main__":
    app.run(host="0.0.0.0")
