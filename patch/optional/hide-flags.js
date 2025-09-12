
module.exports = {
	id: 'hide-flags',
	name: 'Hide Flags',
	description: 'hide flags from main screen',
	//qol, random, difficulty, misc
	type: 'misc',
	character: '9',
	flaglabel: 'hf',
	patch: function(pm, opts) {
		// nothing here. title-screen core patch checks for the presence of this patch.
	}
};
