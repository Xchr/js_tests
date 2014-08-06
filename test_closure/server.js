var express = require('express'), path = require('path'), http = require('http');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 4567);
	app.engine('html', require('ejs').renderFile);
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, '/')));
});

var server = http.createServer(app).listen(app.get('port'), function() {
	console.log("Server is listening on port 4567...");
});


var websocketserver = require('websocket').server;
var wsserver = new websocketserver({
	httpServer : server,
	autoAcceptConnection : false
});



wsserver.on('request', function(request) {
	console.log((new Date()) + 'Connection from origin '
			+ request.remoteAddress + '.');

	var connection = request.accept(null, request.remoteAddress);
	console.log((new Date()) + "Connection accpeted for "
			+ request.remoteAddress + ".");
	connection.on('message',function(message){
		console.log(message);
		var obj = JSON.parse(message.utf8Data);
		var func = eval('('+obj.func+')');
		var result = func(obj.arg1);
		console.log(result);
		//var result = eval(obj.exe1);
		//console.log(result);
		connection.send(JSON.stringify(result.toString()));
		});
});

	


