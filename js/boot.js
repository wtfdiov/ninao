var bootState = { create: function() {
	game.physics.startSystem(Phaser.Physics.ARCADE); //Iniciando as físicas do Phaser
	game.state.start('load');
}
};