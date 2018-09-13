const WebSocket = require('ws');

const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({
    port: 8080
});

let peoplearr = [];
let people = 0;
let playPeopleAll;
let parperPeople = 1;
// data = {
//     type: '' 1表示链接；
// }
// 随机数
let changeFlag = true;
let changeNub;

function reqdatafuc(type,people,mesdata='',peopleAllNub='',parperPeople='') {
    let data = {type: type,peoplenub: people,data:mesdata,peopleAllNub:peopleAllNub,parperPeople:parperPeople};
    let dataStr = JSON.stringify(data);
    return dataStr;
}

wss.on('connection', function (ws,req) {
    people++;
    //在线人数
    ws.send(reqdatafuc(1,people,'',playPeopleAll,parperPeople), (err) => {
        if (err) {
            console.log(`[SERVER] error: ${err}`);
        }
    });

    setInterval(function () {

        ws.send(reqdatafuc(1,people,'',playPeopleAll,parperPeople), (err) => {
            if (err) {
                // error 错误
                // console.log(`[SERVER] error: ${err}`);
            }
        });
    },1000)


    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        let res = JSON.parse(message);

        switch (res.type)
        {
            case 1:
                console.log(res.playNub);
                playPeopleAll = res.playNub;

                ws.send(reqdatafuc(2,people,'',playPeopleAll,parperPeople), (err) => {
                    if (err) {
                        // error 错误
                        // console.log(`[SERVER] error: ${err}`);
                    }
                });

                break;
            case 2:
                console.log(res.playNub);
                res.parperPeople?++parperPeople:--parperPeople;

                ws.send(reqdatafuc(2,people,'',playPeopleAll,parperPeople), (err) => {
                    if (err) {
                        // error 错误
                        // console.log(`[SERVER] error: ${err}`);
                    }
                });

                break;
            case 3:
                if(changeFlag){
                    if(res.flag == 'start'){
                        changeNub = Math.ceil(Math.random()*1000);
                        changeFlag = false;
                    }
                }
                console.log('=========================')
                console.log(changeNub);
                break;
            case 4:
                console.log(res);

                if(res.message == changeNub){
                    let data = {type: 3,message: 'success'};
                    let dataStr = JSON.stringify(data);
                    ws.send(dataStr, (err) => {
                        if (err) {
                            // error 错误
                            // console.log(`[SERVER] error: ${err}`);
                        }
                    });

                }else{
                    if(res.message>changeNub){
                        let data = {type: 3,message: 'bigger'};
                        let dataStr = JSON.stringify(data);
                        ws.send(dataStr, (err) => {
                            if (err) {
                                // error 错误
                                // console.log(`[SERVER] error: ${err}`);
                            }
                        });
                    }else{
                        let data = {type: 3,message: 'smailer'};
                        let dataStr = JSON.stringify(data);
                        ws.send(dataStr, (err) => {
                            if (err) {
                                // error 错误
                                // console.log(`[SERVER] error: ${err}`);
                            }
                        });
                    }
                }
                break;
            case 5:
                console.log(res);

                if(peoplearr.length == 0){
                    peoplearr.push(res.name);
                }else{
                    if(peoplearr.indexOf(res.name) == -1){
                        peoplearr.push(res.name);
                    }
                }
                let data = {type: 4,people: peoplearr};
                let dataStr = JSON.stringify(data);

                ws.send(dataStr, (err) => {
                    if (err) {
                        // error 错误
                        // console.log(`[SERVER] error: ${err}`);
                    }
                });

                break;
            default:
                console.log('nothing');
                break;
        }
    });

    ws.on('close', function(close) {
        try{
            --people;

            if(people <= 0){
                people = 0;
                playPeopleAll = 0;
                parperPeople = 1;

                changeFlag = true;
                changeNub = 0;
                peoplearr.splice(0,peoplearr.length)
            }

        }catch(e){
            console.log('刷新页面了');
        }
    });
});


console.log('ws server started at port 3000...');