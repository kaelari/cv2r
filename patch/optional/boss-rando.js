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
        global.bossRando = true;
        let endboss_tilesheet = null;
        let locations= core.filter(loc => {
                return loc.boss
            });

        let cam = locations[0].actors[0];
        let death = locations[1].actors[0];
        let drac = JSON.parse(JSON.stringify(death));
        drac.name = "Dracula";
        drac.vanillaName = "Dracula";
        drac.id =  0x47;
        drac.sprite = 0x0C;
        drac.data = 0xF0;
        //drac.pointer = NaN;  // meaningless. no actor list, spawned dynamically.
        drac.requirements = {};  // depends on req rando and map placement.
        drac.textPointer = null;

        cam.holdsItem = false;
        death.holdsItem = false;
        drac.holdsItem = false;

        // Note: if itemizer ever becomes optional, this will also need actor.text
        let holdingtank = {"cam":{}, "death":{}, "drac":{}};
        holdingtank.cam.requirements = cam.requirements;
        holdingtank.death.requirements = death.requirements;
        holdingtank.drac.requirements = drac.requirements;
        holdingtank.cam.textPointer = cam.textPointer;
        holdingtank.death.textPointer = death.textPointer;
        holdingtank.drac.textPointer = drac.textPointer;
        //holdingtank.xxxx.objset = // always 1 for mansions
        //holdingtank.xxxx.area = // 6 laruba, 9 brahm... is this ever used?
        //holdingtank.xxxx.submap = // 2 for all (current) bossrooms, 1 for drac's chamber. not used?

        
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
            // death.pointer 0x5CDE 23774  $08,$08,$44,$80
            // camilla.pointer 0x5AC6 23238  $08,$0A,$42,$F0
            //console.log("placing "+bossestoplace[boss]+" in "+placingin);
            bossplaces.splice(place, 1);
            if (placingin == "death") {
             if (bossestoplace[boss] == "camilla"){
                 cam.requirements = holdingtank.death.requirements;
                 cam.textPointer = holdingtank.death.textPointer
                 cam.vanillaName = 'Death';
                 cam.locationName = locations[1].name;
                 cam.holdsItem = true;
                 locations[1].actors[0] = cam;
                 locations[1].camilla = true;
                 pm.add([ cam.x, cam.y, cam.id, cam.data ], death.pointer);
             }
             if (bossestoplace[boss] == "death"){
                 death.holdsItem = true;
                 locations[1].death = true;
                 continue;
             }
             if (bossestoplace[boss] == "drac"){
                 drac.requirements = holdingtank.death.requirements;
                 drac.textPointer = holdingtank.death.textPointer
                 drac.vanillaName = 'Death';
                 drac.locationName = locations[1].name;
                 drac.holdsItem = true;
                 locations[1].actors[0] = drac;
                 locations[1].drac = true;
                 pm.add([ drac.x, drac.y, drac.id, drac.data ], death.pointer);
                
             }
             
                
            }
            if (placingin == "camilla") {
             if (bossestoplace[boss] == "camilla"){
                 cam.holdsItem = true;
                 locations[0].camilla = true;
                 continue;  
             }
             if (bossestoplace[boss] == "death"){
                 death.requirements = holdingtank.cam.requirements;
                 death.textPointer = holdingtank.cam.textPointer
                 death.vanillaName = 'Camilla';
                 death.locationName = locations[0].name;
                 death.holdsItem = true;
                 locations[0].actors[0] = death;
                 locations[0].death = true;
                 pm.add([ death.x, death.y, death.id, death.data ], cam.pointer);
                continue;
             }
             if (bossestoplace[boss] == "drac"){
                 drac.requirements = holdingtank.cam.requirements;
                 drac.textPointer = holdingtank.cam.textPointer
                 drac.vanillaName = 'Camilla';
                 drac.locationName = locations[0].name;
                 drac.holdsItem = true;
                 locations[0].actors[0] = drac;
                 locations[0].drac = true;
                 pm.add([ drac.x, drac.y, drac.id, drac.data ], cam.pointer);
                 continue;
             }
             
                
            }
            if (placingin == "drac") {
                
                if (bossestoplace[boss] == "camilla"){
                    cam.requirements = holdingtank.drac.requirements;   // nothing
                    cam.textPointer = holdingtank.drac.textPointer
                    cam.vanillaName = 'Dracula';   // useless for now
                    cam.locationName = null;
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
                    endboss_tilesheet = cam.sprite;
                }
                if (bossestoplace[boss] == "death"){
                    death.requirements = holdingtank.drac.requirements;   // nothing
                    death.textPointer = holdingtank.drac.textPointer
                    death.vanillaName = 'Dracula';   // useless for now
                    death.locationName = null;
                    locations[2].death = true;
                    pm.add([0x44], 0x4a84);
                    pm.add([0x47], 0x4a80);
                    pm.add([0x47], 0x493F);
                    pm.add([0x44], 0x4943);
                    
                    pm.add([0x44], 0x750B);
                    const spawn = modSubroutine(pm.name, path.join(__dirname, 'boss_rando.asm'), bank[7], {
                        });
                    let code = `JSR $${spawn.ram.toString(16)}`;
                    let bytes = assemble(code);
                    pm.add(bytes, 0x750C);
                    endboss_tilesheet = death.sprite;
                    
                }
                if (boss == "drac"){
                    locations[2].drac = true;
                    // not needed, endboss_tileset = drac.sprite;
                    continue;
                }
                
            }
            
        }

        //console.log(core.filter(a => a.actors && a.actors.length == 1).map(b => b.actors[0]).filter(c => c.boss));

	}
};
