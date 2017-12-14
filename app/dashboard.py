'''
Dashboard routes for the app. So as not to clutter up the app.py
'''

from flask import Flask, render_template,request, jsonify, redirect, url_for, session
import app.db


global db


