module.exports = {
	pre: true,
	order: 1,
	
	id: 'unified-checks',
	name: 'Unified Checks',
	description: 'Cluebooks contain items, items contain clues',
	//qol, random, difficulty, misc
	type: 'random',
    character: '!',
	patch: function (pm) {
       global.uc = true;
       
	}
};
