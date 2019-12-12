var can = require('socketcan');


var recvId = 712
var recvByte = 5
var recvMask = 1
var sendId = 520
var sendMsg = {}
sendMsg.data = [0,0,0,0,0,0,0,0]
sendMsg.id = sendId
var lastMsg = []

var channel = can.createRawChannel("can0", true);


channel.addListener("onMessage", function(msg) {
	if(msg.id == recvId) {
        var d = [...msg.data]
        if(d[0] != 200) {
            console.log(lastMsg)
            console.log([...msg.data])
            var date = new Date();
console.log(date.toISOString());

        }
		if(msg.data[recvByte] & recvMask) {
            sendMsg.data = [192,2,8,32,129,8,41,168]            
		} else{
			sendMsg.data = [192,2,8,32,129,8,40,168]
		}

		lastMsg = [...msg.data]
	}
} );

setInterval(() => {
    var out = {}
    out.id = sendId
    out.data = new Buffer(sendMsg.data)
    cluster = {}
    cluster.id = 136
    cluster.data = new Buffer([223, 9, 4, 27, 80, 0, 255, 255])
    channel.send(out)
}, 100)

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  
  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }


channel.start();