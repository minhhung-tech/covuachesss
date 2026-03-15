from flask import Flask, send_from_directory
from flask_socketio import SocketIO, join_room, emit

# Cấu hình app với thư mục tĩnh là 'public'
app = Flask(__name__, static_folder='public')
socketio = SocketIO(app)

# Route trang chủ: Trả về file index.html từ thư mục public
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# Route hỗ trợ: Load các file JS, CSS từ thư mục public
@app.route('/<path:path>')
def serve_public(path):
    return send_from_directory(app.static_folder, path)

# Xử lý kết nối phòng qua SocketIO
@socketio.on('join')
def on_join(data):
    room = data.get('room')
    join_room(room)
    print(f"User joined room: {room}")

# Xử lý di chuyển quân cờ
@socketio.on('move')
def on_move(data):
    room = data.get('room')
    # Gửi nước đi cho người còn lại trong cùng phòng
    emit('move', data, to=room, include_self=False)

# Chạy server
if __name__ == '__main__':
    # Lưu ý: Khi deploy lên Render, lệnh này sẽ bị gunicorn đè lên, không gây lỗi nữa
    socketio.run(app, host='0.0.0.0', port=5000)
