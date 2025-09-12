const pm = require('../../lib/patch-manager');
const bank = require('../../lib/bank');

function f(a, opts) {
	const targbyte = 0x1cac0;  // simon's shirt color
	//console.log(pm.simon);
	pats = pm.getPatches(type = 'simon').find(x => x.id == pm.simon.patches[0]);
	if (!pats || typeof pats.patch != 'object')
		return;  // no patch, or is function.

	// try to filter out black/white/etc
	let blacklist = [];
	for(i=0;i<0x8;++i) {
		let j = i * 0x10;
		blacklist = blacklist.concat( [j, j+0xd, j+0xe, j+0xf] );
	}
	for(i=0x31;i<0x3d;++i) {
		blacklist = blacklist.concat( [i] );
	}

	let newcolor = 0;
	while(blacklist.includes(newcolor)) {
		newcolor = Math.floor(Math.random() * 0x70);
	}

	pats = pats.patch;
	pats.forEach(p => {
		let localindex = targbyte - parseInt(p.offset);
		if (localindex >= p.bytes.length)
			localindex = -1;
		if (localindex > -1) {
			p.bytes[localindex] = newcolor;
		}
	});
}

module.exports = {
	id: "random-wardrobe",
	name: "RandomWardrobe",
	description: "Randomize simon's clothing/HPbar color.",
	type: "qol",
	author: "OranjSkueez",
	patch: f
};


