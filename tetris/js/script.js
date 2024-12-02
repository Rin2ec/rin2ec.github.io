/*
// 連接到 WebSocket 伺服器
const socket = io('https://curious-positive-journey.glitch.me', {
  transports: ['websocket', 'polling'], // 確保使用 WebSocket 和輪詢作為備份
  withCredentials: false // 不使用憑證
});

let local = new Local(socket);
let remote = new Remote(socket);

socket.on("waiting", function(str){
    document.getElementById("waiting").innerHTML = str;
});
 
 */

// 連接到 WebSocket 伺服器
let socket;

// 點擊加入按鈕後進行連線
function joinGame() {
  socket = io('https://curious-positive-journey.glitch.me', {
    transports: ['websocket', 'polling'], // 確保使用 WebSocket 和輪詢作為備份
    withCredentials: false // 不使用憑證
  });

  let local = new Local(socket);
  let remote = new Remote(socket);

  socket.on("waiting", function (str) {
    document.getElementById("waiting").innerHTML = str;
  });

  // 處理其他事件
  socket.on("start", function () {
    document.getElementById("waiting").innerHTML = "遊戲開始!";
  });

  socket.on("leave", function () {
    document.getElementById("waiting").innerHTML = "對手已離開，等待新的玩家...";
  });
}

// 綁定加入遊戲按鈕的點擊事件
document.getElementById("join-btn").addEventListener("click", joinGame);
