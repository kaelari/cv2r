const { core, utils: { randomInt } } = require('../../lib');

const { log } = require('../../lib/utils');




module.exports = {
	pre: true,
	order:10,
	id: 'blob-rando',
	name: 'Blob Randomizer',
	description: 'blob goes to random town or mansion',
	//qol, random, difficulty, misc
	type: 'random',
    character: '2',
	patch: function (pm, opts) {
		const { logic, rng } = opts;
		let areas= core.filter(c => c.blobdest == 1);
		const index =randomInt(rng, 0, areas.length-1 );
		//console.log(areas);
		const blobvalue= [0xFF, areas[index].objset, areas[index].area];
		const bloboffset = 0xB392;
		
		pm.add(blobvalue, bloboffset);
// 		log("blob to: " + areas[index].name);
		
	}
}
