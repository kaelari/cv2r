
const { bank, core, utils: { randomInt, modSubroutine } } = require('../../../lib');
const path = require('path');




module.exports = {
	id: 'pacifist',
	name: 'Pacifist mode',
	description: 'Killing enemies will warp you back to jova.',
	//qol, random, difficulty, misc
	type: 'difficulty',
    character: '5',
	pre: true,
    order: 15,
    
	patch: function (pm, opts) {
        
		const { logic, rng } = opts;
        global.pacifist = 1;
        modSubroutine(pm.name, path.join(__dirname, 'pacifist.asm'), bank[7], {
			invoke: {
				romLoc: 0x042B5,
                padding: 1
			}
			
		});
        
        
        
    },
    
};
