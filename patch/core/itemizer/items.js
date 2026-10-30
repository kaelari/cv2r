const path = require('path');
const { assemble, bank, utils: { randomInt, modSubroutine } } = require('../../../lib');

let items = module.exports = [];

//Whips will function all the same since they are progressive but could in theory be used for logic.

const ITEM_COUNT_ORDER = [
	'thorn whip',
	'chain whip',
	'morning star',
	'flame whip',
	'dagger',
	'silver knife',
	'golden knife',
	'holy water',
	'diamond',
	'sacred flame',
	'oak stake',
	'rib',
	'heart',
	'eyeball',
	'nail',
	'ring',
	'white crystal',
	'blue crystal',
	'red crystal',
	'silk bag',
	'magic cross',
	'garlic',
	'laurels',
	'fangs',
	'clue'
];
var MAX_ITEM_LOCATIONS =32;

if (global.uc){ 
    MAX_ITEM_LOCATIONS = 45;    
}
function getWhips(opts) {
	if (opts.world){
		//we're multiworld
		var object = [];
		opts.worlddata.filter( i => i.type=='whip' && i.world == opts.world).forEach(i => {
			object.push(i);
		});
			
		return object;
	}
	return [
		// { name: 'leather whip', value: 0x00, icon: 0x5B },
		{ name: 'thorn whip', type: 'whip', value: 0x01, icon: 0x5B, count:1, bankCode: [] },
		{ name: 'chain whip', type: 'whip', value: 0x02, icon: 0x5B, count:1, bankCode: [] },
		{ name: 'morning star', type: 'whip', value: 0x03, icon: 0x5B, count:1, bankCode: [] },
		{ name: 'flame whip', type: 'whip', value: 0x04, icon: 0x5B, count:1, bankCode: [] }
	];
}

function getWeapons(opts) {
	if (opts.world){
		//we're multiworld
		var object = [];
		opts.worlddata.filter( i => i.type=='weapon' && i.world == opts.world).forEach(i => {
						object.push(i);
		});
			
		return object;
	}
	return [
		{ name: 'dagger', type: 'weapon', value: 0x01, icon: 0x54, count:1, price: 50 },
		{ name: 'silver knife', type: 'weapon', value: 0x02, icon: 0x55, count:1, price: 50 },
		{ name: 'golden knife', type: 'weapon', value: 0x04, icon: 0x6F, count:1, price: 125 },
		{ name: 'holy water', type: 'weapon', value: 0x08, icon: 0x57, count:1, price: 50 },
		{ name: 'diamond', type: 'weapon', value: 0x10, icon: 0x70, count:1, price: 50 },
		{ name: 'sacred flame', type: 'weapon', value: 0x20, icon: 0x69, count:1, price: 75 },
		{ name: 'oak stake', type: 'weapon', value: 0x40, icon: 0x59, price: 50, count: 5 }
	];
}

function getInventory(opts) {
	if (opts.world){
		//we're multiworld
		var object = [];
		opts.worlddata.filter( i => i.type=='inventory' && i.world == opts.world).forEach(i => {
			
			object.push(i);
		});
			
		return object;
	}
	return [
		{ name: 'rib', type: 'inventory', value: 0x01, icon: 0x4E, count:1, dracPart: true },
		{ name: 'heart', type: 'inventory', value: 0x02, icon: 0x4F, count:1, dracPart: true },
		{ name: 'eyeball', type: 'inventory', value: 0x04, icon: 0x50, count:1, dracPart: true },
		{ name: 'nail', type: 'inventory', value: 0x08, icon: 0x51, count:1, dracPart: true },
		{ name: 'ring', type: 'inventory', value: 0x10, icon: 0x52, count:1, dracPart: true },
		{ name: 'white crystal', type: 'inventory', value: 0x20, icon: 0x5E, crystal: true, count:1, bankCode: [] },
		{ name: 'blue crystal', type: 'inventory', value: 0x40, icon: 0x6E, crystal: true, count:1, bankCode: [] },
		{ name: 'red crystal', type: 'inventory', value: 0x60, icon: 0x5F, crystal: true, count:1, bankCode: [] }
	];
}

