var can = require('socketcan');
var {exec} = require('child_process');

let seq = 0
let timeout = 100
data =   {
    id: 404,
    message: "1,102,201,131,6,250,66,4", //nothing, nothing, 1=rear heater,32=auto64=def 128 front heater , 32 recirc
    byte: 2,
    value: 13,
    timeStamp: 1571575076839
  }

  data2 =   {
    id: 208,
    message: "192,2,1,1,0,13,43,171", //nothing, nothing, 1=rear heater,32=auto64=def 128 front heater , 32 recirc
    byte: 2,
    value: 13,
    timeStamp: 1571575076839
  }

  data3 =   {
    id: 28,
    message: "126,0,128,255,0,128,0,0", //nothing, nothing, 128 = interior lights on, 0-255 brightness
    byte: 2,
    value: 13,
    timeStamp: 1571575076839
  }

  data4 =    {
    id: "1d8",
    message: "80,0,0,0,201,131,7,0", //nothing, nothing, 1=rear heater,32=auto64=def 128 front heater , 32 recirc
    byte: 2,
    value: 13,
    timeStamp: 1571575076839
  }


  message3 = {
    id:40
    }
    dataB3 = data3.message.split(",")

    message4 = {
        id:472
        }
        dataB4 = data4.message.split(",")

message = {
    id: 1028
}

dataB = data.message.split(",")

message2 = {
    id:520
}
dataB2 = data2.message.split(",")




var channel = can.createRawChannel("can0", true);

// Log any message
channel.addListener("onMessage", function(msg) {
    console.log(msg)
	if(msg.id == 712) {
		if(msg.data[4] == 4) {
			console.log("skip forward")
		} else if (msg.data[4] == 16) {
			console.log("skip backwards")
		}

		if(msg.data[7] == 126) {
            timeout = timeout -50
            console.log("speeding up")
		} else if (msg.data[7] == 128) {
            timeout = timeout + 50
            console.log("slowing down")
		}
	}
} );

// nr = function(byte, bit) {

// }
lights =1
val =2
up = 0
brightness = 254
// Reply any message
//channel.addListener("onMessage", channel.send, channel);
var myFunction = function() {
    //nr = [{3:64}, {3:192}, {3:192,2:1}, {3:224, 2:1}, {3:224, 2:1, 4:32}, {4:32}, {3:32}, {2:1}, {3:128}, {3:64}]
    //nr = [{3:64}, {3:128}, {2:1}, {3:32}, {4:32}, {}, {4:32}, {3:32}, {2:1}, {3:128}, {3:64}, {}, {3:64}]
    nr = [{3:64}, {3:128}, {2:1}, {3:32}, {4:32}, {}, {3:64}, {3:128}, {2:1}, {3:32}, {4:32}]
    //console.log("brightness is  " + brightness)

    
    if (val >-1) {
    if (dataB3[val] < 256) {
        dataB3[val] = parseInt(dataB3[val]) + 1
        //console.log(dataB3[val])
    } else {
        dataB3[val] = 0
        if(val < 7) {
            val = val + 1
    
        }
    }
}


if (up) {
    brightness = brightness + 10
    if(brightness >= 254) {
        brightness = 253
        up = 0
    }
} else {
    brightness = brightness -10
    if(brightness <= 0) {
        brightness = 0
        up = 1
    }
}

dataHex = []
for(i=0; i<dataB.length;i++) {
    dataHex.push(dataB[i])
}
data2Hex = []
for(i=0; i<dataB2.length;i++) {
    data2Hex.push(parseInt(dataB2[i]))
}
dataB3[3] = brightness
// if(lights) {
//     dataB3 = "126,00,06,255,00,80,00,00".split(",")
//     lights = 0
// } else {
//     dataB3 = "126,0,128,255,0,80,0,0".split(",") //128
//     lights = 1
// }
data3Hex = []
for(i=0; i<dataB3.length;i++) {
    data3Hex.push(parseInt(dataB3[i]))
}

data4Hex = []
for(i=0; i<dataB4.length;i++) {
    data4Hex.push(parseInt(dataB4[i]))
}

message.data = new Buffer(dataHex);
message2.data = new Buffer(data2Hex);
message3.data = new Buffer(data3Hex);
exec("sudo sh -c 'echo " + '"' + brightness +'"' +" > /sys/class/backlight/rpi_backlight/brightness'")
//message3.data = new Buffer(data3Hex);
//console.log(message)
//console.log(message3)
//channel.send(message)
channel.send(message2)
channel.send(message3)
setTimeout(myFunction, timeout)
}

setTimeout(myFunction, timeout)



channel.start();