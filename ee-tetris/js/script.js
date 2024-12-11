// 連接到 WebSocket 伺服器
let socket;

// 點擊加入按鈕後進行連線
function joinGame() {

    const usernameInput = document.getElementById("username-input");
    const username = usernameInput.value.trim();

    if (!username) {
        //alert("請先輸入帳號名稱！");
        document.getElementById("waiting").innerHTML = "❌請先輸入帳號名稱！";
        return;
    }


  socket = io('https://curious-positive-journey.glitch.me', {
    transports: ['websocket', 'polling'], // 確保使用 WebSocket 和輪詢作為備份
    withCredentials: false // 不使用憑證
  });


    // 發送帳號名稱給伺服器
    socket.emit("setUsername", username);

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
        updateButtonStyle(joinBtn, true);
    });


socket.on("start", function (data) {
  console.log('socket.on("start" data',data);
  if (data.opponent) {
    document.getElementById("waiting").innerHTML = `✅匹配成功，對手是：${data.opponent}`;
    joinBtn.innerHTML = "中斷連線";
    joinBtn.disabled = false;
    updateButtonStyle(joinBtn, true);

    // 更新本地玩家名稱
    const username = document.getElementById("username-input").value.trim();
    document.querySelector(".local h3").textContent = username;

    // 更新對手名稱
    document.querySelector(".remote h3").textContent = data.opponent;
  } else {
    document.getElementById("waiting").innerHTML = "⚠️匹配成功，但無法獲取對手名稱！";
  }
});


    socket.on("leave", function (leaver) {
        document.getElementById("waiting").innerHTML = `⚠️${leaver} 已斷線，遊戲結束！`;
        resetJoinButton();
    });

  socket.on("lose", function () {
    document.getElementById("waiting").innerHTML = "📍遊戲結束，請重新匹配";
    joinBtn.innerHTML = "開始匹配";
    joinBtn.disabled = false; // 啟用按鈕
    joinBtn.removeEventListener("click", cancelMatch);
    joinBtn.addEventListener("click", joinGame);
    updateButtonStyle(joinBtn, false); // 設為藍色背景
  });
}

function resetJoinButton() {
    const joinBtn = document.getElementById("join-btn");
    joinBtn.innerHTML = "開始匹配";
    joinBtn.disabled = false;
    joinBtn.removeEventListener("click", cancelMatch);
    joinBtn.addEventListener("click", joinGame);
    updateButtonStyle(joinBtn, false);
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

