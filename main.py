import random

import flask
from flask import Flask
from flask import render_template, url_for, request, jsonify
import os
import json

# from PIL import Image
# from itertools import product

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

@app.route('/your_image', methods=['POST'])
def your_image():
    try:
        if 'imagefile' not in request.files:
            return jsonify({"error": "No file part"}), 400

        imagefile = request.files['imagefile']

        print(imagefile)

        if imagefile.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save the file (optional)
        imagefile.save(f"uploads/{imagefile.filename}")

        return jsonify({"message": "Image uploaded successfully", "filename": imagefile.filename})

    except Exception as err:
        print(err)
        return jsonify({"error": str(err)}), 500

@app.route('/temp')
def temp():
    return render_template('temporary.html')


# def tile(filename, dir_in, dir_out, d):
#     name, ext = os.path.splitext(filename)
#     img = Image.open(os.path.join(dir_in, filename))
#     w, h = img.size
#
#     grid = product(range(0, h - h % d, d), range(0, w - w % d, d))
#     for i, j in grid:
#         box = (j, i, j + d, i + d)
#         out = os.path.join(dir_out, f'{name}_{i}_{j}{ext}')
#         img.crop(box).save(out)

#https://stackoverflow.com/questions/5953373/how-to-split-image-into-multiple-pieces-in-python

if __name__ == '__main__':
    app.run(debug=True)