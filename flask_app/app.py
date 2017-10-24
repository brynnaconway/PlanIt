#! /usr/bin/env python2

from flask.ext.mysql import MySQL
from flask import Flask
from 


app = Flask(__name__)
app.config["DEBUG"] = True  # Only include this while you are testing your app

