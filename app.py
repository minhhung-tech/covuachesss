from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, join_room, emit

app = Flask(__name__, static_folder='public')
socketio = SocketIO(app)

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@socketio.on('join')
def on_join(data):
    join_room(data['room'])

@socketio.on('move')
def on_move(data):
    emit('move', data, to=data['room'], include_self=False)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
