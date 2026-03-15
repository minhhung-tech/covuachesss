var game = new Chess();
var board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: onDrop
});
var socket = io();

function joinRoom() {
    var room = document.getElementById('roomInput').value;
    socket.emit('join', {room: room});
    alert("Đã vào phòng: " + room);
}

function onDrop(source, target) {
    // 1. Kiểm tra xem nước đi có hợp lệ trong luật cờ không
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    // 2. Gửi nước đi cho đối thủ qua Socket
    var room = document.getElementById('roomInput').value;
    socket.emit('move', {room: room, move: move});
    
    // 3. Cập nhật bàn cờ
    board.position(game.fen());
}

// Lắng nghe nước đi từ người chơi khác
socket.on('move', function(data) {
    game.move(data.move);
    board.position(game.fen());
});

// Bot chỉ nên chơi nếu ông muốn chế độ chơi với máy
function makeBotMove() {
    var possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;
    var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    game.move(randomMove);
    board.position(game.fen());
}
