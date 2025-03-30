from flask import Flask, request, jsonify
from moviemaker import make_videos
app = Flask(__name__)

@app.route('/postendpoint', methods=['POST'])
def handle_post():
    if request.is_json:
        data = request.get_json()
        
        response_data = {
            'message': 'Data received successfully',
            'received_data': data
        }

        make_videos(data)
        
        # Return a JSON response
        return jsonify(response_data), 200
    else:
        return jsonify({'error': 'Invalid input, JSON required'}), 400

if __name__ == '__main__':
    app.run(debug=True)
