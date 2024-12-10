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
  joinBtn.innerHTML = `<div class='loader'></div> 匹配中`;
  //joinBtn.disabled = true; // 禁用按鈕
  joinBtn.removeEventListener("click", joinGame);
  joinBtn.addEventListener("click", cancelMatch);
  updateButtonStyle(joinBtn, true); // 設為紅色背景

  socket.on("waiting", function () {
    document.getElementById("waiting").innerHTML = "🌐當前匹配人數(1/2)";
    updateButtonStyle(joinBtn, true); // 設為紅色背景
  });

  // 處理其他事件
  socket.on("start", function () {
    document.getElementById("waiting").innerHTML = "✅匹配成功，遊戲開始!";
    joinBtn.innerHTML = "中斷連線";
    joinBtn.disabled = false; // 啟用按鈕
    updateButtonStyle(joinBtn, true); // 設為紅色背景
  });

  socket.on("leave", function () {
    document.getElementById("waiting").innerHTML = "⚠️系統異常已斷線，請重新匹配。";
    joinBtn.innerHTML = "開始匹配";
    joinBtn.disabled = false; // 啟用按鈕
    joinBtn.removeEventListener("click", cancelMatch);
    joinBtn.addEventListener("click", joinGame);
    updateButtonStyle(joinBtn, false); // 設為藍色背景
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
  joinBtn.innerHTML = "開始匹配";
  joinBtn.disabled = false; // 啟用按鈕
  joinBtn.removeEventListener("click", cancelMatch);
  joinBtn.addEventListener("click", joinGame);

  document.getElementById("waiting").innerHTML = "❌已取消匹配";
  updateButtonStyle(joinBtn, false); // 設為藍色背景
}

// 動態添加或移除按鈕類別
function updateButtonStyle(joinBtn, isRed) {
  if (isRed) {
    joinBtn.classList.add("cancel-btn");
    joinBtn.classList.remove("join-btn");
  } else {
    joinBtn.classList.add("join-btn");
    joinBtn.classList.remove("cancel-btn");
  }
}

// 綁定加入遊戲按鈕的點擊事件
document.getElementById("join-btn").addEventListener("click", joinGame);

/* Loader CSS */
const style = document.createElement('style');
style.innerHTML = `

`;
document.head.appendChild(style);
