
const fs = require('fs').promises;
const path = require('path');
const {  utils: { modSubroutine, log, shuffleArray, textToBytes } } = require('../../../lib');
const { assemble, bank, core, memory } = require('../../../lib');

function asmFile(name) {
	return path.join(__dirname, 'asm', name);
}
module.exports = {
	pre: false,
	order: 100,
	id: "better_clues",
	name: 'Better Clues',
	description: 'Improves randomizer clues',
	//qol, random, difficulty, misc
	type: 'qol',
    character: 'e',
	patch: async function(pm, opts) {
        const { rng } = opts;
        const values = [];
        const itemnames = {
            "dagger" : 1,
            "silver knife": 2,
            "gold knife" : 4,
            "Holy Water" : 8,
            "diamond" : 16,
            "sacred flame" : 32,
            "oak stake" : 64,
        };
        const bodynames = {
            
            "rib" : 1,
            "heart" : 2,
            "eye" : 4,
            "Nail" : 8,
            "Ring" : 16,
        }
        const carryname = {
            "silk bag" : 1,
            "magic cross" : 2,
            "laurels"  : 4,
            "garlic" : 8
            
        }
        core.forEach(loc => {
            if (!loc.actors) return;
            
            loc.actors.filter(a => a.itemName === 'clue').forEach(a => {
                
                values.push(a);  
            });
        });
        shuffleArray(values, rng);
        var loop ="";
        for (let i = 0; i < values.length; i++) {
            const val = values[i];
            
            if (itemnames[val.hasclue.item]){
            
            loop += `
LDA $4A
AND #$${itemnames[val.hasclue.item]}
BNE Item${i}AlreadyOwned

`;
        }else if (bodynames[val.hasclue.item]){
            
            loop += `
LDA $91
AND #$${bodynames[val.hasclue.item]}
BNE Item${i}AlreadyOwned
`;
        }else if (carryname[val.hasclue.item]){
            
            loop += `
LDA $92
AND #$${carryname[val.hasclue.item]}
BNE Item${i}AlreadyOwned
`;
        }else if (val.hasclue.item == "whip"){
        loop += `
LDA $434
CMP #$04
Bcs Item${i}AlreadyOwned
`;
            
        }else if (val.hasclue.item == "crystal"){
        loop += `
LDA $91
AND #$C0
BNE Item${i}AlreadyOwned
`;
        }
        loop += `
LDA $7050
CMP #$${i}
BCS Item${i}AlreadyOwned
LDA #$${values[i]["7F"]}
STA $7F
STA $7100,x
LDA #$${i}
STA $7050
LDA #$00
rts
Item${i}AlreadyOwned`
        
        }
        
        var foo= modSubroutine(pm.name, asmFile('inner.asm'), bank[1], {
             values: {
                 loop : loop
                 
            }
            
        });
        
         modSubroutine(pm.name, asmFile('findclue.asm'), bank[1], {
             values: {
                 loop_loc : foo.ram
                 
            },
            invoke: {
                romLoc: 0x47EB,
                jump: 1
            }
        });
	}
}
	
