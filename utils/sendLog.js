var can = require('socketcan');
var readline = require('readline');
var fs = require('fs');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

var recvId = 712
var recvByte = 5
var recvMask = 1
var sendId = 520
var sendMsg = {}
sendMsg.data = [0,0,0,0,0,0,0,0]
sendMsg.id = sendId
var lastMsg = []
var index = 0
var contents = fs.readFileSync('candumpStartup.log', 'utf-8')
var lines = contents.split('\n')


var channel = can.createRawChannel("can0", true);


// channel.addListener("onMessage", function(msg) {
// 	if(msg.id == recvId) {
//         var d = [...msg.data]
//         if(d[0] != 200) {
//             console.log(lastMsg)
//             console.log([...msg.data])
//             var date = new Date();
// console.log(date.toISOString());

//         }
// 		if(msg.data[recvByte] & recvMask) {
//             sendMsg.data = [192,2,8,32,129,8,41,168]            
// 		} else{
// 			sendMsg.data = [192,2,8,32,129,8,40,168]
// 		}

// 		lastMsg = [...msg.data]
// 	}
// } );

// setInterval(() => {
//     var out = {}
//     out.id = sendId
//     out.data = new Buffer(sendMsg.data)
//     cluster = {}
//     cluster.id = 136
//     cluster.data = new Buffer([223, 9, 4, 27, 80, 0, 255, 255])
//     channel.send(out)
// }, 100)

// function arraysEqual(a, b) {
//     if (a === b) return true;
//     if (a == null || b == null) return false;
//     if (a.length != b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
//     for (var i = 0; i < a.length; ++i) {
//       if (a[i] !== b[i]) return false;
//     }
//     return true;
//   }
  
//   function timeConverter(UNIX_timestamp){
//     var a = new Date(UNIX_timestamp * 1000);
//     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//     var year = a.getFullYear();
//     var month = months[a.getMonth()];
//     var date = a.getDate();
//     var hour = a.getHours();
//     var min = a.getMinutes();
//     var sec = a.getSeconds();
//     var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
//     return time;
//   }

  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        let fileTime = hours.toString() + "_" + minutes.toString()
        fs.writeFileSync("potentialIds_" + fileTime + ".json", JSON.stringify(potentialIds, null, 2))

        var newObj = removeDuplicates(potentialIds, 'message')
        fs.writeFileSync("uniquePotentialIds_" + fileTime + ".json", JSON.stringify(newObj, null, 2))
        process.exit();
    } else if(key.name === 'return') {
        console.log(lines[index])
        for(i=0; i<100; i++) {
        var text = lines[index].split(' ')[2]
        var id = text.split("#")[0]
        var data = hexStringToByte(text.split("#")[1])
        
        var message = {}
        message.id = parseInt(id, 16)
        message.data = data
        channel.send(message)
        
        }
        index = index + 1
    }
})

function hexStringToByte(str) {
    if (!str) {
      return new Uint8Array();
    }
    
    var a = [];
    for (var i = 0, len = str.length; i < len; i+=2) {
      a.push(parseInt(str.substr(i,2),16));
    }
    
    return new Uint8Array(a);
  }
var start = 0
var length = 50

setInterval(() => {
    var tlength = start + length
    for(i=start;i<=tlength;i++){
    var text = lines[i]
    // var text = '088#DF0C00000000FFFF'
    var id = text.split("#")[0]
    var data = hexStringToByte(text.split("#")[1])
    
    var message = {}
    message.id = parseInt(id, 16)
    message.data = data
    channel.send(message)
    console.log('sent')
    }
    start = length
}, 1000)
channel.start();