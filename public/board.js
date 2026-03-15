var board = Chessboard('board', { draggable: true, dropOffBoard: 'snap', onDrop: onDrop });
var game = new Chess();
var socket = io();

function joinRoom() {
    var room = document.getElementById('roomInput').value;
    socket.emit('join', {room: room});
}

function onDrop(source, target) {
    var move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';
    socket.emit('move', {room: document.getElementById('roomInput').value, move: move});
    makeBotMove();
}

function makeBotMove() {
    var level = document.getElementById('level').value;
    var possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;
    
    // Logic Level 1: Ngẫu nhiên
    var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    game.move(randomMove);
    board.position(game.fen());
}

socket.on('move', function(data) {
    game.move(data.move);
    board.position(game.fen());
});
