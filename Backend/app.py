from flask import Flask, request, jsonify, make_response
from detect import predict
import os
from flask_cors import CORS

app = Flask(__name__, static_folder = "static")
CORS(app, origins=["*"])
app.config['UPLOAD_FOLDER'] = 'data/'

@app.route('/upload', methods=['POST'])
def upload_images():
    try:
        if 'image1' not in request.files or 'image2' not in request.files:
            return make_response(jsonify({'error': 'Missing images'}), 400)

        image1 = request.files['image1']
        image2 = request.files['image2']
        path1 = os.path.join(app.config['UPLOAD_FOLDER'], image1.filename).replace("\\","/")
        path2 = os.path.join(app.config['UPLOAD_FOLDER'], image2.filename).replace("\\","/")

        #path1 = '/data/'+ image1.filename
        #path2 = '/data/'+ image2.filename

        image1.save(path1)
        image2.save(path2)

        # Assuming predict function returns a tuple (output, msg)
        output, message = predict(path1, path2)
        print(message)

        if message is None:
            # If the requested resource is not found, return a 404 status code
            return make_response(jsonify({'error': 'Document not found'}), 404)

        return make_response(jsonify({'message': message}), 200)

    except Exception as e:
        print(str(e))
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)

