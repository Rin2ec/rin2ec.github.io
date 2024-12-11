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




/*練習模式開始*/







// 練習模式按鈕點擊事件
document.getElementById("practice-btn").addEventListener("click", function () {
    startPracticeMode();
});

// 啟動練習模式
function startPracticeMode() {
    document.getElementById("waiting").innerHTML = "🎮 練習模式開始！";

    // 隱藏對手區域
    document.querySelector(".remote").style.display = "none";

    // 初始化本地遊戲
    const doms = {
        gameDiv: document.getElementById("local_game"),
        nextDiv: document.getElementById("local_next"),
        timeDiv: document.getElementById("local_time"),
        scoreDiv: document.getElementById("local_score"),
        resultDiv: document.getElementById("local_gameover"),
    };

    const localGame = new Game(); // 假設 Game 是現有遊戲邏輯類
    const type = generateRandomType();
    const dir = generateRandomDir();
    localGame.init(doms, type, dir);

    const nextType = generateRandomType();
    const nextDir = generateRandomDir();
    localGame.performNext(nextType, nextDir);

    // 綁定鍵盤事件
    bindPracticeKeyEvents(localGame);

    // 開啟遊戲循環（類似 `Local` 的邏輯）
    const interval = 500;
    let timer = setInterval(function () {
        if (!localGame.down()) {
            localGame.fixed();
            let lines = localGame.checkClear();
            if (lines) {
                localGame.addScore(lines);
            }
            if (localGame.checkGameOver()) {
                clearInterval(timer);
                localGame.showGameover(false);
                document.getElementById("waiting").innerHTML = "💀 遊戲結束，請重新開始！";
            } else {
                const nextType = generateRandomType();
                const nextDir = generateRandomDir();
                localGame.performNext(nextType, nextDir);
            }
        }
    }, interval);
}


// 隨機生成方塊類型和方向
function generateRandomType() {
    return Math.floor(Math.random() * 7);
}

function generateRandomDir() {
    return Math.floor(Math.random() * 4);
}

function bindPracticeKeyEvents(game) {
    let isKeyEnabled = true; // 按鍵操作標誌

    document.onkeydown = function (e) {
        if (!isKeyEnabled) {
            // 禁用按鍵期間直接返回
            e.preventDefault();
            return;
        }

        switch (e.keyCode) {
            case 37: // 左箭頭
            case 65: // 'A'
                e.preventDefault();
                game.left();
                break;
            case 38: // 上箭頭
            case 87: // 'W'
                e.preventDefault();
                game.rotate();
                break;
            case 39: // 右箭頭
            case 68: // 'D'
                e.preventDefault();
                game.right();
                break;
            case 40: // 下箭頭
            case 83: // 'S'
                e.preventDefault();
                game.down();
                break;
            case 32: // 空格鍵（快速下降）
                e.preventDefault();
                game.fall();

                // 禁用按鍵 0.5 秒
                isKeyEnabled = false;
                setTimeout(() => {
                    isKeyEnabled = true; // 恢復按鍵功能
                }, 500);
                break;
            case 16: // Shift鍵（保存/交換）
                e.preventDefault();
                game.swapHold();
                break;
        }
    };
}
