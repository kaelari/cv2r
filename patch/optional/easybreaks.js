module.exports = {
	id: 'easybreaks',
	name: 'Easy Sequence Break',
	description: 'Makes cemetary jumps easier',
	//qol, random, difficulty, misc
	type: 'difficulty',
    character: 'r',
	patch: [
		{ offset: 0xB4BA, bytes: [ 0x17 ] },
		{ offset: 0xB4C2, bytes: [ 0x19 ] },
		{ offset: 0xB528, bytes: [ 0x17 ] },
        { offset: 0xB530, bytes: [ 0x19 ] }
	]
};