function getCarry(hasFangs= false, opts) {
	if (opts.world){
		//we're multiworld
		var object = [];
		opts.worlddata.filter( i => i.type=='carry' && i.world == opts.world).forEach(i => {
			if (i.count >1 ){
				i.count = 1;
				
			}
			
			object.push(i);
		});
			
		return object;
	}
	
	
	let carryItems = [
		{ name: 'silk bag', type: 'carry', value: 0x01, icon: 0x5C, count:1, price: 100 },
		{ name: 'magic cross', type: 'carry', value: 0x02, icon: 0x5A, count:1, price: 100 },
		{ name: 'garlic', type: 'carry', value: 0x08, icon: 0x6D, price: 50, count: 2, bankCode: [], freeBankCode: [] }
	];
    
    
    
    
	if (hasFangs && !global.uc) {
		carryItems.push(
			{ name: 'laurels', type: 'carry', value: 0x04, icon: 0x58, price: 50, count: 4, bankCode: [], freeBankCode: [] },
		);
	} else {
		carryItems.push(
			{ name: 'laurels', type: 'carry', value: 0x04, icon: 0x58, price: 50, count: 5, bankCode: [], freeBankCode: [] }
		);
 		
	}
    if (hasFangs) {
		carryItems.push(
			{ name: 'fangs', type: 'carry', value: 0x10, icon: 0x4D, price: 100, count: 1 }
		);
	} else {
    
        carryItems.push(
			{ name: 'fangs', type: 'carry', value: 0x10, icon: 0x4D, price: 100, count: 0 }
		);
    }
    
    const clueDefault = global.uc
		? (hasFangs ? 12 : 13)
		: 0;

	carryItems.push({
		name: 'clue',
		type: 'carry',
		value: 0x00,
		icon: 0x4D,
		price: 0,
		count: clueDefault,
		bankCode: []
	});
    
    
	return carryItems;
    
    
    
    
	return carryItems;
}

items.allItems = function () {
    const foo = [...getWhips(), ...getWeapons(), ...getInventory(), ...getCarry()];
    
	return foo;
};

