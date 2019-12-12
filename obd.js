var can = require('socketcan');
var channel = can.createRawChannel("can0", true);

// Log any message
channel.addListener("onMessage", function(msg) {
    console.log(msg)
	if(msg.id == 2016) {
        message = {
            id: 2025,
            data: msg.data
        }
        // channel.send(message)
        // console.log(message)
        
	}
} );

channel.start();