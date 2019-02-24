from flask import Flask
from flask_socketio import SocketIO, emit
import time

# # create and configure the app
# def create_app(test_config=None):
    

#     return app

app = Flask(__name__, instance_relative_config=True)
socketio = SocketIO(app)

# https://flask-socketio.readthedocs.io/en/latest/


@app.route('/hello')
def hello():
    return 'Hello, World!'

# @socketio.on('carEntered', namespace='/cars')
# def test_message(message):
#     print('received message: ' + str(message))

@socketio.on('connect', namespace='/cars')
def onConnect():
    print('Client connected to server')


print("Starting server, listening on localhost:5000")
socketio.run(app, host='localhost', port=5000)
# socketio.run(app, message_queue='redis://')