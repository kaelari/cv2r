const _ = require('lodash');
const bank = require('./bank');
const fs = require('fs').promises;
const mkdirp = require('mkdirp');
const pm = require('./patch-manager');
const path = require('path');
const { core } = require('./');
const { log, printHeader, randomString, randomInt } = require('./utils');
const seedrandom = require('seedrandom');

module.exports = async function create(opts = {}) {
	const seed = opts.seed || randomString();
	opts.seed = seed;
	opts.rng = seedrandom(seed);
	var world="";
	var string= "";
	if (opts.world){
		world = opts.world;
	}
	const outputName = opts.output || `output/cv2r-${opts.version()}-${seed}`+world;
	
	const output = opts.output = {
		rom: `${outputName}.nes`,
		patch: `${outputName}.patch.json`,
		spoiler: `${outputName}.spoiler-log.csv`,
		doorSpoiler: `${outputName}.door-spoiler-log.csv`,
        townSpoiler: `${outputName}.town-spoiler-log.csv`
	};

	if (!opts.json) {
		mkdirp.sync(path.dirname(path.resolve(output.rom)));
	}

	// set up patch manager based on command line args/options
	await pm.init(opts);
	
	//before doing patches we need to update core if we have customjson
	if (opts.customjson){
		opts.customlogic.forEach(area => {
			core.forEach( corearea => {
				if (area.name === corearea.name){
					j=0;
					for (i=0; i<corearea.actors.length; i++){
						if (!corearea.actors[i].holdsItem ){
							continue;
						}
						if (area.actors[j].mustHave != null){
							corearea.actors[i].mustHave = area.actors[j].mustHave;
						}
						if (area.actors[j].cantHave != null){
							corearea.actors[i].cantHave = area.actors[j].cantHave;
						}
						
						if (area.actors[j].logic != null){ 
                            console.log(corearea.actors[i]);
                            corearea.actors[i].requirements[opts.logic] = area.actors[j].logic;
                            
						}
						j++;
						if (area.actors.length <= j){
							break;
						}
					}
				}
			});
		});
	}
	
	// execute all patches in order
	const order = pm.order.slice(0);
	let isPre = true;
	order.unshift('optional');
    const allpatches = pm.getPatches();
    
	for (const ord of order) {
		const group = pm[ord];
		let { name, patches } = group;

		if (ord === 'optional') {
            if (isPre){
                for (patchName in patches) {
                    
                    var character = allpatches.find(a => a.id == patches[patchName]);
                    if (character != null) {
                        if (character.character !== undefined ){ 
                            string += character.character;
                        }
                
                    }
                
                }
                
                
            }
            patches = patches.filter(p => isPre === !!require(`../patch/${name}/${p}`).pre);
            
            patches.sort ( (a,b) => require(`../patch/${name}/${a}`).order - require(`../patch/${name}/${b}`).order );
            
			isPre = false;
           
		}

		if (patches.length) {
            if (name === 'simon') {
				printHeader('simon sprite patch');
				if (patches[0] === 'random') {
					let simons = [];
					pm.getPatches('simon').forEach(patch => {
						simons.push(patch.id);
					});
					patches[0] = simons[ randomInt(opts.rng, 0, simons.length - 1 ) ];
				}
			} else if (name === 'palette') {
				printHeader('palette patch');
			} else if (name === 'optional' && opts.difficulty) {
				printHeader(`${opts.difficulty} ${name} patches`);
			} else {
				printHeader(`${name} patches`);
			}
		}

		for (const patchName of patches) {
			log(`- ${patchName}`);
            const data = await pm.getPatchData(ord, patchName);
            
			const patch = data.patch;
            group.string = string;
			if (_.isFunction(patch)) {
				await patch(group, opts);
			} else if (_.isArray(patch)) {
				patch.forEach(p => {
					if (_.isString(p.bytes)) {
						p.bytes = p.bytes.split(/\s+/).map(b => parseInt(b, 16));
					}
					group.add(p.bytes, p.offset);
				});
			} else {
				const msg = !patch ? '"patch" property must be defined' : '"patch" property must be function or array';
				throw new Error(`invalid patch "${patchName}": ${msg}`);
			}
		}
		log('');
	}

	// write out remaining bank space
	bank.forEach((b, index) => {
		if (!b.rom) {
			log({ bank: index, remaining: 'unused' });
		} else {
			log({ bank: index, remaining: b.rom.end - (b.rom.start + b.offset) });
		}
	});

	// write out the modified rom and patch
	if (opts.json) {
		if (opts.world){
			const patch = "patch"+opts.world;
			const spoiler = "spoiler"+opts.world;
			
			console.log(JSON.stringify({
				[patch]: pm.export(),
				[spoiler]: global.spoiler,
                [version]: opts.version
			}));
			
		}else {
			console.log(JSON.stringify({
				patch: pm.export(),
				//spoiler: global.spoiler,
                spoiler: global.spoiler.map(s => `"${s[0]}","${s[1]}","${s[2]}"`),
				doorSpoiler: global.doorSpoiler,
                townSpoiler: global.townSpoiler,
				version: opts.version()
			}));
            
            
		}
	} else {
		await fs.writeFile(output.patch, JSON.stringify(pm.export()));
		await fs.writeFile(opts.output.spoiler,
			global.spoiler.map(s => `"${s[0]}","${s[1]}","${s[2]}"`).join('\n'));
		if (global.doorSpoiler) {
			await fs.writeFile(opts.output.doorSpoiler,
				global.doorSpoiler.map(s => `"${s[0]}","${s[1]}"`).join('\n'));
		}
		if (global.townSpoiler) {
			await fs.writeFile(opts.output.townSpoiler,
				global.townSpoiler.map(s => `"${s[0]}","${s[1]}"`).join('\n'));
		}
		if (opts.rom) {
			await fs.writeFile(output.rom, pm.generateRom(await fs.readFile(opts.rom)));
		}
	}

	// return the output filename
	return output;
};
