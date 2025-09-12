const fs = require('fs');
const path = require('path');
const { bank, utils: { modSubroutine } } = require('../../../lib');

const DEFAULT_PIXELS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,248,248,252,124,24,0,0,0,0,0,128,96,28,3,2];
// base addresses of all appropriate sprite pattern tables
const BASE_ADDRS = [
	0x21010,
	0x23010,
	0x25010,
	0x27010,
	0x29010,
	0x2a010,
	0x2c010,
	0x38010
];


function getPixBytes(simon)
{
	// NOTE: this will not work if "random" commandline simon is selected
	if(!simon) return null;

	let d = fs.readdirSync(path.join(__dirname, 'spriteconf'));
	if(!d) return null;
	d = d.filter( x => x.toLowerCase().includes('.conf', x.length - 5) );

	const rex = /(.*)=(.*)/;
	let foodmap = {};
	d.forEach( file => {
		let s = fs.readFileSync(path.join(__dirname, 'spriteconf', file), 'utf8');
		let lines = s.split('\n');
		for(l in lines){
			let mat = rex.exec(lines[l]);
			if(mat){
				foodmap[mat[1].trim()] = mat[2].trim();
			}
		}
	});
	let whichfood = foodmap[simon] || null;
	if(!whichfood) return null;
	// ensure our 'simon'.json file exists
	let j;
	try {
		j = require( path.join(__dirname, 'foods', whichfood+'.json') );
	} catch(e) {}  // nothing on catch
	if(!j) return null;

	return j.bytes;
}


module.exports = {
	//TODO rename this nibble-of-meat (NOM) ?
	pre: true,
	id: 'health-drops',
	name: 'Health Drops',
	version: '1.1',
	description: 'Defeated enemies sometimes drop a bite to eat.',
	//qol, random, difficulty, misc
	type: 'difficulty',
    character: '',
    flaglabel: 'hdr',
	patch: function (pm, opts) {
		let pats = {};  // {romaddr: [bytes,], ...}

		// replace mstar2 tip with healthdrop pixels, use that index instead of $57
		pixelbytes = getPixBytes(opts.simon);
		if(!pixelbytes) pixelbytes = DEFAULT_PIXELS;

		BASE_ADDRS.forEach( (b) => {
			let a = b+0x4e0;
			pats[a] = pixelbytes;
		});

		// $b3c7 replace ??? struct[$ef] with healthdrop struct
		pats[0x33d7] = [0x81, 0x74, 0xb2, 0x4f]; 

		//replace mstar2 tip with chain2 tip in tile def table
		//$aec4, $b2c7 (0x2ed4,0x32d7)   from $4f to $4d
		pats[0x2ed4] = [0x4d];
		pats[0x32d7] = [0x4d];


		modSubroutine(pm.name, path.join(__dirname, 'asm', 'testdropmeat.asm'), bank[1], {
			invoke: {
				romLoc: 0x42ec
			},
			values: {
				ObjectCurrentPose1: "$0300",
				ObjectFacingLeft: "$0420"
			}
		});
		pats[0x42ea] = [0xa5, 0x2e];   // lda RandomSeed


		modSubroutine(pm.name, path.join(__dirname, 'asm', 'eatsomething.asm'), bank[1], {
			invoke: {
				romLoc: 0x4761
			},
			values: {
				AnyBankPlayTracks: "$c118",
				TempPtr08_lo: "*$08",
				shoehornedentrypoint: "$EC8D",
				Object_Erase_And_IfType3C_Set_42to00: "$df42"
			}
		});

		modSubroutine(pm.name, path.join(__dirname, 'asm', 'extendhealingsub.asm'), bank[7], {
			invoke: {
				romLoc: 0x1ec94
			},
			values: {
				AnyBankPlayTracks: "$c118",
				TempPtr08_lo: "*$08"
			}
		});
		pats[0x1eca0] = [0x65, 0x08];   // adc TempPtr08_lo


		for(k in pats){
			//console.log(k+": "+pats[k]);
			pm.add(pats[k], k);
		}
	}
};
