// import WebSocket from "isomorphic-ws";
const WebSocket = require('isomorphic-ws');

const ws = new WebSocket(`ws://pka7uw7fbrlts3dmvemidkx44zd44fkufohgwdcmphmwvy6ocgxq.remote.moe/ws?clientId=9fc2c86f378b45e190bfef7733b9d431`);
// const ws = new WebSocket(`ws://pka7uw7fbrlts3dmvemidkx44zd44fkufohgwdcmphmwvy6ocgxq.remote.moe/ws`);
// ws.addEventListener("open", open.bind(this));
// function open(event){
// console.log('open',event)
//     ws.addEventListener("message", (event) => {
//       console.log('error',event.data)
//     });
//     ws.addEventListener("error", (event) => {
//         console.log('error',event)

//     });
//     ws.addEventListener("close", (event) => {
//         console.log('close',event)
//     });

// }


// const ws = new WebSocket('wss://echo.websocket.org/');

ws.onopen = function open() {
  console.log('connected');
};

ws.onclose = function close(event) {
  console.log('disconnected',event);
  
};

ws.onmessage = function incoming(data) {
  console.log(`onmessage`,data.data);

  // setTimeout(function timeout() {
  //   ws.send(Date.now());
  // }, 500);
};