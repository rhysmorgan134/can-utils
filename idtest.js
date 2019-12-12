var can = require('socketcan');
var channel = can.createRawChannel('\can0', true);
array = [0,0,0,0,0,0,0,0]
message = {
}

message.data = new Buffer(array)
message.id = 520

channel.addListener('onMessage', function(msg) {
    if(msg.id !== 712) {
    console.log(msg.data);
    console.log(msg.id)
    }
})

message.id = 0

setInterval(() => {
    message.id = message.id + 1
    if (message.id > 4095) {
        process.exit()
    }
    channel.send(message)
    if (message.id < 10) {
        console.log(message)
    }
}, 100)


channel.start()