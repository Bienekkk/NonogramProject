from __future__ import print_function
import random

import flask

from flask import Flask
from flask import render_template, url_for, request, jsonify, session
import os, shutil, math
import json
from PIL import Image, ImageOps
from itertools import product
from colorthief import ColorThief
from flask_session import Session



# import binascii
# import numpy as np
# import scipy
# import scipy.misc
# import scipy.cluster

NUM_CLUSTERS = 5

app = Flask(__name__)
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# app.add_url_rule(
#     "/static/src/favicons/favicon.ico",
#     endpoint="favicon",
#     redirect_to=url_for("static", filename="favicon.ico"),
# )

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

@app.route('/your_photo')
def your_photo():
    colors = session.get("colors", [])
    img = session.get("img")
    return render_template('your_photo.html', colors=colors, img=img)


@app.route('/your_image', methods=['POST'])
def your_image():
    try:
        clearUploads()

        if 'imagefile' not in request.files:
            return jsonify({"error": "No file part"}), 400

        imagefile = request.files['imagefile']
        if imagefile.filename == '':
            return jsonify({"error": "No selected file"}), 400

        save_path = f"static/uploads/{imagefile.filename}"
        imagefile.save(save_path)

        colors = tile(imagefile.filename, 'static/uploads', 'static/uploads')
        session["colors"] = colors
        session["img"] = "uploads/" + imagefile.filename

    except Exception as err:
        print("eRRoR")
        return jsonify({"error": str(err)}), 500

    return jsonify({"redirect_url": url_for("your_photo", _external=True)})

@app.route('/temp')
def temp():
    return render_template('temporary.html')

@app.route('/tutorial')
def tutorial():
    return render_template('tutorial.html')

def resize_to_square(img, size=300):
    img = img.convert("RGB")
    return img.resize((size, size), Image.Resampling.LANCZOS)
def is_blank_tile(image):
    stat = ImageStat.Stat(image)
    return all(stddev < 1 for stddev in stat.stddev)

def tile(filename, dir_in, dir_out):
    colors = []
    name, ext = os.path.splitext(filename)
    img_path = os.path.join(dir_in, filename)
    img = resize_to_square(Image.open(img_path), size=300)

    w, h = img.size
    d = max(1, math.floor(w / 10))  # tile size

    # Save tiles
    grid = product(range(0, h - h % d, d), range(0, w - w % d, d))
    for i, j in grid:
        box = (j, i, j + d, i + d)
        cropped = img.crop(box)
        out_path = os.path.join(dir_out, f'{name}_{i}_{j}{ext}')
        cropped.save(out_path)

    # Extract colors
    grid = product(range(0, h - h % d, d), range(0, w - w % d, d))
    for i, j in grid:
        path = os.path.join(dir_out, f'{name}_{i}_{j}{ext}')
        try:
            color_thief = ColorThief(path)
            dominant_color = color_thief.get_color(quality=10)
        except Exception as e:
            print(f"Error at {path}: {e}")
            dominant_color = (255, 255, 255)  # fallback
        colors.append(dominant_color)

    return colors

def clearUploads():
    folder = 'static/uploads'
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))

#https://stackoverflow.com/questions/3241929/how-to-find-the-dominant-most-common-color-in-an-image

if __name__ == '__main__':
    app.run(debug=True)