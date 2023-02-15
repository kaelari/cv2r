const wrap = require('word-wrap');
const { core, utils: { log, shuffleArray, textToBytes } } = require('../../lib');
const ITEM_WRAP = {};

[
	'dagger',
	'silver knife',
	'golden knife',
	'holy water',
	'diamond',
	'sacred flame',
	'rib',
	'heart',
	'eyeball',
	'nail',
	'ring',
	'silk bag',
	'magic cross'
].forEach(item => {
	ITEM_WRAP[item] = {
		prefix: 'the',
		suffix: 'is'
	};
});

[
	'crystal',
	'oak stake',
	'whip'
].forEach(item => {
	ITEM_WRAP[item] = {
		prefix: item === 'oak stake' ? 'an' : 'a',
		suffix: 'is'
	};
});

ITEM_WRAP.laurels = {
	prefix: 'some',
	suffix: 'are'
};

ITEM_WRAP.garlic = {
	prefix: 'some',
	suffix: 'is'
};

ITEM_WRAP.fangs = {
	prefix: 'the',
	suffix: 'are'
};
ITEM_WRAP.clue = {
	prefix: 'a',
	suffix: 'is'
	
}
function preWrap(item) {
	return `${ITEM_WRAP[item].prefix} ${item}`;
}

function fullWrap(item) {
	return `${ITEM_WRAP[item].prefix} ${item} ${ITEM_WRAP[item].suffix}`;
}

module.exports = {
	patch: function (pm, opts) {
		const { rng } = opts;
		const clues = [];
		const isDoorRando = !!global.doorSpoiler;

		global.spoiler.forEach(spoil => {
			let [item, actor, location, entryRoom] = spoil;
			
			// don't leave clues for jova
			if (location.includes('Jova')) { return; }
			
			const fulllocation = location;
			
			// remove location descriptors
			location = location.replace(/-.*/, '');

			// remove parenthesized text from location
			location = location.replace(/\(.*/, '');

			// remove some text qualifiers to make messages shorter
			location = location.replace(/ ?mansion/i, '');
			location = location.trim();

			// normalize whip and crystal text
			if (item.includes('whip') || item.includes('morning star')) {
				item = 'whip';
			} else if (item.includes('crystal')) {
				item = 'crystal';
			}

			// set clue text based on actor type
			if (actor === 'Death') {
				clues.push(`Death guards ${preWrap(item)}`);
			} else if (actor === 'Camilla') {
				clues.push(`Camilla defends ${preWrap(item)}`);

			} else if (actor === 'merchant') {
				if (isDoorRando) {
					const sp = global.doorSpoiler.find(s => s[1] === entryRoom || s[1] ===fulllocation );
					if (!sp) {
						clues.push(`${fullWrap(item)} for sale in ${location}`);
						
					} else {
						const door = sp[0].substring(0, sp[0].indexOf(' '));
						clues.push(`Enter a door at ${door} to buy ${item}`);
					}
				} else {
					clues.push(`${fullWrap(item)} for sale in ${location}`);
				}
			} else if (actor === 'sacred flame') {
				clues.push(`${fullWrap(item)} hidden on Dabi's Path`);
			} else if (actor === 'orb') {
				clues.push(`${fullWrap(item)} sealed in ${location}'s orb`);
			} else if (actor === 'crystal dude') {
				clues.push(`${fullWrap(item)} free in ${location}`);
			} else if (actor === 'secret merchant') {
				if (location.includes('Storigoi')) {
					clues.push(`graveyard duck has ${preWrap(item)}`);
				} else {
					clues.push(`garlic needed to get ${preWrap(item)}`);
				}
			} else {
				// we didn't match any actor?! what's going on here
				return;

			}
		});

		let shortest = 100;
		for (let i = 0; i < clues.length; i++) {
			clues[i] = wrap(clues[i], { indent: '', trim: true, width: 13 });
			shortest = clues[i].length < shortest ? clues[i].length : shortest;
		}

		shuffleArray(clues, rng);
		log('', true);
		log('Book Clues', true);
		log('----------', true);
		core.forEach(loc => {
			if (!loc.actors) { return; }
			
			loc.actors.filter(a => (a.fixture && a.name === 'book') || (a.itemName == "clue")).forEach(a => {
				
				let index = 0;
				let maxlength = a.text.length;
				if (maxlength < shortest) {
					// we shorter than the shortest clue, this probably should never happen, we'll truncate later. set this so we'll match the shortest clue
					maxlength = shortest;
				}
				while (clues[index] != null && clues[index].length > maxlength) {
					
					index += 1;
				}

				if (maxlength === shortest) {
					// set this back and then we'll truncate
					maxlength = a.text.length;
				}

				clues[index] = clues[index].trim();

				// make sure new text does not exceed the text it is replacing
				if (clues[index].length > maxlength) {
					if (clues[index].length > maxlength) {
						
						clues[index] = clues[index].slice(0, maxlength - 1);
					}
				}

				log(`[${a.text.length}] ` + a.text.replace(/\n/g, ' '), true);
				log(`[${clues[index].length}] ` + clues[index].replace(/\n/g, ' '), true);
				log('---', true);

				const textBytes = textToBytes(clues[index]);
				pm.add(textBytes, a.textPointer);
				a.text = clues[index];
				// delete so we don't give the same clue twice
				clues.splice(index, 1);
				shortest = 1000;
				for (let i = 0; i < clues.length; i++) {
					shortest = clues[i].length < shortest ? clues[i].length : shortest;
					
				}
			});
		});
// 		var i=0;
// 		core.forEach(loc => {
// 			if (!loc.actors) { return; }
// 			loc.actors.forEach(actor => {	
// 				if (!actor.textPointer) { return; }
// 				const item = actor.itemName;
// 				if (item === "clue"){
// 					
// 					const text = clues[i];
// 					const textBytes = textToBytes(clues[i]);
// 					pm.add(textBytes, actor.textPointer);
// 					actor.text = text;
// 					i++;
// 				}
// 				
// 			});
// 		});
		
		
		
	}
};
