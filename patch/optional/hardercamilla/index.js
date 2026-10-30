const path = require('path');
const { bank, utils: { modSubroutine } } = require('../../../lib');

module.exports = {
	pre: false,
	id: 'hardercamilla',
	name: 'Harder Camilla',
	description: 'A harder fight for Camilla',
	//qol, random, difficulty, misc
	type: 'difficulty',
	character: 'C',
	patch: function (pm) {
		// bank1: drop hits floor. spawn projectiles.
		// change projectile type to flame bowling ball
		pm.add([0x32], 0x5E14);
		// remove middle projectile
		pm.add([3], 0x5E0F);
		pm.add([0x38,0x3F], 0x5E28);


		// bank1: hook projectile speed lookup
		modSubroutine(pm.name, path.join(__dirname, 'camillaspeedbump.asm'), bank[1], {
			invoke: {
				romLoc: 0x4E73
			},
		});


		// set new bowlingball pixels in camilla's sheet. blood splat?
		pm.add(
			[0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x26,
				0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x66,
				0x6B,0x0F,0x76,0x98,0xBA,0xF8,0x74,0x00,
				0x6F,0x0F,0x76,0xF8,0xFA,0xF8,0x74,0x00],
			0x2ADD0);

	}
};
