module.exports = {
    pre: false,
	order:21,
	id: 'yes-man',
	name: 'Yes Man',
	description: 'Default to yes',
	//qol, random, difficulty, misc
	type: 'qol',
    character: '-',
	patch: [
		{ offset: 0x1ED1F, bytes: [ 0x01 ] }
	]
};
