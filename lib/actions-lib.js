var ActionLibrary = new Array();

ActionLibrary[1] = {
	name: 'move',
	target: 'tile',
	multi: false,
	range: 1,
	cost: 100,
	params: {},
	func: function(player, target, params, callback) {
		m = player._meta;
		Message.addMessage(m._username+' used '+this.cost+' energy to move.');
		m._meter += this.cost; // use energy
		player.moveTile(target, params, callback);
	}
};
ActionLibrary[2] = {
	name: 'attack',
	target: 'enemy',
	multi: false,
	range: 1,
	cost: 200,
	params: {
		damage: 99
	},
	func: function(player, target, params, callback) {
		Message.addMessage(player._meta._username+' used 100 energy to attack '+target._meta._username);
		Message.addMessage(target._meta._username+' has taken '+this.params.damage+' damage');
		player._meta._meter += this.cost;
		target._meta._hp -= this.params.damage;
		player.attack(target, params, callback);
	}
};
ActionLibrary[3] = {
	name: 'defend',
	target: 'self',
	multi: false,
	range: 0,
	cost: 150,
	func: function(player, target, params, callback) {
		callback();
	}
};


ActionLibrary[1001] = {
	name: 'Fire',
	target: 'enemy',
	multi: false,
	range: 5,
	cost: 200,
	func: function(player, target, params, callback) {

	}
};
ActionLibrary[1002] = {
	name: 'Cure',
	target: 'ally',
	multi: false,
	range: -1,
	cost: 100,
	func: function(player, target, params, callback) {

	}
};
