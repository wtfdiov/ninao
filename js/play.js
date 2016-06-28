//I.A. Nino
var pathfinder;
var ninoparado = true;
var ninovel = 150;

//MAPAS
var map;

//PERSONAGENS
var bruce;
var poop;

//SONS
var gameSnd;
var perigoSnd;
var lateSnd;
var pazSnd;
var cacaSnd;

//MOVIMENTO DO BRUCE
var bruce_tween;
var allowed_move =true;

//MARCAÇÕES
var thegameover = false;
var pontos = 0;
var pontosT;
var lives;
var stateImg;
var intcaca;
var force_nino = false;

var playState = {

create: function() {

        //SONS
        gameSnd = this.game.add.audio('gameMsc');//Música principal
        gameSnd.loop = true;
        gameSnd.play();

        perigoSnd = this.game.add.audio('perigoMsc');//Som do latido

        lateSnd = this.game.add.audio('lateSfx');//Som do latido
        pazSnd = this.game.add.audio('pazSfx');//Som da pá
        cacaSnd = this.game.add.audio('cacaSfx');//Som da caca

    //MAPA - I.A NINO
    pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin); //Adicionando o plugin que faz o Nino andar
    bound_func = this.callback_function.bind(this);

    pathfinder.setCallbackFunction(bound_func);

    map = this.game.add.tilemap('ninomap'); //Criando a referência do mapa
	map.addTilesetImage('tilesheet', 'tilesheet'); //Criando a referência do tileset pro mapa
	var ground = map.createLayer('background'); //Criando a camada da grama (nome deve ser igual está no Tiled)
    ground.resizeWorld(); //Redefinindo o tamanho do 'mundo' para o tamanho da camada básica
    map.setCollision(1624);

    var walkables = [351]; //Informando os tiles que o nino pode andar (consta no array 'Data' no arquivo ninomap.json)
    pathfinder.setGrid(map.layers[0].data, walkables, 100); //Definindo a grade dos tiles
    pathfinder.disableDiagonals;

    //BRUCE
    bruce = this.game.add.sprite(320, 300, 'Sbruce'); //Adicionando a sprite do Bruce
    cursors = this.game.input.keyboard.createCursorKeys(); //Referência dos controles do Bruce
    
    
    //NINO
    nino = this.game.add.sprite(64, 64, 'Snino'); //Adicionando a sprite do Nino
    nino.animations.add('dir', [12, 13, 14, 15], 4, true);
    nino.animations.add('esq', [4, 5, 6, 7], 4, true);
    nino.animations.add('cima', [8, 9, 10, 11], 4, true);
    nino.animations.add('baixo', [0, 1, 2, 3], 4, true);
    nino.frame = 12;

    game.physics.enable(bruce); //Incluindo Bruce à física
    game.physics.enable(nino); //Incluindo Nino à física
    bruce.body.collideWorldBounds = true; //Definindo que Bruce não ultrapasse os limites da tela
    nino.body.collideWorldBounds = true; //Definindo que Nino não ultrapasse os limites da tela

    //POOP
    poops = this.game.add.group();
    poops.enableBody = true;

    intcaca = setInterval(function () { cacaSnd.play(); var poop = poops.create(nino.x, nino.y, 'poop'); }, 5000); //Intervalo de 5 seg para cagar

    //MARCAÇÕES
    pontosT = this.game.add.text(this.game.world.width-110, 10, 'Pontos: 0', { fontSize: '14px', fill: '#fff' }); //Pontuação
    
    lives =  this.game.add.group(); //VIDAS = 3 sprites do Bruce em sequência
    for (var i = 0; i < 3; i++) {
        var bruceL = lives.create(this.game.world.width-200 + (30 * i), 16, 'Sbruce');
        bruceL.anchor.setTo(0.5, 0.5); }

    var visualtimer = game.plugins.add(Phaser.Plugin.VisualTimer);
        visualtimer.start();

    goImg = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'gameisover');
    goImg.anchor.setTo(0.5, 0.5);
    goImg.visible = false;

    //PARÂMETROS NINO I.A.
    this.path = [];
    this.i = 0;
    force_nino=true;
    this.obj_x = -100;
    this.obj_y = -100;
},

callback_function: function(path) { this.i = 1; this.path = path; },

