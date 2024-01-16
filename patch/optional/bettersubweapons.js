module.exports = {
	id: 'bettersubweapons',
	name: 'Better Sub Weapons',
	description: 'Silver Knife, Diamond, and Sacred Flame do double your whip instead of half.',
	//qol, random, difficulty, misc
	type: 'difficulty',
    character: 'b',
	patch: [
		{ offset: 0x49cb, bytes: [ 0x0A ] }
	]
};
