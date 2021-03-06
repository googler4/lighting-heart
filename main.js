var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/tty.usbmodem1421", { baudrate: 115200 });

port = process.env.PORT || 3000;
server.listen(port);
//server.listen(3000);
app.use(express.static('public'));		

var brightness = 0;

io.sockets.on('connection', function (socket) {
	socket.on('led', function (data) {
		brightness = data.value;
		
		var buf = new Buffer(1);
		buf.writeUInt8(brightness, 0);
		serialPort.write(buf);
		
		io.sockets.emit('led', {value: brightness});	
	});
	
	socket.emit('led', {value: brightness});
});

console.log("running");


