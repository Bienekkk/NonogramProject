from flask import Flask
from flask import render_template
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')


if __name__ == '__main__':
    app.run(debug=True)