from flask import Flask
from flask import render_template, url_for, request
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play')
def play():
    mode = request.args.get("mode")
    return render_template('play.html', mode=mode)

if __name__ == '__main__':
    app.run(debug=True)