items.initItems = function initItems(pm, rng, opts) {
	const { hasFangs = false } = opts;
	const bankIndexes = [1, 3];
	
	// "value" property refers to the value set at 0x0434 (RAM) when you own a whip
	const whips = getWhips(opts);
	bankIndexes.forEach(bankIndex => {
		if (opts.multiworld){
			whips.forEach(whip => {
				var values = {};
				values.ram = 0x434;
				if (opts.world && opts.world != whip.destworld){
					values.ram = 0x7000 + (whip.destworld*10);
				}	
				const file = path.join(__dirname, 'asm', 'mwwhip.asm');
				const loc = modSubroutine(pm.name, file, bank[bankIndex], { values});
				whip.bankCode[bankIndex] = `
JSR $${loc.ram.toString(16)}
`;
			});
		}else {
            
			const file = path.join(__dirname, 'asm', 'whip.asm');
            var levelup="";
            if (global.pacifist === 1) {
                    
                    levelup = `INC $8B
LDA $8b
AND #$1
BNE heal
LDA #$16
ADC $81
STA $81

heal
LDA $81
STA $80
`;
                }
			const loc = modSubroutine(pm.name, file, bank[bankIndex], {
                values: {
                    levelup: levelup
                    
                }
            });
			whips.forEach(whip => {
			whip.bankCode[bankIndex] = `
JSR $${loc.ram.toString(16)}
`;
		});
		}
	});
	whips.forEach(w => {
		w.whip = true;
		if (opts.world && opts.world != w.destworld){
			w.memory = 0x7000 + (w.destworld*10);
			w.text = 'How \'bout\na whip for '+w.destworld+'?';
		}else {
			w.memory = 0x434;
			w.text = 'How \'bout\na whip?';
		}
		
		w.price = 125; //randomInt(rng, 100, 150);
	});

	// "value" property refers to the value added to 0x004A (RAM) when you own a weapon
	const weapons = getWeapons(opts);
	weapons.forEach(w => {
		w.weapon = true;
		if (opts.world && opts.world != w.destworld){
			w.memory = 0x7001 + (w.destworld*10);
			w.code = `
LDA $${w.memory.toString(16)}
ORA #$${w.value.toString(16)}
STA $${w.memory.toString(16)}
`;
			w.text = w.name+w.destworld;
		}else {
			w.memory = 0x4A;
			w.code = `
LDA *$${w.memory.toString(16)}
ORA #$${w.value.toString(16)}
STA *$${w.memory.toString(16)}
`;
			w.text = w.name;
		}

		w.codeBytes = assemble(w.code);
		
	});

	// "value" property refers to the value added to 0x0091 (RAM) when you own an item
	const inventory = getInventory(opts);
	bankIndexes.forEach(bankIndex => {
		
		if (opts.multiworld){
			inventory.filter(i => i.crystal).forEach(crystal => {
				
				if (opts.world && opts.world != crystal.destworld){
					//not our world!
					crystal.memory = 0x7002 + (crystal.destworld*10);
					const values = {}
					values.ram = crystal.memory.toString(16);
					const file = path.join(__dirname, 'asm', 'mwcrystal.asm');
					const loc = modSubroutine(pm.name, file, bank[bankIndex], { values } );
					crystal.bankCode[bankIndex] = `
JSR $${loc.ram.toString(16)}
`;
					crystal.text = 'want a\ncrystal'+crystal.destworld+'?';
				}else {
					crystal.memory = 0x91;
					
					const file = path.join(__dirname, 'asm', 'crystal.asm');
					const loc = modSubroutine(pm.name, file, bank[bankIndex] );
					crystal.bankCode[bankIndex] = `
JSR $${loc.ram.toString(16)}
`;
					
					crystal.text = 'want a\ncrystal?';	
				}
				
			})
		}else {
			
			const file = path.join(__dirname, 'asm', 'crystal.asm');
			const loc = modSubroutine(pm.name, file, bank[bankIndex]);
			inventory.filter(i => i.crystal).forEach(crystal => {
				crystal.bankCode[bankIndex] = `
JSR $${loc.ram.toString(16)}
	`;
			crystal.text = 'want a\ncrystal?';
			});
		}
	});

	inventory.forEach(i => {
		i.price = i.crystal ? 75 : 100;
		if (i.dracPart) {
			if (opts.world && opts.world != i.destworld){
				i.memory = 0x7002 + (i.destworld*10);
				i.code = `
LDA $${i.memory.toString(16)}
ORA #$${i.value.toString(16)}
STA $${i.memory.toString(16)}
`;
				i.text = i.name+i.destworld;
			}else {
				i.memory = 0x91;
				i.code = `
LDA *$${i.memory.toString(16)}
ORA #$${i.value.toString(16)}
STA *$${i.memory.toString(16)}
`;
				i.text = i.name;
			}
			i.codeBytes = assemble(i.code);
			
		}
	});

	// "value" property refers to the value added to 0x0092 (RAM) when you own an item
	const carry = getCarry(hasFangs, opts);

	// TODO: can this be optimized for garlic and laurels to share?
	// write subroutines to handle garlic and laurels since they require more logic
	// than the other items in the game and would unnecessarily chew up rom space
	const carryValues = [
		{ memory: '4C', value: 0x04 },
		{ memory: '4D', value: 0x08 }
	];
	bankIndexes.forEach(bankIndex => {
		if (opts.multiworld){
			carry.forEach(c => {
				if (c.value < 0x04 || c.value === 0x10){
					return;
				}
				
				if (c.destworld == opts.world){
					var values=carryValues[0];
					if (c.value == 0x08){
						var values=carryValues[1];
					}
					const file = path.join(__dirname, 'asm', 'carry.asm');
					
					const loc = modSubroutine(pm.name, file, bank[bankIndex],  { values } );
					c.bankCode[bankIndex] = `
JSR $${loc.ram.toString(16)}
`;

					const file2 = path.join(__dirname, 'asm', 'carry_free.asm');
					const loc2 = modSubroutine(pm.name, file2, bank[bankIndex],  { values } );
			
					c.freeBankCode[bankIndex] = `
JSR $${loc2.ram.toString(16)}
`;
					
				}else {
					var ram = 0x7004+(c.destworld*10);
					if (c.value === 0x08){
						ram+=1;
					}
					const values = {}
					values.memory = ram.toString(16);
					
					const file = path.join(__dirname, 'asm', 'mwcarry.asm');
					const loc = modSubroutine(pm.name, file, bank[bankIndex], { values });
					
					c.bankCode[bankIndex] = `
JSR $${loc.ram.toString(16)}
`;
					c.freeBankCode[bankIndex] = c.bankCode[bankIndex];
					
					
					
				}
			});
			
		}else {
			carryValues.forEach(values => {
				const file = path.join(__dirname, 'asm', 'carry.asm');
				const loc = modSubroutine(pm.name, file, bank[bankIndex], { values });
				const item = carry.find(c => c.value === values.value);
				item.bankCode[bankIndex] = `
JSR $${loc.ram.toString(16)}
`;
				const file2 = path.join(__dirname, 'asm', 'carry_free.asm');
				const loc2 = modSubroutine(pm.name, file2, bank[bankIndex], { values });
			
				item.freeBankCode[bankIndex] = `
JSR $${loc2.ram.toString(16)}
`;
			});
		}
			
	});
    
	// back to normal item handling, but only generating code for silk bag and cross
	carry.forEach(c => {
		if (c.value < 0x04 || c.value === 0x10) {
			
            if (opts.world && (opts.world != c.destworld)){
				
				c.memory = 0x7003 + (c.destworld*10);
				c.code = `
LDA $${c.memory.toString(16)}
ORA #$${c.value.toString(16)}
STA $${c.memory.toString(16)}
	`;
			}else {
            
            c.memory = 0x92;
			c.code = `
LDA *$${c.memory.toString(16)}
ORA #$${c.value.toString(16)}
STA *$${c.memory.toString(16)}
	`;
			}
			if (c.name === 'fangs') {
				c.code += `
LDA #$05
STA *$31
				`;
			}
			c.codeBytes = assemble(c.code);
		}
		if (c.name != "clue"){
			if (opts.world != c.destworld) {
				c.text = c.name+c.destworld;
			}else {
				c.text = c.name;
			}
		}
		
	});

	// add all processed items to the exported array
	var allItems = [
	...whips,
	...weapons,
	...inventory,
	...carry
];

allItems = applyItemCounts(allItems, opts.itemCounts);

items.push(...allItems);
};