nino_step_function: function() {
    nino_tween = game.add.tween(nino);
    new_x = this.path[this.i].x * 32;
    new_y = this.path[this.i].y * 32;
    if (Phaser.Math.distance(nino.body.x, nino.body.y, bruce.body.x, bruce.body.y) < 200){ var vel = 280; } else { vel = 350; }
    nino_tween.to({x: new_x, y: new_y}, vel).onComplete.add((function() { this.nino_moving = false; }).bind(this));
    if (this.path[this.i].x > Math.floor(nino.body.x / 32)) { nino.animations.play('dir'); }
                    else if ( this.path[this.i].x < Math.floor(nino.body.x / 32)) { nino.animations.play('esq'); }
                    else if ( this.path[this.i].y > Math.floor(nino.body.y / 32)) { nino.animations.play('baixo'); }
                    else if ( this.path[this.i].y < Math.floor(nino.body.y / 32)) { nino.animations.play('cima'); }
    this.i++;
    this.nino_moving = true;
    nino_tween.start();
},

nino_ai: function(){
    if (this.nino_moving) return
    if(this.recalq){ this.recalc_path(); this.recalq = false; }
    if (this.i < this.path.length) { this.nino_step_function() }
},

recalc_path: function(){
    pathfinder.preparePathCalculation([Math.floor(nino.body.x / 32), Math.floor(nino.body.y / 32)], [Math.floor(this.obj_x / 32), Math.floor(this.obj_y / 32)]);
    pathfinder.calculatePath();
},

should_recalc: function(new_x, new_y) {
    if (Phaser.Math.distance(nino.body.x, nino.body.y, bruce.body.x, bruce.body.y) < 200 && (new_x != this.obj_x || new_y != this.obj_y)){
        return true;
    } else if(Phaser.Math.distance(Math.floor(new_x / 32), Math.floor(new_y / 32), Math.floor(this.obj_x / 32), Math.floor(this.obj_y / 32)) >= 3){
        return true;
    } else { return false; }
},

go_get_him_nino: function(new_x, new_y, force) {
    this.recalq = force || this.should_recalc(new_x, new_y);
    if (this.recalq){
        this.obj_x = new_x;
        this.obj_y = new_y;
    }
},

update: function() {

    if (force_nino){
        this.go_get_him_nino(bruce.body.x, bruce.body.y, true);
        force_nino = false;
    }

    if (allowed_move){
        //O movimento do bruce será grid based e utilizará uma tween para dar continuidade ao movimento
        var new_x=0, new_y=0;

        if (cursors.left.isDown) { new_x = -1; } else if (cursors.right.isDown){ new_x = 1; }

        else if (cursors.up.isDown){ new_y = -1; } else if (cursors.down.isDown){ new_y = 1; }

        if (new_x || new_y){
            new_x = bruce.body.position.x + new_x * 32;
            new_y = bruce.body.position.y + new_y * 32;
            new_x = Phaser.Math.snapTo(new_x, 32);
            new_y = Phaser.Math.snapTo(new_y, 32);
            
            tile = map.getTileWorldXY(new_x, new_y, 32, 32);
            if (tile.index !== 1624){
                allowed_move = false;
                bruce_tween = this.game.add.tween(bruce);
                bruce_tween.to({x: new_x, y: new_y}, 300).onComplete.add(this.bruce_tween_finished);
                bruce_tween.start();
                // Se Bruce esta andando entao Bruce esta andando devemos informar ao nino sua nova posição
                this.go_get_him_nino(new_x, new_y);
            }            
        }
    }
    this.nino_ai();
    game.physics.arcade.overlap(bruce, poops, this.collectPoop, null, this); //Controle para saber se Bruce passou por um cocô (recebe as sprites e chama o método)
    game.physics.arcade.overlap(nino, bruce, this.ninoMorde, null, this); //Controle para saber se Nino passou por Bruce (recebe as sprites e chama o método)
},

bruce_tween_finished: function() { allowed_move=true; },

ninoMorde: function() { lateSnd.play(); bruce_tween.stop();

    live = lives.getFirstAlive();

    if (live) { live.kill(); }

    bruce.body.x = 704; bruce.body.y = 54; setTimeout(this.bruce_tween_finished, 3000);

    if (lives.countLiving() < 1)
    {
        thegameover = true;
        perigoSnd.play();
        bruce.kill();
        goImg.visible = true;
        clearInterval(intcaca);

        press.onDown.addOnce(this.restart,this);
    }
     console.log("NINO - Mordeu!");
},

collectPoop: function(bruce, poop) { pazSnd.play();
    poop.kill(); //Destruir o cocô
    pontos += 10;
    pontosT.text = 'Pontos: ' + pontos;
},

restart: function() {
    gameSnd.stop();
    perigoSnd.stop();
    pontos = 0;
    game.state.start('menu');
    thegameover = false;
}

};

//TODO:
// - Pontos de respawn pre-definidos
// - Movimento similar ao 'Pacman'
// - Animação da morte
// - Animação bruce
// - Estado de vitória