module.exports = {
	id: 'harderdeath',
	name: 'Harder Death',
	description: 'Increases deaths HP and scythe\'s HP',
	//qol, random, difficulty, misc
	type: 'difficulty',
    character: '3',
	patch: function(pm, opts) {
		pm.add([0x1E], 0x5EF8);
		pm.add([0xff], 0x5CE1);
	}
};
