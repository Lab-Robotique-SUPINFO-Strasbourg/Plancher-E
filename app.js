var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var httpServer = require('http').createServer(app);
var five = require('johnny-five');
var io=require('socket.io').listen(httpServer);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

httpServer.listen(8080);

var board = new five.Board();

var rightMotor, leftMotor;
var frontProximity, backProximity;

board.on('ready', function() {
    console.log('Arduino connected');

    rightMotor = new five.Motor({
        pins: {
            pwm: 3,
            dir: 2
        }
    });

    leftMotor = new five.Motor({
        pins: {
            pwm: 4,
            dir: 5
        }
    });

    frontProximity = new five.Proximity({
        controller: 'HCSR04',
        pin: 8
    });

    backProximity = new five.Proximity({
        controller: 'HCSR04',
        pin: 9
    });

    frontProximity.on('data', function() {
        console.log('frontProximity : ', this.cm,' cm');
    });
    backProximity.on('data', function() {
        console.log('backProximity : ', this.cm,' cm');
    });



/*
    board.repl.inject({
        rightMotor: rightMotor,
        leftMotor: leftMotor
    });
*/
});

io.on('connection', function (socket) {
    console.log(socket.id);

    socket.on('gaz', function (data) {
        console.log(`gaz : speed = ${data.speed}, direction = ${data.direction}`);
        if (data.direction > 0) {
            rightMotor.forward(data.speed);
            leftMotor.forward(data.speed);

        } else if (data.direction < 0) {
            rightMotor.reverse(data.speed);
            leftMotor.reverse(data.speed);
        } else {
            rightMotor.stop();
            leftMotor.stop();
        }
    });

    socket.on('direction', function (data) {
        console.log(`direction : speed = ${data.speed}, direction = ${data.direction}`);
        if (data.direction > 0) {
            rightMotor.reverse(data.speed);
            leftMotor.forward(data.speed);

        } else if (data.direction < 0) {
            rightMotor.forward(data.speed);
            leftMotor.reverse(data.speed);
        } else {
            rightMotor.stop();
            leftMotor.stop();
        }
    });

});