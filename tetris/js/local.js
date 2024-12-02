let Local = function (socket) {
    // 游戏对象
    let game;
    // 时间间隔
    const INTERVAL = 200;
    // 定时器
    let timer = null;
    // 时间计数器
    let timeCount = 0;
    // 时间
    let time = 0;

    // 绑定键盘事件
    let bindKeyEvent = function () {
        document.onkeydown = function (e) {
            if (e.keyCode == 37) {
                // left
                game.left();
                socket.emit("left");
            } else if (e.keyCode == 38) {
                // up
                game.rotate();
                socket.emit("rotate");
            } else if (e.keyCode == 39) {
                // right
                game.right();
                socket.emit("right");
            } else if (e.keyCode == 40) {
                // down
                game.down();
                socket.emit("down");
            } else if (e.keyCode == 32) {
                // space
                game.fall();
                socket.emit("fall");
            }
        }
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
                if(line > 1) {
                    let bottomLines = generateBottomLine(line);
                    socket.emit("bottomLines", bottomLines);
                }
            }
            // 检查游戏是否结束
            let gameOver = game.checkGameOver();
            if (gameOver) {
                // 结束游戏
                game.showGameover(false);
                document.getElementById("remote_gameover").innerHTML = "win!";
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
        let lines = [];
        for (let i = 0; i < lineNum; i++) {
            let line = [];
            for (let j = 0; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2) - 1)
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
        start();
    });

    socket.on("lose", function(){
        game.showGameover(true);
        stop();
    });

    socket.on("leave", function () { 
        document.getElementById("local_gameover").innerHTML = "對方已斷線";
        document.getElementById("remote_gameover").innerHTML = "已斷線";
        stop();
     });

     socket.on("bottomLines", function (data) {
        game.addTailLines(data);
        socket.emit("addTailLines", data);
     });
}