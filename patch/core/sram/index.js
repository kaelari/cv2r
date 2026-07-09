const path = require('path');
const { bank, patchManager, utils: { modSubroutine } } = require('../../../lib');

module.exports = {
	patch: function (pm) {
		const hasDiamondWarp = patchManager.optional.patches.some(
                p => p.id === 'diamond-warp'
            );
		const hasDoorRando = patchManager.optional.patches.some(
    p => p.id === 'door-rando'
);
		let code = '';
        console.log(hasDoorRando);
		if (hasDiamondWarp) {
            console.log("diamondewarp on");
			code += 'STA $6006\n';
		}
		if (hasDoorRando) {
			code += 'STA $6100\n';
		}
		if (code !== '') {
			code = `\nLDA #$FF\n${code}LDA #$00\n`;
		}

		modSubroutine(pm.name, path.join(__dirname, 'sram.asm'), bank[8], {
			invoke: {
				romLoc: 0x1C02B,
				padding: 2
			},
			values: { code }
		});
	}
};
