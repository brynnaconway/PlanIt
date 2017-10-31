#! /usr/bin/env python2
import json

from flaskext.mysql import MySQL
from flask import Flask, render_template,request
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

@app.route('/generate',methods=['POST','GET'])
def generate_data():
    res = db.generate_data()
    if request.method == 'GET':
        return render_template('generate.html.html')
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
    return res

@app.route('/people')
def get_people():
    return render_template('people.html')

@app.route('/searchpeople', methods=['POST'])
def search_people():
    data = request.get_data()
    d = deserialize(data)
    res = db.query('''SELECT name,phoneNumber FROM people WHERE name LIKE '%{}%';'''.format(d['queryName']))
    jres = json.dumps(dict(res))
    return jres

if __name__ == "__main__":
    app.run(host="0.0.0.0")
