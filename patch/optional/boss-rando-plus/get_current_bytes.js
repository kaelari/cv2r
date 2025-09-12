// 2025 OranjSkueez, have fun.
// This builds the "current" state of a requested byte range.
// We start with the vanilla rom data, then iterate through all
// already-loaded patches for overlap into our byte range,
// and update our working copy, then return it.

const pm = require('../../../lib/patch-manager');


////////////////
// main func
exports.get_current_bytes = function(targoffset, defaultbytes) {

workingbytes = defaultbytes;  // must be supplied since we can't read the rom here.
targbytelen = defaultbytes.length;

//console.log("searching targoffset ("+targoffset+")");
pm.order.forEach(category => {
	//console.log("category "+category);
	pm[category].forEach( (entry, entryindex) => {
		//console.log(entryindex + " : "+Object.keys(entry));

		Object.keys(entry).forEach(offset => {
			skip = false;
			//console.log(parseInt(offset).toString(16)+" : "+entry[offset]);
			const bytes = entry[offset];
			const byteslen = bytes.length;
			offsetint = parseInt(offset);

			// find overlapping indexes between target bytes, and each patch.
			if(targbytelen == 0
			|| byteslen == 0
			|| bytes[0] == "copy"
			|| targoffset >= offsetint + byteslen
			|| targoffset + targbytelen <= offsetint) {
				skip = true; // no overlap.
			}
			if(!skip) {
				//console.log("found overlap: targ("+targoffset+") offset("+offsetint+")");
				// local offset of each patch relative to target bytes
				ephemeralpatchoffset = offsetint - targoffset;

				// i = source(patch) index;  j = dest(working) index
				if(ephemeralpatchoffset < 0) {
					// if e < 0 then start at i=-offset, j=0
					i = -ephemeralpatchoffset;
					j = 0;
				} else {
					// else start at i=0, j=offset
					i = 0;
					j = ephemeralpatchoffset;
				}
				while(i<byteslen && j<targbytelen) {
					workingbytes[j] = bytes[i];
					++i;
					++j;
				}
			}
		});
	});
});

return workingbytes;
}
// end func
/////////////

