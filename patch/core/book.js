const wrap = require('word-wrap');
const { core, utils: { log, shuffleArray, textToBytes } } = require('../../lib');
const ITEM_WRAP = {};

// ----------------------
// Item grammar
// ----------------------
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

ITEM_WRAP.laurels = { prefix: 'some', suffix: 'are' };
ITEM_WRAP.garlic = { prefix: 'some', suffix: 'is' };
ITEM_WRAP.fangs = { prefix: 'the', suffix: 'are' };
ITEM_WRAP.clue = { prefix: 'a', suffix: 'is' };

function preWrap(item) {
    if (!ITEM_WRAP[item]) return item;
    return `${ITEM_WRAP[item].prefix} ${item}`;
}

function fullWrap(item) {
    if (!ITEM_WRAP[item]) return item;
    return `${ITEM_WRAP[item].prefix} ${item} ${ITEM_WRAP[item].suffix}`;
}

// ----------------------
// Patch function
// ----------------------
module.exports = {
    patch: function (pm, opts) {
        const { rng } = opts;
        let clues = [];
        const isDoorRando = !!global.doorSpoiler;
        const isBossRando = !!global.bossRando;

        // ----------------------
        // Build clues
        // ----------------------
        global.spoiler.forEach(spoil => {
            let [item, actor, location, entryRoom] = spoil;

            if (location.includes('Jova')) return;

            const fullLocation = location;

            // normalize location
            location = location.replace(/-.*/, '');
            location = location.replace(/\(.*/, '');
            location = location.replace(/ ?mansion/i, '');
            location = location.trim();

            // normalize item names
            if (item.includes('whip') || item.includes('morning star')) {
                item = 'whip';
            } else if (item.includes('crystal')) {
                item = 'crystal';
            }

            let text = null;

            // clue text logic
            if (actor === 'Death') {
                text = isBossRando
                    ? `A boss in Brahms guards ${preWrap(item)}`
                    : `Death guards ${preWrap(item)}`;
            } else if (actor === 'Camilla') {
                text = isBossRando
                    ? `A boss in Laruba defends ${preWrap(item)}`
                    : `Camilla defends ${preWrap(item)}`;
            } else if (actor === 'merchant') {
                if (isDoorRando) {
                    const sp = global.doorSpoiler.find(
                        s => s[1] === entryRoom || s[1] === fullLocation
                    );
                    if (!sp) {
                        text = `${fullWrap(item)} for sale in ${location}`;
                    } else {
                        const door = sp[0].substring(0, sp[0].indexOf(' '));
                        text = `Enter a door at ${door} to buy ${item}`;
                    }
                } else {
                    text = `${fullWrap(item)} for sale in ${location}`;
                }
            } else if (actor === 'sacred flame') {
                text = `${fullWrap(item)} hidden on Dabi's Path`;
            } else if (actor === 'orb') {
                text = `${fullWrap(item)} sealed in ${location}'s orb`;
            } else if (actor === 'crystal dude') {
                text = `${fullWrap(item)} free in ${location}`;
            } else if (actor === 'secret merchant') {
                if (location.includes('Storigoi')) {
                    text = `graveyard duck has ${preWrap(item)}`;
                } else {
                    text = `garlic needed to get ${preWrap(item)}`;
                }
            } else if (actor === 'book') {
                text = `${fullWrap(item)} in a book in ${location}`;
            }

            if (text) {
                clues.push({
                    text,
                    item,
                    actor,
                    location: fullLocation,
                    shortLocation: location
                });
            }
        });

        // ----------------------
        // Wrap text + find shortest
        // ----------------------
        let shortest = 100;
        for (let i = 0; i < clues.length; i++) {
            clues[i].text = wrap(clues[i].text, {
                indent: '',
                trim: true,
                width: 13
            });
            shortest =
                clues[i].text.length < shortest
                    ? clues[i].text.length
                    : shortest;
        }

        shuffleArray(clues, rng);

        log('', true);
        log('Book Clues', true);
        log('----------', true);

        // ----------------------
        // Place clues
        // ----------------------
        core.forEach(loc => {
            if (!loc.actors) return;

            loc.actors.filter(a => a.itemName === 'clue').forEach(a => {
                let index = 0;
                let maxlength = a.text.length;
                if (maxlength < shortest) {
                    maxlength = shortest;
                }

                // find a clue that fits AND is not self-referencing
                while (
                    clues[index] &&
                    (clues[index].text.length > maxlength ||
                        clues[index].location === loc.name)
                ) {
                    index++;
                }

                if (!clues[index]) return; // no valid clue available

                let chosen = clues[index].text.trim();

                if (maxlength === shortest) {
                    maxlength = a.text.length;
                }

                if (chosen.length > maxlength) {
                    chosen = chosen.slice(0, maxlength - 1);
                }

                log(`[${a.text.length}] ${a.text.replace(/\n/g, ' ')}`, true);
                log(`[${chosen.length}] ${chosen.replace(/\n/g, ' ')}`, true);
                log('---', true);

                const textBytes = textToBytes(chosen);
                pm.add(textBytes, a.textPointer);
                a.text = chosen;
                a.hasclue= clues[index];
                // remove used clue
                clues.splice(index, 1);

                // recompute shortest
                shortest = clues.reduce(
                    (min, c) => Math.min(min, c.text.length),
                    1000
                );
            });
        });
    }
};
