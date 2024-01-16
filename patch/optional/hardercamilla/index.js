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
        //pm.add([0x59], 0x4EAD);
        const project = 32;
        
		//const result = modSubroutine(pm.name, path.join(__dirname, 'camilla.asm'), bank[7]);
		modSubroutine(pm.name, path.join(__dirname, 'camilla.asm'), bank[1], {
			invoke: {
				romLoc: 0x5E13,
				padding: 1
			},
			values: {
				projectile: project,
			}
		});
        modSubroutine(pm.name, path.join(__dirname, 'camilla2.asm'), bank[1], {
			invoke: {
				romLoc: 0x4E64,
				padding: 3
			},
		});
	}
};
