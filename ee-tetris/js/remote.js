let Remote = function (socket) {
    // 游戏对象
    let game;
    // 开始
    let start = function (type, dir) {
        let doms = {
            gameDiv: document.getElementById("remote_game"),
            nextDiv: document.getElementById("remote_next"),
            timeDiv: document.getElementById("remote_time"),
            scoreDiv: document.getElementById("remote_score"),
            resultDiv: document.getElementById("remote_gameover")
        };
        game = new Game();
        game.init(doms, type, dir);
    };

    // 绑定按钮事件
    let bindEvents = function () {
        socket.on("init", function (data) {
            start(data.type, data.dir);
        });
        socket.on("next", function (data) {
            game.performNext(data.type, data.dir);
        });
        socket.on("rotate", function(){
            game.rotate();
        });
        socket.on("down", function(){
            game.down();
            //console.log("[Remote] down data received:");
        });
        socket.on("left", function(){
            game.left();
            console.log("[Remote] left data received:");
        });
        socket.on("right", function(){
            game.right();
        });
        socket.on("fixed", function(){
            game.fixed();
        });
        socket.on("fall", function(){
            game.fall();
        });
        socket.on("line", function(line){
            game.checkClear();
            game.addScore(line);
        });
        socket.on("time", function(time){
            game.setTime(time);
        });
        socket.on("lose", function(){
            game.showGameover(false);
        });
        socket.on("addTailLines", function(data){
            game.addTailLines(data);
        });


socket.on('holdSwap', function (data) {
    //console.log("[Remote.js socket.on('holdSwap')] data:", JSON.stringify(data, null, 2));

    function recreateSquare(data) {
        switch (data.name) {
            case 'Square1':
                return new Square1();
            case 'Square2':
                return new Square2();
            case 'Square3':
                return new Square3();
            case 'Square4':
                return new Square4();
            case 'Square5':
                return new Square5();
            case 'Square6':
                return new Square6();
            case 'Square7':
                return new Square7();
            default:
                console.error("Unknown square type:", data.name);
                return null;
        }
    }

    hold = recreateSquare(data.hold);
    if (hold) {
        hold.origin = data.hold.origin;
        hold.dir = data.hold.dir;
        hold.rotates = data.hold.rotates;
    }

    cur = recreateSquare(data.cur);
    if (cur) {
        cur.origin = data.cur.origin;
        cur.dir = data.cur.dir;
        cur.rotates = data.cur.rotates;
    }

    next = recreateSquare(data.next);
    if (next) {
        next.origin = data.next.origin;
        next.dir = data.next.dir;
        next.rotates = data.next.rotates;
    }

    console.log("[Remote.js socket.on('holdSwap')] { hold, cur, next }", { hold, cur, next });
    game.swapHoldRemote({ hold, cur, next });
    hold = data.hold;
    game.refreshHold_remote(hold);
});






    };

    bindEvents();
};