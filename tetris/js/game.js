let Game = function () {
    // dom元素
    let gameDiv;
    let nextDiv;
    let timeDiv;
    let scoreDiv;
    let resultDiv;
    // 分数
    let score = 0;
    // 游戏矩阵
    let gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    // divs
    let nextDivs = [];
    let gameDivs = [];

    // 当前方块
    let cur;
    // 下一个方块
    let next;

    // 检测点是否合法
    let check = function (pos, x, y) {
        if (pos.x + x < 0) {
            return false;
        } else if (pos.x + x >= gameData.length) {
            return false;
        } else if (pos.y + y < 0) {
            return false;
        } else if (pos.y + y >= gameData[0].length) {
            return false;
        } else if (gameData[pos.x + x][pos.y + y] == 1 || gameData[pos.x + x][pos.y + y] == 3) { // 修改: 考虑干扰行
            return false;
        } else {
            return true;
        }
    };

    // 检测数据是否合法
    let isValid = function (pos, data) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[0].length; j++) {
                if (data[i][j] != 0) {
                    if (!check(pos, i, j)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // 清除数据
    let clearData = function () {
        for (let i = 0; i < cur.data.length; i++) {
            for (let j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0;
                }
            }
        }
    };

    // 设置数据
    let setData = function () {
        for (let i = 0; i < cur.data.length; i++) {
            for (let j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
                }
            }
        }
    };
    // 旋转
    let rotate = function () {
        if (cur.canRotate(isValid)) {
            clearData();
            cur.rotate();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    };

    // 下移
    let down = function () {
        if (cur.canDown(isValid)) {
            clearData();
            cur.down();
            setData();
            refreshDiv(gameData, gameDivs);
            return true;
        } else {
            return false;
        }
    };
    // 左移
    let left = function () {
        if (cur.canLeft(isValid)) {
            clearData();
            cur.left();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    };
    // 右移
    let right = function () {
        if (cur.canRight(isValid)) {
            clearData();
            cur.right();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    };

    // 方块移动到底部固定
    let fixed = function () {
        for (let i = 0; i < cur.data.length; i++) {
            for (let j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    if (gameData[cur.origin.x + i][cur.origin.y + j] == 2) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = 1;
                    }
                }
            }
        }
        refreshDiv(gameData, gameDivs);
    };

    // 初始化div
    let initDiv = function (container, data, divs) {
        for (let i = 0; i < data.length; i++) {
            let div = [];
            for (let j = 0; j < data[0].length; j++) {
                let newNode = document.createElement("div");
                newNode.className = "none";
                newNode.style.top = (i * 20) + "px";
                newNode.style.left = (j * 20) + "px";
                container.appendChild(newNode);
                div.push(newNode);
            }
            divs.push(div);
        }
    };

    // 刷新div
    var refreshDiv = function (data, divs) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[0].length; j++) {
                if (data[i][j] == 0) {
                    divs[i][j].className = "none";
                } else if (data[i][j] == 1) {
                    divs[i][j].className = "done";
                } else if (data[i][j] == 2) {
                    divs[i][j].className = "current";
                } else if (data[i][j] == 3) { // 新增：处理干扰行的样式
                    divs[i][j].className = "interference";
                }
            }
        }
    };

    // 初始化
    let init = function (doms, type, dir) {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        timeDiv = doms.timeDiv;
        scoreDiv = doms.scoreDiv;
        resultDiv = doms.resultDiv;
        next = SquareFactory.prototype.make(type, dir);
        initDiv(gameDiv, gameData, gameDivs);
        initDiv(nextDiv, next.data, nextDivs);
        refreshDiv(next.data, nextDivs);
    }

    // 使用下一个方块
    let performNext = function (type, dir) {
        cur = next;
        setData();
        next = SquareFactory.prototype.make(type, dir);
        refreshDiv(gameData, gameDivs);
        refreshDiv(next.data, nextDivs);
    };

    // 消行
    let checkClear = function () {
        let line = 0; // 记录消除的行数
        for (let i = gameData.length - 1; i >= 0; i--) {
            let clear = true;
            for (let j = 0; j < gameData[0].length; j++) {
                if (gameData[i][j] != 1) { // 修改：忽略干扰行
                    clear = false;
                    break;
                }
            }
            if (clear) {
                line++;
                for (let m = i; m > 0; m--) {
                    for (let n = 0; n < gameData[0].length; n++) {
                        gameData[m][n] = gameData[m - 1][n];
                    }
                }
                for (let n = 0; n < gameData[0].length; n++) {
                    gameData[0][n] = 0;
                }
                i++;
            }
        }
        return line;
    };

    // 检查游戏结束
    let checkGameOver = function () {
        let gameOver = false;
        for (let i = 0; i < gameData[0].length; i++) {
            if (gameData[1][i] == 1) {
                gameOver = true;
            }
        }
        return gameOver;
    };

    // 设置时间
    let setTime = function (time) {
        timeDiv.innerHTML = time;
    };

    // 加分
    let addScore = function (line) {
        let s = 0;
        switch (line) {
            case 1:
                s = 10;
                break;
            case 2:
                s = 30;
                break;
            case 3:
                s = 50;
                break;
            case 4:
                s = 80;
                break;
            case 5:
                s = 120;
                break;
            default:
                break;
        }
        score += s;
        scoreDiv.innerHTML = score;
    }

    // 游戏结束
    let showGameover = function(win){
        if(win) {
            resultDiv.innerHTML = "win！";
        } else {
            resultDiv.innerHTML = "lose……";
        }
    }

    // 增加抗干扰功能： 底部增加行
    let addTailLines = function(lines){
        for(let i = 0; i < gameData.length - lines.length; i++){
            gameData[i] = gameData[i + lines.length];
        }
        for(let i = 0; i < lines.length; i++){
            for (let j = 0; j < lines[i].length; j++) {
                gameData[gameData.length - lines.length + i][j] = 3; // 修改：标记为干扰行
            }
        }
        cur.origin.x = cur.origin.x - lines.length;
        if(cur.origin.x < 0){
            cur.origin.x = 0;
        }
        refreshDiv(gameData, gameDivs);
    };






