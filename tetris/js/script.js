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

    // 連接後，將按鈕改為取消匹配
    const joinBtn = document.getElementById("join-btn");
    joinBtn.innerHTML = "取消匹配";
    joinBtn.removeEventListener("click", joinGame);
    joinBtn.addEventListener("click", cancelMatch);


  socket.on("waiting", function (str) {
    document.getElementById("waiting").innerHTML = str;
  });

  // 處理其他事件
  socket.on("start", function () {
    document.getElementById("waiting").innerHTML = "遊戲開始!";
    joinBtn.innerHTML = "中斷連線";
  });

  socket.on("leave", function () {
    document.getElementById("waiting").innerHTML = "對手已離開，請重新匹配。";
    joinBtn.innerHTML = "加入遊戲";
    joinBtn.removeEventListener("click", cancelMatch);
    joinBtn.addEventListener("click", joinGame);
  });
}


  // 點擊取消匹配按鈕的行為
  function cancelMatch() {
    if (socket) {
      socket.emit("cancelMatch"); // 向伺服器發送取消匹配的事件
      socket.disconnect(); // 斷開 socket 連接
    }

    // 重置按鈕狀態
    const joinBtn = document.getElementById("join-btn");
    joinBtn.innerHTML = "加入遊戲";
    joinBtn.removeEventListener("click", cancelMatch);
    joinBtn.addEventListener("click", joinGame);

    document.getElementById("waiting").innerHTML = "已取消匹配";
  }



// 綁定加入遊戲按鈕的點擊事件
document.getElementById("join-btn").addEventListener("click", joinGame);
