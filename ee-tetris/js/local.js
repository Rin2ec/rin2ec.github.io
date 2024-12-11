let Local = function (socket) {
    // 游戏对象
    let game;
    // 时间间隔
    const INTERVAL = 500;
    // 定时器
    let timer = null;
    // 时间计数器
    let timeCount = 0;
    // 时间
    let time = 0;

// 是否允許按鍵操作的標誌
let isKeyEnabled = true;

// 绑定键盘事件
let bindKeyEvent = function () {
    document.onkeydown = function (e) {
        if (!isKeyEnabled) {
            // 如果按鍵禁用中，直接返回
            e.preventDefault(); // 可選：防止誤觸時有其他行為
            return;
        }

        switch (e.keyCode) {
            case 37: // left arrow
            case 65: // 'A'
                e.preventDefault();
                game.left();
                socket.emit("left");
                break;
            case 38: // up arrow
            case 87: // 'W'
                e.preventDefault();
                game.rotate();
                socket.emit("rotate");
                break;
            case 39: // right arrow
            case 68: // 'D'
                e.preventDefault();
                game.right();
                socket.emit("right");
                break;
            case 40: // down arrow
            case 83: // 'S'
                e.preventDefault();
                game.down();
                socket.emit("down");
                break;
            case 32: // space (fall)
                e.preventDefault();
                game.fall();
                socket.emit("fall");

                // 禁用按鍵 0.5 秒
                isKeyEnabled = false;
                setTimeout(() => {
                    isKeyEnabled = true; // 恢復按鍵功能
                }, 500);
                break;
            case 16: // Shift key
                e.preventDefault();
                game.swapHold();
                break;
        }
    };
};


        document.getElementById('btn-left').addEventListener('click', function () {
            game.left();
            socket.emit("left");
        });

        document.getElementById('btn-rotate').addEventListener('click', function () {
            game.rotate();
            socket.emit("rotate");
        });

        document.getElementById('btn-right').addEventListener('click', function () {
            game.right();
            socket.emit("right");
        });

        document.getElementById('btn-down').addEventListener('click', function () {
            game.down();
            socket.emit("down");
        });

        document.getElementById('btn-fall').addEventListener('click', function () {
            game.fall();
            socket.emit("fall");
        });
        document.getElementById('btn-swaphold').addEventListener('click', function () {
            game.swapHold(); // 執行儲存與切換邏輯
        });

    // 开始
    let start = function () {
        let doms = {
            gameDiv: document.getElementById("local_game"),
            nextDiv: document.getElementById("local_next"),
            timeDiv: document.getElementById("local_time"),
            scoreDiv: document.getElementById("local_score"),
            resultDiv: document.getElementById("local_gameover")
        }
        game = new Game();
        let type = generateType();
        let dir = generateDir();
        game.init(doms, type, dir);
        socket.emit("init", {
            type: type,
            dir: dir
        })
        bindKeyEvent();
        let next_type = generateType();
        let next_dir = generateDir();
        game.performNext(next_type, next_dir);
        socket.emit("next", {
            type: next_type,
            dir: next_dir
        })
        timer = setInterval(move, INTERVAL);
    }


    // 向下移动
    let move = function () {
        timeFunc();
        if (!game.down()) {
            // 固定方块
            game.fixed();
            socket.emit("fixed");
            // 检查是否可以消除行
            let line = game.checkClear();
            if (line) {
                game.addScore(line);
                socket.emit("line", line);
                if(line >= 1) {
                    let bottomLines = generateBottomLine(line);
                    socket.emit("bottomLines", bottomLines);
                    console.log('let move = function () ...line: ',line);
                    //console.log(bottomLines);
                }
            }
            // 检查游戏是否结束
            let gameOver = game.checkGameOver();
            if (gameOver) {
                // 結束遊戲
                game.showGameover(false);
                socket.emit("lose");
                stop();
            } else {
                // 生成下一个方块
                let next_type = generateType();
                let next_dir = generateDir();
                game.performNext(next_type, next_dir);
                socket.emit("next", {
                    type: next_type,
                    dir: next_dir
                })
            }
        } else {
            socket.emit("down");
        }
    }

    // 结束
    let stop = function () {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        document.onkeydown = null;

        //新增內容
        
       // 中斷連線
        if (socket) {
            socket.disconnect();
            console.log("WebSocket 已斷開");
        }

        
        // 重置匹配按鈕
        const joinBtn = document.getElementById("join-btn");
        joinBtn.innerHTML = "開始匹配";
        document.getElementById("waiting").innerHTML = "📍遊戲結束，請重新匹配";
        joinBtn.disabled = false;
        joinBtn.removeEventListener("click", cancelMatch);
        joinBtn.addEventListener("click", joinGame);
        updateButtonStyle(joinBtn, false); // 設為藍色背景
        

    };
    // 生成一个随机方块种类
    let generateType = function () {
        return Math.ceil(Math.random() * 7) - 1;
    }
    // 生成一个随机方块旋转次数
    let generateDir = function () {
        return Math.ceil(Math.random() * 4) - 1;
    }

    // 随机生成干扰行
    let generateBottomLine = function (lineNum) {
        console.log('generateBottomLine lineNum: ',lineNum);
        let lines = [];
        for (let i = 0; i < lineNum; i++) {
            let line = [];
            for (let j = 0; j < 10; j++) {
                //line.push(Math.ceil(Math.random() * 2) - 1)
                line.push(1); // 將每一格都設定為1，生成一整行的方塊
            }
            lines.push(line);
        }
        return lines;

    }



    // 计时函数
    let timeFunc = function () {
        timeCount++;
        if (timeCount == 5) {
            timeCount = 0;
            time++;
            game.setTime(time);
            socket.emit("time", time);
        }
    };

    socket.on("start", function(){
        document.getElementById("waiting").innerHTML = "";
        document.getElementById("local_gameover").innerHTML = "";
        document.getElementById("remote_gameover").innerHTML = "";
        start();
    });

    socket.on("lose", function(){
        game.showGameover(false);
        stop();
    });

    socket.on("leave", function () { 
        //document.getElementById("local_gameover").innerHTML = "⛓️‍💥已斷線";
        game.showGameover(true);
        //document.getElementById("remote_gameover").innerHTML = "⛓️‍💥已斷線";
        stop();
     });

     socket.on("bottomLines", function (data) {
        game.addTailLines(data);
        socket.emit("addTailLines", data);
     });


}