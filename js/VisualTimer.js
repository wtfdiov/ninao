/* ==========================================
 * VisualTimer.js
 * https://github.com/terebentina/VisualTimer
 * ==========================================
 * Copyright 2014 Dan Caragea.
 *
 * Licensed under the MIT license
 * http://opensource.org/licenses/MIT
 * ========================================== */

Phaser.Plugin.VisualTimer = function (game, parent) {

	Phaser.Plugin.call(this, game, parent);

	this.type = 'down';
	this.totalTime = 120;
	this.onComplete = function() { console.log("VOCÊ VENCEU MISERAVI"); };
	this.key = 'timer';
	this.x = game.world.centerX;
	this.y = 5;
	this.game.add.sprite(this.x, this.y, this.key, 1);
	this.sprite = this.game.add.sprite(this.x, this.y, this.key, 0);
	this.fullWidth = this.sprite.width;
	this.reset();
};

Phaser.Plugin.VisualTimer.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.VisualTimer.prototype.constructor = Phaser.Plugin.VisualTimer;

Phaser.Plugin.VisualTimer.prototype.reset = function () {
if (this.timer) {
				this.timer.stop();
			}
			var self = this;
			this.hasFinished = false;
			this.timer = this.game.time.create(true);
			this.timer.repeat(Phaser.Timer.SECOND, this.totalTime, timerTick, this);
			this.timer.onComplete.add(function() {
				self.hasFinished = true;
				if (self.onComplete) {
					self.onComplete();
				}
			});
			this.rect = new Phaser.Rectangle(0, 0, 0, this.sprite.height);
			if (this.type == 'down') {
				this.sprite.crop(null);
			} else {
				this.sprite.crop(this.rect);
			}
};

Phaser.Plugin.VisualTimer.prototype.setTime = function () {
	this.totalTime = seconds;
	this.reset();
};

Phaser.Plugin.VisualTimer.prototype.start = function () {
	this.reset();
	this.timer.start();
};

Phaser.Plugin.VisualTimer.prototype.stop = function () {
	this.timer.stop();
};

Phaser.Plugin.VisualTimer.prototype.pause = function () {
	this.timer.pause();
};

Phaser.Plugin.VisualTimer.prototype.resume = function () {
	this.timer.resume();
};

Phaser.Plugin.VisualTimer.prototype.remainingTime = function () {
	return this.totalTime - this.timer.seconds;
};

	function timerTick() {
		/*jshint validthis:true */
		var myTime = (this.type == 'down') ? this.remainingTime() : this.timer.seconds;
		this.rect.width = Math.max(0, (myTime / this.totalTime) * this.fullWidth);
		this.sprite.crop(this.rect);
	};
