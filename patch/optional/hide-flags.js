
module.exports = {
	id: 'hide-flags',
	name: 'Hide Flags',
	description: 'hide flags from main screen',
	//qol, random, difficulty, misc
	type: 'misc',
    character: '9',
	patch: function(pm, opts) {
        const {
			bank,
			utils: { modBytes, modSubroutine, randomInt, TEXT_MAP_TITLE, textToBytes }
		} = require('../../lib');
        const titlePad = (text, size) => {
			let padFront = text.length % 2;
			while (text.length < size) {
				text = `${padFront ? ' ' : ''}${text}${padFront ? '' : ' '}`;
				padFront = !padFront;
			}
			return text;
		};
        const titlePrint = (text, rom) => pm.add(textToBytes(text, TEXT_MAP_TITLE), rom);
        const string="Hidden Flags";
		titlePrint(titlePad(string, 24), 0x010179);
	}
};
