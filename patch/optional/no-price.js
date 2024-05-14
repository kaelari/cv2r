// random prices
// merchant prices will be +/-25% based on the base price in lib/patch/itemizer/items.js
module.exports = {
	id: 'no-price',
	name: 'no-price',
	description: 'Everything is Free',
	//qol, random, difficulty, misc
	type: 'random',
    character: '6',
	patch: function(pm, opts) {
		const { core, utils: { randomDecimal } } = require('../../lib');
		const { rng } = opts;

		core.forEach(loc => {
			if (!loc.actors) { return; }
			loc.actors.filter(a => a.sale).forEach(merchant => {
				price =0;
				merchant.sale = [ merchant.sale[0], 0, 0 ];
				pm.add(merchant.sale, merchant.salePointer);
			});
		});
	}
};
