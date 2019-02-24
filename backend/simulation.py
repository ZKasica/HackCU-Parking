from flask_socketio import SocketIO

test_count = 100

socketio = SocketIO(message_queue='redis://')
socketio.emit('carCountChanged', {
    'data': {
            'lot': 'Lot Q',
            'count': test_count
    }
}, namespace='/cars')