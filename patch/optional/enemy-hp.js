// random enemy hp
// hp will be +/-50% of the hp of the enemy it's replacing. The code below aims to
// make sure all enemies of a single type have the same hp on a given screen. For example,
// if the first skeleton on a screen has its hp randomized to 3 hp, all skeletons on the
// same screen will have 3 hp.
module.exports = {
	id: 'enemy-hp',
	name: 'Enemy HP Randomizer',
	description: 'Randomize enemy HP by +/-50%',
	//qol, random, difficulty, misc
	type: 'random',
	patch: function(pm, opts) {
		const { core, utils: { randomInt } } = require('../../lib');
		const { rng } = opts;

		core.forEach(loc => {
			if (!loc.actors) { return; }
			const hpMap = {};
			loc.actors.filter(a => a.enemy && !a.boss).forEach(enemy => {
				if (!hpMap[enemy.id] && enemy.name != "rock" && enemy.name != "fred") {
					const half = Math.floor(enemy.data / 2);
					const range = enemy.data < 2 ? [ 1, 2 ] : [ enemy.data - half, enemy.data + half ];
					hpMap[enemy.id] = randomInt(rng, ...range);
				}
				if (enemy.name == "fred"){
					const half = Math.floor(enemy.data / 2);
					const range = enemy.data < 2 ? [ 1, 2 ] : [ enemy.data - half, enemy.data + half ];
					enemy.data = randomInt(rng, ...range);
					
				}else if (enemy.name === "rock"){
					enemy.data = 1

				}else {
					enemy.data = hpMap[enemy.id];
				}
				// enemy (actor) data is stored as x,y,id,hp so we offset the pointer by 3 bytes
				// since we are only modifying hp
				pm.add([ enemy.data ], enemy.pointer + 3);
			});
		});
	}
};
