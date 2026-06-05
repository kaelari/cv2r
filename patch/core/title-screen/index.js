const path = require('path');

const ICONS = [
	0x4D, // fangs
	0x4E, // rib
	0x4F, // heart
	0x50, // eyeball
	0x51, // nail
	0x52, // ring
	0x54, // dagger
	0x55, // silver knife
	0x57, // holy water
	0x58, // laurels
	0x59, // oak stake
	0x5A, // cross
	0x5B, // whip
	0x5C, // silk bag
	0x5E, // red crystal
	0x5F, // white crystal
	0x61, // heart
	0x69, // sacred flame
	0x6D, // garlic
	0x6E, // blue crystal
	0x6F, // golden knife
	0x70 // diamond
];

module.exports = {
	patch: function(patchGroup, opts) {
		const { version } = require('../../../package.json');
		const {
			bank,
			utils: { modBytes, modSubroutine, randomInt, TEXT_MAP_TITLE, textToBytes }
		} = require('../../../lib');
		const { rng } = opts;

		/*
			1b strlen:  high bit on = nonrepeating, off = repeating
			Nb string:  1b if repeating, Nb if nonrepeating
			(repeat)
		*/
		const buildTitleBytes = () => {
			const bytelimit = 0x56;  // the exact number of bytes we are replacing!
			let output = [];
			let col = 0x1C; // column. start after logo, screen width is 0x20
			let runlen;
			let v = version;
			let lines = [
				"randomizer",
				null,  // fill with excess spaces to eat bytes.
				v,
				"",  // future use?
				"kaelari",
				"bloodsweatandcode"
			];
			let neededlen = lines.join("").length + 6 + 14;
			let excesslen = bytelimit - neededlen;

			if (excesslen < 0){
				lines = [
					"error",
					"",
					"",
					"how much text",
					"can you cram",
					"on this screen?"
				];
				neededlen = lines.join("").length + 6 + 14;
				excesslen = bytelimit - neededlen;
			}

			lines.forEach( (l) => {
				let b;
				if (!l) {
					let p = Math.min(excesslen, 0x20);
					if (!p){
						// zero excesslen, but we can't use emptystring.
						// so we remove this string and add a space to the next.
						b = "";
						excesslen = 1;
					}else{
						excesslen = excesslen - p;
						b = "".padStart(p);
					}
				}else{
					b = l;
				}

				let spac = (0x20 - col) + (0x10 - Math.floor(b.length / 2));
				col = col + spac + b.length;
				if (!b){
					b = [];
				}else{
					if (excesslen == 1){
						b += " ";
						col += 1;
						excesslen = 0;
					}
					b = textToBytes(b, TEXT_MAP_TITLE);
					b.unshift(b.length | 0x80);  // high bit = nonrepeating
				}
				col = col % 0x20;
				b = [spac, 0xc1].concat(b);

				output = output.concat(b);
			});

			output = output.concat([0x21 - col, 0xc1]);
			if (output.length != bytelimit) {
				console.log("ERROR in buildTitleBytes: byte length does not match!");
				console.log(output.length.toString(16));
				return null;
			}
			return output;
		}
		patchGroup.add(buildTitleBytes(), 0x10166);

		//////////////
		// replace "prologue" screen contents with tabulated 2-letter flaglist.
		// TOTAL BYTES AVAILABLE = 199
    
		let sortString = (stringg) => {
				return stringg.split("").sort().join("");
			};
		if (patchGroup.string.length) {
			var legacypatchstring = sortString(patchGroup.string.toLowerCase());
		}
		// y = screen row (0-27), x = screen col (0-31)
		const prologueCoordToBytes = (y, x) => {
			let val = 0x2420 + (y * 0x20) + x;
			return [ (val & 0xff00) / 0x100, val & 0xff ];
		};
		// build and format a table of 2-character flags, return bytes
        let hiddenflags = false;
		if (opts.patch !== undefined){
            hiddenflags = opts.patch.split(',').includes('hide-flags');
        }
		let halfway;
		/*
			(struct indexed from ptr table)
			2b encoded coords (in 8x8 tiles)
			Nb string
			1b $FE terminate string
		*/
		const getFlagListLines = (flaglist) => {
            
			let sidepad, betweenpad, perline;
			let output = [];
			// max flaglabel length of 3. 1-length labels are legacy only.
			flaglist = flaglist.filter( e => e && e.length < 4 ).sort();
			// rows (0indexed) are 12, 14, 16, 18, 20, 22
			// cols (0indexed) restricted to 1 < c < 30 (leave at least 2 sidepad LR)
			// max bytes per row = (3*7) + 6 + 3 = 30
			// bytes for 6 rows (not counting label) = 30 * 6 = 180
			// TOTAL BYTES AVAILABLE = 199
			flaglist = flaglist.slice(0, 6 * 7);  // truncate huge flag list.
			let logic = opts.logic;
            let customjson = opts.customjson;
			let listlabel = "";
            
			if (flaglist.length > 41){
				listlabel = null;
			}
			else if(hiddenflags){
				listlabel = "hidden flags";
			}
            else if (logic === "standard" && customjson == null && patchGroup.string.length == patchGroup.flaglabels.length && legacypatchstring === sortString("1eghopt".toLowerCase() ) ){
                listlabel = "Tournament";
            }
            else if (logic === "standard" && customjson == null && patchGroup.string.length == patchGroup.flaglabels.length && legacypatchstring === sortString("1OPQegh".toLowerCase() )){
                listlabel = "Standard";
            }
			else {
                if (customjson == null){
                    listlabel = logic + " logic";
                }else{
                    listlabel = "modified "+ logic + " logic";
                }
			}
			if (listlabel){
				output = output
					.concat( prologueCoordToBytes(0xa, 0x10 - Math.floor(listlabel.length / 2)) )
					.concat( textToBytes(listlabel, TEXT_MAP_TITLE) )
					.concat( 0xFD );
			}
			if (flaglist.length <= 6 * 4){
				perline = 4;
			}else{
				perline = Math.ceil(flaglist.length / 6);
			}
			switch(perline){
				case 7:
					sidepad = 2;
					betweenpad = 1;
					break;
				case 6:
					sidepad = 2;
					betweenpad = 2;
					break;
				case 5:
					sidepad = 4;
					betweenpad = 2;
					break;
				default:
					sidepad = 4;
					betweenpad = 4;
					break;
			}

			let r = 0;
			for(f of flaglist){
				if (hiddenflags) break;   // meh, lazy.
				if (r > 5) break;  // should be impossible.
				if (r == 3){ // split prologue2 at "halfway" point, mark ptr.
					halfway = output.length;
					output[output.length - 1] = 0xFE;
				}
				let slc = flaglist.slice( (r * perline), ((r + 1) * perline) );
				
				let line = slc.map( a => a.padStart(3) ).join("".padStart(betweenpad));
				output = output.concat(prologueCoordToBytes(12 + (r*2), sidepad))
					.concat(textToBytes(line, TEXT_MAP_TITLE))
					.concat(0xFD);
				++r;
				if ( r * perline >= flaglist.length ) break;
			}
			//console.log("output.length is "+output.length.toString(10));
			if (output.length > 199){
				// should never happen.
				output = output.slice(0, 199);
			}
			output[output.length - 1] = 0xFE;  // 0xFE terminate text.
			return output;
		};
        
        
		if (patchGroup.flaglabels && patchGroup.flaglabels.length){
			
            patchGroup.add(getFlagListLines(patchGroup.flaglabels), 0x10366);
		}
		if (halfway){
			halfway = 0x8356 + halfway;
			patchGroup.add([ (halfway & 0xff), ((halfway & 0xff00) / 0x100)], 0x1C951);  // point prologue2 to halfway mark
		}
		else {
			patchGroup.add([0x1A, 0x84], 0x1C951);  //  "remove" prologue2
		}
		// "remove" 'press start key', to repurpose bytes
		patchGroup.add([0x1a, 0x84], 0x1C8a5);

		// prevent selecting "password"
		patchGroup.add(textToBytes('        ', TEXT_MAP_TITLE), 0x13A2D)
		patchGroup.add([ 0xA9, 0x00 ], 0x1C39B);

		// update game start cursor
		patchGroup.add([ 0x6F ], 0x316D);
		patchGroup.add([ 0x88 ], 0x1C3CF);

		// add seed icons to game start screen
		const oam = [];
		const x = 0x48;
		for (let i = 0; i < 5; i++) {
			// y, tile id, attributes, x
			oam.push(0x98, ICONS[randomInt(rng, 0, ICONS.length - 1)], 0x00, x + (i * 0x1A));
		}
		const oamLoc = modBytes(patchGroup.name, oam, bank[0]);
		modSubroutine(patchGroup.name, path.join(__dirname, 'asm', 'seed-icons.asm'), bank[0], {
			invoke: {
				romLoc: 0x1C37C
			},
			values : {
				oamLoc: oamLoc.ram.toString(16)
			}
		});

		// update palette for seed icons
		patchGroup.add([ 0x0F, 0x12, 0x30, 0x16 ], 0x1CA9F);
	}
};
