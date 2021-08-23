import faiss
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from faiss_index import faissIndex
import csv
import io
import json

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
    faissIndex.set_data(data[1:])
    return jsonify(successMsg)


@app.route("/index_construct_params")
def index_construct_params():
    index_type = request.args.get('index_type', 'ivf_flat')
    params = json.loads(request.args.get('params', "{}"))
    print('construct_params', params)
    faissIndex.set_index(index_type, params)
    return jsonify(successMsg)


@app.route("/index_search_params")
def index_search_params():
    params = json.loads(request.args.get('params', "{}"))
    print('search_params', params)
    faissIndex.set_index_search_params(params)
    return jsonify(successMsg)


@app.route("/search_by_id")
def search_by_id():
    id = request.args.get('id', 0)
    return jsonify(faissIndex.search_by_id(int(id)))


@app.route("/search_by_name")
def search_by_name():
    name = request.args.get('name', '')
    return jsonify(faissIndex.search_by_name(name))


if __name__ == '__main__':
    app.run(debug=False, port=12357)
