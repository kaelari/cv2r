// Expand bank 7 by moving system vector _Reset into pseudo-bank8,
// also we can steal more unused bytes.
// Available bank 8 shrinks by 6 bytes, but bank 7 grows by 0x2A bytes!
// Author: OranjSkueez, if you have any questions about this nonsense.

// TODO: make this execute before anybody has a chance to allocate space.
//       it should work as-is, but overwriteTest may (falsely) fail in utils if this
//       hasn't executed when another patch tries to grab space we haven't freed yet.

const { bank, utils: { modBytes } } = require('../../lib');

module.exports = {
	patch: function (patchGroup) {
		// Note about bank ranges:
		// beginning point is inclusive, endpoint is exclusive.

		// move the endpoint for bank 8, we can squeeze 2 more bytes here.
		// (we could actually squeeze another 2 bytes at the beginning too,
		//  Sound_PCMsample5D_Config at $FBC4 is an array of 3 structs, each 4 bytes.
		//  there is no 0xFF terminator.
		//  but that would require modifying bank.js directly)
		bank[8].ram.end = 0xFC00;  // was 0xFBFE
		bank[8].rom.end = 0x1FC10; // was 0x1FC0E

		// move _Reset function into pseudo-bank8, using some b8, but freeing bank7 space.
		resetfuncbytes = [ 0xd8, 0x78, 0xee, 0xff, 0xff, 0x4c, 0x00, 0xc0 ];
		const mod = modBytes(patchGroup.name, resetfuncbytes, bank[8]);

		// update pointer to _Reset in SystemVectorTable
		patchGroup.add([ mod.ram & 0xff, mod.ram >>> 8 ], 0x2000c);

		// move the endpoint for bank 7, and ignore the useless identifier bytes too.
		bank[7].ram.end = 0xFFF9;  // was 0xFFCE
		bank[7].rom.end = 0x20009; // was 0x1FFDE
	}
}
