#! /usr/bin/env python2

from flaskext.mysql import MySQL
from flask import Flask, render_template
from app.db import DB
import yaml

config = yaml.load(open('planit.config'))
app = Flask(__name__)
db = DB(app, config)
app.config["DEBUG"] = True  # Only include this while you are testing your app

@app.route('/')
def homepage():
    return render_template('root.html')

@app.route('/generate')
def generate_data():
    db.generate_data()
    return render_template('generate.html')

@app.route('/reset')
def reset_db():
    db.reset()
    return render_template('reset.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0")
