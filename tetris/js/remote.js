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
        });
        socket.on("left", function(){
            game.left();
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
      

    };

    bindEvents();
};