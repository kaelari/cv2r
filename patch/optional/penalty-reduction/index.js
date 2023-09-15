const path = require('path');
const { bank, utils: { modSubroutine } } = require('../../../lib');

module.exports = {
	pre: true,
	id: 'penalty-reduction',
	name: 'Penalty Reduction',
	description: 'Keep half your hearts after game over',
	//qol, random, difficulty, misc
	type: 'difficulty',
	patch: function (pm) {
		const result = modSubroutine(pm.name, path.join(__dirname, 'pr.asm'), bank[3]);
		const result2 = modSubroutine(pm.name, path.join(__dirname, 'pr2.asm'), bank[3]);
		modSubroutine(pm.name, path.join(__dirname, 'pr-bank-switch.asm'), bank[7], {
			invoke: {
				romLoc: 0x01C42B,
				padding: 5
			},
			values: {
				pr: result.ram.toString(16),
				pr2: result2.ram.toString(16)
			}
		});
	}
};
