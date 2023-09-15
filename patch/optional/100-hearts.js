module.exports = {
	id: '100-hearts',
	name: '100% Heart drops',
	description: 'A heart drops on every single enemy kill',
	//qol, random, difficulty, misc
	type: 'difficulty',
	patch: [
		{ offset: 0x42B9, bytes: [ 0xB0 ] }
	]
};
