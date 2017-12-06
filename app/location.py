import urllib

import requests
import yaml
from flask import jsonify

from app.util import deserialize

config = yaml.load(open('planit.config'))

def getLocationSuggestions(data):
    d = deserialize(data)
    input = urllib.unquote_plus(d['input'])

    url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
    params = {
        'input': input,
        'key': config['google_api_key']
    }

    req = requests.get(url=url, params=params)
    res = req.json()['predictions']

    return jsonify(res)
