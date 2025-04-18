module.exports = {
	id: 'fast-lakes',
	name: 'Fast Lake Scrolls',
	description: 'Open lakes right away if you have Blue Crystal+, you don\'t even need to equip it!',
	//qol, random, difficulty, misc
	type: 'qol',
	character: '1',
	patch: function (pm) {
		// NOP
		// NOP
		// NOP
		// NOP
		// NOP
		// NOP
		// LDA $91 ; (InventoryBodyParts1)
		// AND #$60
		// CMP $#40
		// BCC 			; $A7B7
		// NOP
		// NOP
		// NOP
		// NOP
		// NOP
		// NOP
		// NOP
		// NOP
		// NOP
		// NOP
		// NOP
		// NOP
		var patch = [0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xA5, 0x91, 0x29, 0x60, 0xC9, 0x40, 0x90, 0x1C, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA];

		//Patch Yuba lake (near Rover)
		pm.add(patch, 0x679D);
		//Patch Uta lake (near Bodley)
		pm.add(patch, 0x6DCC);
	}
};
