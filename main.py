from __future__ import print_function
import random

import flask

from flask import Flask
from flask import render_template, url_for, request, jsonify
import os, shutil, math
import json
from PIL import Image
from itertools import product
from colorthief import ColorThief


# import binascii
# import numpy as np
# import scipy
# import scipy.misc
# import scipy.cluster

NUM_CLUSTERS = 5

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

@app.route('/your_image',  methods=['POST'])
def your_image():
    clearUploads()
    try:
        if 'imagefile' not in request.files:
            return jsonify({"error": "No file part"}), 400

        imagefile = request.files['imagefile']

        print(imagefile)

        if imagefile.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save the file (optional)
        imagefile.save(f"uploads/{imagefile.filename}")

        colors = tile(imagefile.filename, 'uploads', 'uploads')
        print("render")
        #return render_template('your_photo.html')

    except Exception as err:
        print("ErRoR", err)
        return jsonify({"error": str(err)}), 500

    return render_template('your_photo.html', colors=colors)

@app.route('/temp')
def temp():
    return render_template('temporary.html')


def tile(filename, dir_in, dir_out):
    colors = []
    name, ext = os.path.splitext(filename)
    img = Image.open(os.path.join(dir_in, filename))
    w, h = img.size
    d = math.floor(w / 10)

    grid = product(range(0, h - h % d, d), range(0, w - w % d, d))
    for i, j in grid:
        box = (j, i, j + d, i + d)
        out = os.path.join(dir_out, f'{name}_{i}_{j}{ext}')
        img.crop(box).save(out)

    grid = product(range(0, h - h % d, d), range(0, w - w % d, d))
    for i, j in grid:
        color_thief = ColorThief(f'uploads/{name}_{i}_{j}{ext}')
        dominant_color = color_thief.get_color(quality=10)
        print(i, j, dominant_color)
        colors.append(dominant_color)

    return colors

        #print('reading image')
        # im = img
        # im = im.resize((150, 150))  # optional, to reduce time
        # ar = np.asarray(im)
        # shape = ar.shape
        # ar = ar.reshape(scipy.product(shape[:2]), shape[2]).astype(float)
        #
        # print('finding clusters')
        # codes, dist = scipy.cluster.vq.kmeans(ar, NUM_CLUSTERS)
        # print('cluster centres:\n', codes)
        #
        # vecs, dist = scipy.cluster.vq.vq(ar, codes)  # assign codes
        # counts, bins = scipy.histogram(vecs, len(codes))  # count occurrences
        #
        # index_max = scipy.argmax(counts)  # find most frequent
        # peak = codes[index_max]
        # colour = binascii.hexlify(bytearray(int(c) for c in peak)).decode('ascii')
        # print('most frequent is %s (#%s)' % (peak, colour))

def clearUploads():
    folder = 'uploads'
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