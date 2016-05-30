var game = new Phaser.Game(800, 640, Phaser.AUTO, 'gameDiv');
var easystar = new EasyStar.js();

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);



game.state.start('boot');