function applyItemCounts(itemList, counts) {
	if (!counts || !Array.isArray(counts)) {
        
		return itemList;
	}

	if (counts.length !== ITEM_COUNT_ORDER.length) {
		throw new Error(
			`--item-counts requires exactly ${ITEM_COUNT_ORDER.length} values ` +
			`in this order:\n${ITEM_COUNT_ORDER.join(', ')}`
		);
	}

	const requested = {};

	ITEM_COUNT_ORDER.forEach((name, index) => {
		const count = counts[index];

		if (!Number.isInteger(count) || count < 0) {
			throw new Error(
				`Invalid count for "${name}": ${counts[index]}. ` +
				`Counts must be non-negative integers.`
			);
		}

		requested[name] = count;
	});

	// Apply the requested counts by NAME rather than array position.
	itemList.forEach(item => {
		if (Object.prototype.hasOwnProperty.call(requested, item.name)) {
			item.count = requested[item.name];
		}
	});

	// Remove items explicitly set to zero.
	let result = itemList.filter(item => {
		return item.count !== 0;
	});

	// Calculate the actual number of copies in the pool.
	let total = result.reduce((sum, item) => {
		return sum + (item.count ?? 1);
	}, 0);

	// Too many items means this configuration can never fit.
	if (total > MAX_ITEM_LOCATIONS) {
		throw new Error(
			`--item-counts produces ${total} items, but there are only ` +
			`${MAX_ITEM_LOCATIONS} item locations.`
		);
	}

	// Fill unused locations with clues.
	const clueCount = MAX_ITEM_LOCATIONS - total;

	if (clueCount > 0) {
		let clue = result.find(item => item.name === 'clue');
        
        
		if (!clue) {
            
            let clueoriginal = itemList.find(item => item.name === 'clue');
            
			clueoriginal.count = clueCount;

			result.push(clueoriginal);
		} else {
            
			clue.count = (clue.count ?? 0) + clueCount;
		}
	}
    
	return result;
}
