import random

from flask import Flask
from flask import render_template, url_for, request
import os
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play')
def play():
    mode = request.args.get("mode")
    mode = int(mode)
    with open("static/src/layouts.json", 'r') as layouts:
        data = json.load(layouts)
    data = (data[str(mode)])
    ran = random.randint(1, len(data))
    return render_template('play.html', mode=mode, data=data[str(ran)])

@app.route('/temp')
def temp():
    return render_template('temporary.html')

if __name__ == '__main__':
    app.run(debug=True)