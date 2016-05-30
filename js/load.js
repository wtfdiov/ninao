var loadState = { 
	preload: function() {

    game.stage.backgroundColor = "#4488AA";
	var loadMsg = game.add.text(80,150, 'Carregando recursos...', {font: '30px Courier', fill: '#ffffff'});

    game.stage.disableVisibilityChange = true;

	game.load.tilemap("ninomap", "rec/mapas/1/ninomap.json", null, Phaser.Tilemap.TILED_JSON);
    game.load.image("tilesheet", "rec/mapas/1/tilesheet.png");

	game.load.spritesheet('Snino', 'rec/sprites/nino/ninos.png', 32, 32);
    game.load.spritesheet('Sbruce', 'rec/sprites/pers/brucewalks.png', 32, 32, 3);
    game.load.spritesheet('poop', 'rec/sprites/nino/puu.png', 15, 15);
    game.load.image('logo', 'rec/sprites/logo.png', 460, 360);
    game.load.image('gameisover', 'rec/sprites/game_over.png', 800, 640);
    game.load.spritesheet('timer', 'rec/sprites/timer.png', 150, 20);
    
    game.load.audio('menuMsc', 'rec/sons/menu.ogg');
    game.load.audio('gameMsc', 'rec/sons/jogo.ogg');
    game.load.audio('perigoMsc', 'rec/sons/perigo.ogg');
    game.load.audio('lateSfx', 'rec/sons/bark.ogg');
    game.load.audio('cacaSfx', 'rec/sons/caca.ogg');
    game.load.audio('pazSfx', 'rec/sons/pazinha.ogg');
},

create: function() { setTimeout(function () { game.state.start('menu'); }, 3000); }

};