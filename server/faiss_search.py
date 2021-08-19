from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from faiss_index import faissIndex

app = Flask(__name__)
CORS(app)

successMsg = {
    'code': 200,
    'message': 'ok'
}

@app.route("/set_data")
def set_data():
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

@app.route("/search_by_vector")
def search_by_id():
    return jsonify(successMsg)

if __name__ == '__main__':
    app.run(debug=False, port=12357)