var can = require('socketcan');
var readline = require('readline');
var fs = require('fs');
var _ = require('underscore')
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


var channel = can.createRawChannel('\can0', true);
let sampleData = {}
let count = 0
let displayMessage = 0
let potentialIds = []
let tempPotential = {}
process.stdout.write("current new messages: " + count)
channel.addListener('onMessage', function(msg) {
    id = msg.id.toString(16)
    data = Uint8Array.from(msg.data)
    //console.log(msg.data)
    if(!(id in sampleData)) {
        sampleData[id] = {}
        for(i=0; i<data.length; i++) {
            sampleData[id][i] = []
            sampleData[id][i].push(data[i])
        }
            
           //sampleData[id].push(data) 
    } else {
        dataC = data.toString()
        let found = 0
        for(i=0;i<data.length; i++) {
            if(!(sampleData[id][i].includes(data[i]))) {

                if(displayMessage) {
                    let dateNow = new Date().getTime()
                    let exists = 0
                    result = {
                        id: id,
                        message: data.toString(),
                        byte: i,
                        value: data[i],
                        timeStamp: dateNow
                    }
                    if(potentialIds.length === 0){
                        potentialIds.push(result)
                        exists = 1
                    } else {
                        potentialIds.forEach((res) => {
                            if(res.id === result.id) {
                                if(res.message === result.message) {
                                    exists = 1
                                }
                            }
                        })
                    }

                    if(exists === 0) {
                        potentialIds.push(result)
                        console.log("new message found on id: " + id + " message " + data.toString() + " byte number : " + i + " value: " + data[i] + " " + dateNow)
                    }
                    
                } else {
                    sampleData[id][i].push(data[i])
                    count = count + 1
                }
            }
        }
        //sampleData[id].forEach(function(msgD) {
        //    msgC = msgD.toString()
        //    if(msgC === dataC) {
        //        found = 1
        //        return
        //    }
        //})

        //if(found === 0) {
        //    sampleData[id].push(data)
        //}
    }
});

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}

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
        clearInterval(countId);
        displayMessage = 1
    
    }
})


//let timerId = setInterval(() => console.log(sampleData), 10000)
let countId = setInterval(() => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0)
    process.stdout.write("current new messages: " + count + " press enter to being listening for require message")
    count = 0
}, 1000)
channel.start()
