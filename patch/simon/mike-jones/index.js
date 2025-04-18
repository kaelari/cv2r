// 2025 OranjSkueez, have fun.
// version 1.1 - fixed false matches resulting in corrupted monster placement in Laruba.

// This dynamically extends the mike-jones.json sprite
// to change all "whip" references to "yoyo".
// It depends on the simon sprite patch executing last,
// (after dynamic dialog has been populated)

const pm = require('../../../lib/patch-manager');

// vanilla "whip" string offsets (excluding menu) to replace, if not already from randomizer.
// 0xd26b  buy a thorn whip
// 0xd282  purchase a chain whip
// 0xd46c  man living in darkness
const stockwhips = [0xd26b, 0xd282, 0xd46c];
// rom byte representation of "whip"
const whipbytes = [0x17, 0x08, 0x09, 0x10];
// rom byte representation of "yoyo"
const yoyobytes = [0x19, 0x0f, 0x19, 0x0f];

// basis of module.exports content
struc = require('./mike-jones.json');
patbase = struc.patch;


////////////////
// main struc.patch generation func
function f(a, opts) {

// internal func: find all "whip" sub-offsets within a bytelist
function findoffsetsofwhip(bytes)
{
	ret = [];
	idx = bytes.indexOf(whipbytes[0]);
	while(idx != -1) {
		//console.log("found candidate " + idx);
		// check the rest of string

		// Note: Array.every() assumes truncated entries match everything.
		//       I guess mathemeticians are insane.
		slic = bytes.slice(idx, idx+4);
		if(slic.length == 4 && slic.every( (e, i) => e == whipbytes[i] )) {
			//console.log("found whip " + idx);
			ret.push(idx);
		}
		idx = bytes.indexOf(whipbytes[0], idx+1);
	}
	return ret;
}

// offsets, remove each if already overwritten in another patch.
vanillawhips = stockwhips;

pm.order.forEach(category => {
	//console.log("category "+category);
	pm[category].forEach( (entry, entryindex) => {
		//console.log(entryindex + " : "+Object.keys(entry));

		Object.keys(entry).forEach(offset => {
			//console.log(parseInt(offset).toString(16)+" : "+entry[offset]);
			const bytes = entry[offset];
			offsetint = parseInt(offset);

			// if loc coincides with vanillawhips, remove that offset from vanillawhips
			vanillawhips.forEach( (loc, i) => {
				if(loc >= offsetint && loc < offsetint + bytes.length) {
					vanillawhips[i] = null;
				}
			});

			if (bytes[0] !== 'copy') {
				// find inner offset(s) of "whip"
				whips = findoffsetsofwhip(bytes);
				// if found:
				whips.forEach(o => {
					o = parseInt(o);
					//console.log("found whip 0x" + (offsetint + o).toString(16).padStart(6, '0'));

					// replace "whip" with "yoyo" in already-generated patches
					pm[category][entryindex][offset][o] = yoyobytes[0];
					pm[category][entryindex][offset][o+1] = yoyobytes[1];
					pm[category][entryindex][offset][o+2] = yoyobytes[2];
					pm[category][entryindex][offset][o+3] = yoyobytes[3];
				});
			}

		});
	});
});

vanillawhips = vanillawhips.filter((x) => x != null);
mypats = vanillawhips.map( (x) => ({"offset": x, "bytes": yoyobytes}) );
// append menu whip strings here.
//x1f212 l. whip
//x1f21a t. whip
//x1f222 c. whip
//x1f22a m. star
//x1f232 f. whip
mypats = mypats.concat( [
	// is.yoyo = island yoyo
	{"offset": 0x1f212, "bytes": [0x09, 0x13, 0x1b].concat(yoyobytes) },
	// ex.yoyo = extended yoyo
	{"offset": 0x1f21a, "bytes": [0x05, 0x18, 0x1b].concat(yoyobytes)},
	// ch.yoyo = chain yoyo
	{"offset": 0x1f222, "bytes": [0x03, 0x08, 0x1b].concat(yoyobytes)},
	// sh.star = shooting star
	{"offset": 0x1f22a, "bytes": [0x13, 0x08, 0x1b, 0x13, 0x14, 0x01, 0x12] },
	// fl.yoyo = flaming yoyo
	{"offset": 0x1f232, "bytes": [0x06, 0x0c, 0x1b].concat(yoyobytes)}
] );

mypats = mypats.concat(patbase);
mypats.forEach( (x) => pm["simon"].add(x["bytes"], x["offset"]) );


}
// end struc.patch generation func
////////////////


struc.patch = f;
module.exports = struc;

