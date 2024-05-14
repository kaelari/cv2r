const { bank, core, utils: { randomInt, modSubroutine } } = require('../../lib');
const path = require('path');
const { log } = require('../../lib/utils');




module.exports = {
	pre: false,
	order:10,
	id: 'tornado-rando',
	name: 'Tornado Randomizer',
	description: 'Tornado goes to random place. If used with map rando may require glitches to complete.',
	//qol, random, difficulty, misc
	type: 'random',
    character: 'Z',
	patch: function (pm, opts) {
		const { logic, rng } = opts;
		let areas= core.filter(c => c.tornadodest == 1);
		const index =randomInt(rng, 0, areas.length-1 );
		//console.log(areas);
		const tornadovalue= [0xFF, areas[index].objset, areas[index].area];
		const tornadooffset = 0xAE8C;
		const tornadodestobjset = [areas[index].objset];
		pm.add(tornadovalue, tornadooffset);
        
		pm.add(tornadodestobjset, 0x1d092);
        modSubroutine(pm.name, path.join(__dirname, 'town-rando/tornado.asm'), bank[7], {invoke: {
                    romLoc: 0x1d09f
                    } 
                    
                } );
// 		console.log("tornado to: " + areas[index].name);
		
	}
}
