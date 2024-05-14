
const { bank, core, utils: { randomInt, modSubroutine } } = require('../../lib');
const path = require('path');
const { log } = require('../../lib/utils');



module.exports = {
	id: 'pacifist',
	name: 'Pacifist mode',
	description: 'Killing enemies will warp you back to jova.',
	//qol, random, difficulty, misc
	type: 'difficulty',
    character: '5',
	pre: false,
    order: 15,
    
	patch: function (pm, opts) {
        console.log("adding pacifist");
		const { logic, rng } = opts;
        modSubroutine(pm.name, path.join(__dirname, 'pacifist.asm'), bank[7], {
			invoke: {
				romLoc: 0x042A5
			}
			
		});
        pm.add([EA], 0x042a8);
        
    },
    
};
