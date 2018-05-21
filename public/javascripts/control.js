var socket = io.connect('http://Plancher-E.local:8080');
const gamepad = new Gamepad();

gamepad.setCustomMapping('keyboard', {
    'd_pad_up': [38, 90],
    'd_pad_down': [40, 83],
    'd_pad_left': [37, 81],
    'd_pad_right': [39, 68]
});

gamepad.on('connect', e => {
    console.log(`controller ${e.index} connected!`);
});
gamepad.on('disconnect', e => {
    console.log(`controller ${e.index} disconnected!`);
});

gamepad.on('hold', 'stick_axis_left', e => {
    let y = parseInt(e.value[1]*255);
    if (y < 0) {
        y = y/(-1);
        console.log(`shoulder_bottom_right has a value of ${y} out of 255 direction -1!`);
        socket.emit('gaz', {speed: y, direction: -1})
    } else {
        console.log(`shoulder_bottom_right has a value of ${y} out of 255 direction 1!`);
        socket.emit('gaz', {speed: y, direction: 1})
    }
});
gamepad.on('release', 'stick_axis_left', e => {
    console.log(`shoulder_bottom_right has a value of 0!`);
    socket.emit('gaz', {speed: 0, direction: 0});
});

gamepad.on('hold', 'stick_axis_right', e => {
    let x = parseInt(e.value[0]*255);
    if (x < 0) {
        x = x/(-1);
        console.log(`shoulder_bottom_right has a value of ${x} out of 255 direction -1!`);
        socket.emit('direction', {speed: x, direction: -1})
    } else {
        console.log(`shoulder_bottom_right has a value of ${x} out of 255 direction 1!`);
        socket.emit('direction', {speed: x, direction: 1})
    }
});
gamepad.on('release', 'stick_axis_right', e => {
    console.log(`shoulder_bottom_right has a value of 0!`);
    socket.emit('direction', {speed: 0, direction: 0});
});

gamepad.on('press', 'd_pad_up', e => {
    console.log(`d_pad_up has a value of 255!`);
    socket.emit('gaz', {speed: 255, direction: 1});
});
gamepad.on('press', 'd_pad_down', e => {
    console.log(`d_pad_down has a value of 255!`);
    socket.emit('gaz', {speed: 255, direction: -1});
});
gamepad.on('press', 'd_pad_left', e => {
    console.log(`d_pad_left has a value of 255!`);
    socket.emit('direction', {speed: 255, direction: -1});
});
gamepad.on('press', 'd_pad_right', e => {
    console.log(`d_pad_right has a value of 255!`);
    socket.emit('direction', {speed: 255, direction: 1});
});
gamepad.on('release', 'd_pad_up', e => {
    console.log(`d_pad_up has a value of 0!`);
    socket.emit('gaz', {speed: 0, direction: 0});
});
gamepad.on('release', 'd_pad_down', e => {
    console.log(`d_pad_down has a value of 0!`);
    socket.emit('gaz', {speed: 0, direction: 0});
});
gamepad.on('release', 'd_pad_left', e => {
    console.log(`d_pad_left has a value of 0!`);
    socket.emit('direction', {speed: 0, direction: 0});
});
gamepad.on('release', 'd_pad_right', e => {
    console.log(`d_pad_right has a value of 0!`);
    socket.emit('direction', {speed: 0, direction: 0});
});

socket.on('frontProximity', function (frontProximity) {
    console.log(`frontProximity = ${frontProximity}`);
});
socket.on('backProximity', function (backProximity) {
    console.log(`backProximity = ${backProximity}`);
});
