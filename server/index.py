from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from faiss_index import faissIndex
import csv
import io

app = Flask(__name__)
CORS(app)

successMsg = {
    'code': 200,
    'message': 'ok'
}

@app.route("/set_data", methods=['POST'])
def set_data():
    fileRead = request.files['file'].stream.read()
    rows = csv.reader(io.StringIO(str(fileRead, encoding="utf-8")))
    data = [row for row in rows]
    faissIndex.set_data(data)
    return jsonify(successMsg)

@app.route("/index_construct_params")
def index_construct_params():
    return jsonify(successMsg)

@app.route("/index_search_params")
def index_search_params():
    return jsonify(successMsg)

@app.route("/search_by_id")
def search_by_id():
    return jsonify(successMsg)

@app.route("/search_by_name")
def search_by_name():
    return jsonify(successMsg)

if __name__ == '__main__':
    app.run(debug=False, port=12357)