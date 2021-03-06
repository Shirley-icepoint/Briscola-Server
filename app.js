var _ = require('lodash');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var cards = _.range(40);
var hasShuffled = false;
var shuffle = function() {
	if (hasShuffled) return;
	for (var i = 39; i >= 0; i--) {
		var randomIndex = Math.floor(Math.random()*(i+1));
		var itemAtIndex = cards[randomIndex];

		cards[randomIndex] = cards[i];
		cards[i] = itemAtIndex;
	}
	cards = _.chunk(cards, 8);
	console.log('cards: ' + cards);
	hasShuffled = true;
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/init', function(req, res) {
	// shuffle the card
	const userId = req.query.userId
	var data = {
		userId,
		cards: cards[userId-1],
	};
	console.log(data);
	res.status(200).json(data);
});

server.listen(3000, function() {
	console.log('listen to 3000');
});

var clientNum = 0; // number of clients in the room
var callStatus = _.fill(Array(5), false);
var max = {userId: -1, maxPoint: -1};
var nextUser = function(data) {
	if (data.point > max.maxPoint) {
		max.maxPoint = data.point;
		max.userId = userId;
	}
	const id = data.userId === 5? 1: data.userId +1;
	for (var i = id; i < 5; i++) {
		if (!callStatus[i]) return i;
	}
	return -1;
}
io.on('connection', function (socket) {
	if (clientNum === 5) {
		socket.disconnect();
	}
  clientNum += 1;
  socket.emit('assignUserId', { userId: clientNum });

	if (clientNum === 5) {
		// yay, we can start the game
		console.log('start');
		shuffle();
		socket.broadcast.emit('start');
		socket.emit('start');
	}

	socket.on('makeCall', function(data) {
		console.log('makdeCall: ' + data.point);
		var userId = nextUser(data);
		if nextUser ( !== -1) socket.broadcast.emit('nextCall', {userId, maxPoint:data.point});
		else {
			socket.broadcast.emit('callPartner', max);
			socket.emit('callPartner', max);
		}
	});
	// socket.on('askForCards', function(data) {
	// 	socket.emit('assignCards', {cards: cards[data.userId-1]});
	// });

  socket.on('disconnect', function () {
  	clientNum -= 1;
  });
});