let hold = null;

// 更新 hold 方塊的渲染邏輯
let refreshHold = function (holdBlock) {
    let holdDiv = document.getElementById('local_hold');
    holdDiv.innerHTML = ''; // 清空
    if (holdBlock) {
        for (let i = 0; i < holdBlock.data.length; i++) {
            for (let j = 0; j < holdBlock.data[0].length; j++) {
                let newNode = document.createElement('div');
                newNode.className = holdBlock.data[i][j] !== 0 ? 'done' : 'none';
                newNode.style.top = `${i * 20}px`;
                newNode.style.left = `${j * 20}px`;
                holdDiv.appendChild(newNode);
            }
        }
    }
};

// 更新 hold 方塊的渲染邏輯
let refreshHold_remote = function (holdBlock) {
    console.log("[refreshHold_remote] holdBlock:", holdBlock);
    let holdDiv = document.getElementById('remote_hold');
    holdDiv.innerHTML = ''; // 清空
    if (holdBlock) {
        for (let i = 0; i < holdBlock.data.length; i++) {
            for (let j = 0; j < holdBlock.data[0].length; j++) {
                let newNode = document.createElement('div');
                newNode.className = holdBlock.data[i][j] !== 0 ? 'done' : 'none';
                newNode.style.top = `${i * 20}px`;
                newNode.style.left = `${j * 20}px`;
                holdDiv.appendChild(newNode);
            }
        }
    }
};

let swapHold = function () {
    // 清空當前方塊數據
    clearData();
    let type = Math.ceil(Math.random() * 7) - 1;
    let dir = Math.ceil(Math.random() * 4) - 1;
    if (!hold) {
        // 如果 hold 為空，將當前方塊儲存，並切換到下一個方塊
        hold = cur;
        cur = next;
        next = SquareFactory.prototype.make(type, dir);
    } else {
        // 如果 hold 不為空，交換 hold 和當前方塊
        [hold, cur] = [cur, hold];
        // 重置當前方塊的位置到初始值
        cur.origin = { x: 0, y: 3};
    }
    // 更新 UI 和資料
    refreshHold(hold);
    setData();
    refreshDiv(gameData, gameDivs);
    
    socket.emit("holdSwap", {
        hold: {
            data: hold.data,
            origin: hold.origin,
            dir: hold.dir,
            rotates: hold.rotates,
            name: hold.name  // 傳遞名稱
        },
        cur: {
            data: cur.data,
            origin: cur.origin,
            dir: cur.dir,
            rotates: cur.rotates,
            name: cur.name  // 傳遞名稱
        },
        next: {
            data: next.data,
            origin: next.origin,
            dir: next.dir,
            rotates: next.rotates,
            name: next.name  // 傳遞名稱
        }
    });
    console.log("[Local from game.js swapHold] Updated hold, cur, and next data sent to remote:", {
    hold: hold,
    cur: cur,
    next: next
});


};


let swapHoldRemote = function (data) {
    console.log("[Remote]接收到 swapHoldRemote:", data);
    // 清空當前方塊數據
    clearData();
    let type = Math.ceil(Math.random() * 7) - 1;
    let dir = Math.ceil(Math.random() * 4) - 1;
    if (!hold) {
        // 如果 hold 為空，將當前方塊儲存，並切換到下一個方塊
        hold = cur;
        cur = next;
        next = SquareFactory.prototype.make(type, dir);
    } else {
        // 如果 hold 不為空，交換 hold 和當前方塊
        [hold, cur] = [cur, hold];
        // 重置當前方塊的位置到初始值
        cur.origin = { x: 0, y: 3};
    }
    // 更新 UI 和資料
    refreshHold(hold);
    setData();
    refreshDiv(gameData, gameDivs);
};



    this.getHoldData = function () {
        return hold ? { type: hold.type, data: hold.data } : null;
    };


    // 导出API
    this.init = init;
    this.down = down;
    this.left = left;
    this.right = right;
    this.rotate = rotate;
    this.fall = function () {
        while (down());
    };
    this.fixed = fixed;
    this.performNext = performNext;
    this.checkClear = checkClear;
    this.checkGameOver = checkGameOver;
    this.setTime = setTime;
    this.addScore = addScore;
    this.showGameover = showGameover;
    this.addTailLines = addTailLines;


    //待修正
    this.refreshHold = refreshHold;
    this.refreshHold_remote = refreshHold_remote;
    this.swapHold = swapHold;
    this.getHoldData = this.getHoldData;
    this.swapHoldRemote = swapHoldRemote;

}
