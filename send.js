var can = require('socketcan');

let seq = 0
let timeout = 1000
data =   {
    id: 208,
    message: "192,2,0,0,0,13,43,171", //nothing, nothing, 1=rear heater,32=auto64=def 128 front heater , 32 recirc
    byte: 2,
    value: 13,
    timeStamp: 1571575076839
  }

message = {
    id: 520
}

dataB = data.message.split(",")

value = 0
value |= 32
value |= 0
console.log(value)



var channel = can.createRawChannel("can0", true);

// Log any message
channel.addListener("onMessage", function(msg) {
	if(msg.id == 712) {
		if(msg.data[4] == 4) {
			console.log("skip forward")
		} else if (msg.data[4] == 16) {
			console.log("skip backwards")
		}

		if(msg.data[7] == 126) {
            timeout = timeout -100
            console.log("speeding up")
		} else if (msg.data[7] == 128) {
            timeout = timeout + 100
            console.log("slowing down")
		}
	}
} );

// nr = function(byte, bit) {

// }


// Reply any message
//channel.addListener("onMessage", channel.send, channel);
setInterval(() => {
    //nr = [{3:64}, {3:192}, {3:192,2:1}, {3:224, 2:1}, {3:224, 2:1, 4:32}, {4:32}, {3:32}, {2:1}, {3:128}, {3:64}]
    //nr = [{3:64}, {3:128}, {2:1}, {3:32}, {4:32}, {}, {4:32}, {3:32}, {2:1}, {3:128}, {3:64}, {}, {3:64}]
    //nr = [{3:64}, {3:128}, {2:1}, {3:32}, {4:32}, {}, {3:64}, {3:128}, {2:1}, {3:32}, {4:32}]
    nr = [{3:64}, {3:128, 3:64}, {2:1, 3:128}, {3:32, 2:1}, {4:32, 3:32}, {3:64, 4:32}, {3:128, 3:64}, {2:1, 3:128}, {3:32, 2:1}, {4:32}]
    console.log("speed is " + timeout)
    console.log("seq is ", seq)
    for(var key in nr[seq]) {
        if(seq <= 10) {
        dataB[key] ^= nr[seq][key]
        if(nr[seq][key] === 0) {
            dataB[key] = 0
        }
    } else {

    }

    }

    val =-1
    if (val >-1) {
    if (dataB[val] < 255) {
        dataB[val] = parseInt(dataB[val]) + 1
    }
}
    seq = seq + 1
    if (seq > 10) {
        seq = 0
    }
}, timeout)

setInterval(() => {
    dataHex = []
    for(i=0; i<dataB.length;i++) {
        dataHex.push(parseInt(dataB[i]))
    }
    message.data = new Buffer(dataHex);
    channel.send(message)
}, 50)

channel.start();