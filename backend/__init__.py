from flask import Flask
from flask_socketio import SocketIO, emit

# # create and configure the app
# def create_app(test_config=None):
    

#     return app

app = Flask(__name__, instance_relative_config=True)
socketio = SocketIO(app)

# a simple page that says hello
@app.route('/hello')
def hello():
    return 'Hello, World!'

@socketio.on('message', namespace='/test')
def test_message(message):
    print('received message: ' + str(message))

print("Starting server, listening on localhost:5000")
socketio.run(app, host='localhost', port=5000)