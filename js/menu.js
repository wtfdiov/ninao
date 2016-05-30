var menuSnd;

var menuState = { 
	create: function() {
		menuSnd = game.add.audio('menuMsc');
		menuSnd.loop = true;
    	menuSnd.play();


	
	game.stage.backgroundColor = "#4488AA";
	var logo = game.add.sprite(game.world.centerX, -200, 'logo');
	logo.anchor.setTo(0.5);

	game.add.tween(logo).to( { y: game.world.centerY }, 4000, Phaser.Easing.Bounce.Out, true);


	var pressMsg = game.add.text(80,game.world.height-80,'Pressione BARRA DE ESPAÇO para começar.', {font: '25px Courier', fill: '#ffffff'});

	press = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    press.onDown.addOnce(this.start, this);},

    start: function() {
    	menuSnd.stop();
    	game.state.start('play');
    },

};