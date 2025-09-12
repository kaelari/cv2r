const path = require('path');
const { bank, utils: { modSubroutine } } = require('../../../lib');

//TODO: to make this more robust for use with other patches,
//      it may need to be reworked to switch banks. (not much space in bank 7)

module.exports = {
	pre: true,
	id: 'scaled-xp',
	name: 'Scaled Experience',
	version: '1.2',
	description: 'XP gains depend on your level relative to the current zone (and nerf riverbank zone level)',
	//qol, random, difficulty, misc
	type: 'difficulty',
    character: '',
    flaglabel: 'sxp',
	patch: function (pm) {
		modSubroutine(pm.name, path.join(__dirname, 'scaled-xp.asm'), bank[7], {
			invoke: {
				romLoc: 0x1D528
			},
			values: {
				CurrentLevel: "8B",
				Temp93: "93"
			}
		});
		// beq _loc_1D546
		// nop
		// fun fact: without this check, you can still get trickle xp at lvl 6
		// (in laruba, halfheart = 1xp, fullheart = 2xp)
		// and if you get BCD(d5b5) 13500 + 115 = 13615 xp (due to bytes following the table) you get level 7,
		// and a standard HP increase.
		// HOWEVER that's impossible since it wraps at 9999
		// I don't know what happens to your damage reduction though!
		pm.add([0xF0, 0x29, 0xEA], 0x1D52B);

		// change riverbank zone level from 5 to 3
		pm.add([0x33], 0x1D5D2);
	}
};
