// quickfix to avoid running out of text space at duck and vrad mountain.
// MUST RUN BEFORE ITEMIZER.

const { core, utils: { log, modBytes, textToBytes } } = require('../../lib');


module.exports = {
patch: function(pm, opts) {
/*
	-------
	3 (0x03)
	0x008cce
	NOTHING.
	-------
	4 (0x04)
	0x008cd7
	YOUR LEVEL
	OF SKILL HAS
	INCREASED TO
	1.
	-------
	5 (0x05)
	0x008cff
	YOUR LEVEL
	OF SKILL HAS
	INCREASED TO
	2.

	dialogIndex: 15,
	text: 'i\'ll give\nyou a silk\nbag.',
	textPointer: 0xCEBE,

	dialogIndex: 18,
	text: 'i\'ll give\nyou a\ndiamond.',
	textPointer: 0xCF38,
*/
	let actor;

	// set original "your level of skill" indexes to stock "nothing"
	pm.add( [0xce, 0x8c], 0xcb9a);
	pm.add( [0xce, 0x8c], 0xcb9c);

	// silk bag at duck
	pm.add( [0xd7, 0x8c], 0xcbb0);
	actor = core.reduce( (acc, cur) => {
				if(acc || !cur.actors) return acc;
				let act = cur.actors.find(a => a.textPointer && a.textPointer == 0xcebe);
				if(!act) return acc;
				else return act;
			}, null);
	if(actor) {
		actor.text = 'YOUR LEVEL\nOF SKILL HAS\nINCREASED TO\n1.';
		actor.textPointer = 0x00cce7;
	}

	// diamond at vrad
	pm.add( [0xff, 0x8c], 0xcbb6);
	actor = core.reduce( (acc, cur) => {
				if(acc || !cur.actors) return acc;
				let act = cur.actors.find(a => a.textPointer && a.textPointer == 0xcf38);
				if(!act) return acc;
				else return act;
			}, null);
	if(actor) {
		actor.text = 'YOUR LEVEL\nOF SKILL HAS\nINCREASED TO\n2.';
		actor.textPointer = 0x00cd0f;
	}

}};
