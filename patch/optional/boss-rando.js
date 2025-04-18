const fs = require('fs').promises;
const path = require('path');
const { assemble, bank, core, object, utils: { log,randomInt, modSubroutine }} = require('../../lib');

const PATTERN_ASM = path.join(__dirname, 'pattern.asm');


module.exports = {
	pre: true,
	order: 99,
	id: "boss-rando",
	name: 'Boss Rando',
    requires: 'Enemizer', 
	description: 'Randomize Bosses. there are only 3 bosses so expect a lot of vanilla.',
	//qol, random, difficulty, misc
	type: 'random',
    character: ',',
	patch: async function(pm, opts) {
	
		const { rng } = opts;
        
        let locations= core.filter(loc => {
                return loc.boss
            });
        let cam = locations[0].actors[0];
        let death = locations[1].actors[0];
        
        locations[0].camilla = false;
            locations[0].drac =false;
            locations[0].death = false;
            locations[1].camilla = false;
            locations[1].drac =false;
            locations[1].death = false;
            
            locations[2].camilla = false;
            locations[2].drac =false;
            locations[2].death = false;
        
        bossestoplace = ["camilla", "death", "drac"];
        bossplaces = ["camilla", "death", "drac"];
        for (boss in bossestoplace){
            
            place = randomInt(rng, 0, bossplaces.length-1);
            
            placingin = bossplaces[place];
            bossplaces.splice(place, 1);
            if (placingin == "death") {
             if (bossestoplace[boss] == "camilla"){
                 locations[1].cam = true;
                  pm.add([ cam.x, cam.y, cam.id, cam.data ], death.pointer);
             }
             if (bossestoplace[boss] == "death"){
                 locations[1].death = true;
                  continue;
             }
             if (bossestoplace[boss] == "drac"){
                locations[1].drac = true;
                pm.add([ death.x, death.y, 0x47, 0xF0 ], death.pointer);
                
             }
             
                
            }
            if (placingin == "camilla") {
             if (bossestoplace[boss] == "camilla"){
                 locations[0].camilla = true;
                 continue;  
             }
             if (bossestoplace[boss] == "death"){
                 locations[0].death = true;
                 pm.add([ death.x, death.y, death.id, death.data ], cam.pointer);
                continue;
             }
             if (bossestoplace[boss] == "drac"){
                locations[0].drac = true;
                pm.add([ death.x, death.y, 0x47, 0xF0 ], cam.pointer);
                continue;
             }
             
                
            }
            if (placingin == "drac") {
                
                if (bossestoplace[boss] == "camilla"){
                    locations[2].camilla = true;
                    pm.add([0x42], 0x4a84);
                    pm.add([0x47], 0x4a7c);
                    pm.add([0x47], 0x493b);
                    pm.add([0x42], 0x4943);
                    
                    pm.add([0x42], 0x750B);
                    
                    const spawn = modSubroutine(pm.name, path.join(__dirname, 'boss_rando.asm'), bank[7], {
                        });
                    let code = `JSR $${spawn.ram.toString(16)}`;
                    let bytes = assemble(code);
                    pm.add(bytes, 0x750C);
                }
                if (bossestoplace[boss] == "death"){
                    locations[2].death = true;
                    pm.add([0x44], 0x4a84);
                    //pm.add([0x04], 0x4941);  // i don't know why this was here
                    pm.add([0x47], 0x4a80);
                    pm.add([0x47], 0x493F);
                    pm.add([0x44], 0x4943);
                    
                    pm.add([0x44], 0x750B);
                    const spawn = modSubroutine(pm.name, path.join(__dirname, 'boss_rando.asm'), bank[7], {
                        });
                    let code = `JSR $${spawn.ram.toString(16)}`;
                    let bytes = assemble(code);
                    pm.add(bytes, 0x750C);
                    
                }
                if (boss == "drac"){
                    locations[2].drac = true;
                    continue;
                }
                
            }
            
        }
            
        return;
            
        //actual switching, 
            let a = locations[0].actors[0]
            let b = locations[1].actors[0]
            pm.add([ a.x, a.y, a.id, a.data ], b.pointer);
            pm.add([ b.x, b.y, b.id, b.data ], a.pointer);
        
        //this requires enemizer! 
            locations[0].death = !locations[0].death;
            locations[0].camilla = !locations[0].camilla;
            locations[1].death = !locations[1].death;
            locations[1].camilla = !locations[1].camilla;
        
        //swap the requirements. niether has actorrequirements so it's simple.
            let c = a.requirements;
            a.requirements = b.requirements;
            b.requirements = c;
        
        
        //this doesn't do anything but corrects the data in core. 
            locations[1].actors[0] = a;
            locations[0].actors[0]= b;
            
        
        
        }
};
