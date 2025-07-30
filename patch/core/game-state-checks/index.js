const path = require('path');
const { bank, memory, utils: { modSubroutine } } = require('../../../lib');

module.exports = {
	patch: function (pm) {
		// subroutine to handle jovah warp and inventory quest item deselect code
		var down = "UPGRAD RTS";
		if (global.debug || global.silentdebug) {
			down = `UPGRAD LDA #$04
STA $0434
LDA #$FF
STA $4A
STA $91
LDA #$0F
STA $92
LDA #$08
STA $4C
STA $4D
RTS
			`;
			
		}
		memory.gameStateChecks = modSubroutine(pm.name, path.join(__dirname, 'gameStateChecks.asm'), bank[3], {
			values: {
					downab: down
			}
			
		}
		);
		memory.warpPositioning = modSubroutine(pm.name, path.join(__dirname, 'warpPositioning.asm'), bank[3]);
		
		// bank switch and JSR on bank 7 to invoke the game state checks on bank 2, where
		// there's more free space
		modSubroutine(pm.name, path.join(__dirname, 'gameStateChecksWrapper.asm'), bank[7], {
			invoke: {
				romLoc: 0x1C09A
			},
			values: {
				gameStateChecks: memory.gameStateChecks.ram.toString(16),
				
			}
		});

		// update simon positioning+flags and camera positioning on jovah warp
		modSubroutine(pm.name, path.join(__dirname, 'jovahWarpPositioning.asm'), bank[7], {
			invoke: {
				romLoc: 0x1CFF8,
				padding: 1
			},
			values: {
				warpPositioning: memory.warpPositioning.ram.toString(16)
			}
		});

		// special handling for jovah warp on ferry
		modSubroutine(pm.name, path.join(__dirname, 'jovahWarpFerryCheck.asm'), bank[7], {
			invoke: {
				romLoc: 0x1CF4C,
				padding: 1
			},
			values: {
				clearObjects: memory.clearObjects.ram.toString(16)
			}
		});
	}
};
