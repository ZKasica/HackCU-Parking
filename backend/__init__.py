# https://flask-socketio.readthedocs.io/en/latest/

from flask import Flask, request
from flask_socketio import SocketIO, emit
import time

parkingLots = {}

app = Flask(__name__, instance_relative_config=True)
socketio = SocketIO(app)

def changeCarCount(lot):
    socketio.emit('carCountChanged', {
        'data': {
            'lot': lot,
            'count': parkingLots[lot]
        }
    }, namespace='/cars')

@app.route('/carEntered')
def onCarEntered():
    lot = request.args.get('lot', '')

    if lot not in parkingLots:
        parkingLots[lot] = 0

    parkingLots[lot] += 1
    changeCarCount(lot)

    return 'Car Entered at lot: ' + lot

@app.route('/carExited')
def onCarExited():
    lot = request.args.get('lot', '')

    if lot not in parkingLots or parkingLots[lot] == 0:
        parkingLots[lot] = 0
    else:
        parkingLots[lot] -= 1

    changeCarCount(lot)

    return 'Car Exited from lot: ' + lot

@socketio.on('connect', namespace='/cars')
def onConnect():
    print('Client connected to server')

    emit('carCountChanged', {
        'data': {
            'lot': 'Lot Q',
            'count': 100
        }
    }, namespace='/cars')


print("Starting server, listening on localhost:5000")
socketio.run(app, host='localhost', port=5000)
