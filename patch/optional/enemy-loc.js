module.exports = {
    pre: true,
    order: 111,
    id: 'enemy-loc',
    name: 'Enemy location Randomizer',
    description: 'Randomize enemy locations (table rebuild)',
    type: 'random',
    character: 'ELC',

    patch: function(pm, opts) {
        const { core, utils: { randomInt } } = require('../../lib');
        const { rng } = opts;

        
        
        var maxdist = opts.config.dist || 8;
        
        core.forEach(loc => {
            if (!loc.actors) return;
            if (!loc.actors[0]) return;
                     
            const actors = [...loc.actors];
            const blockedX = new Set(
                actors
                    .filter(a => !(a.enemy && !a.boss)) // everything NOT a movable enemy
                    .map(a => a.x)
            );
            const MIN_X = actors.at(0).x;
            const MAX_X = actors.at(-1).x; //can't go right from the last enemy to ensure no one goes off screen
            
            // 🔒 Track used X values
            const usedX = new Set();

            // 🎯 Step 1: assign new X values
            actors.forEach(actor => {

    let newX;

    if (actor.enemy && !actor.boss && !actor.nospider) {
        let min = Math.max(MIN_X, actor.x - maxdist);
        let max = Math.min(MAX_X, actor.x + maxdist);

        let attempts = 0;
        do {
            newX = randomInt(rng, min, max);
            attempts++;
        } while (
            (usedX.has(newX) || blockedX.has(newX)) &&
            attempts < 50
        );

        // 🔥 fallback if boxed in
        if (usedX.has(newX) || blockedX.has(newX)) {
            for (let x = min; x <= max; x++) {
                if (!usedX.has(x) && !blockedX.has(x)) {
                    newX = x;
                    break;
                }
            }
        }

    } else {
        // NPCs stay EXACTLY where they are
        newX = actor.x;
    }

    usedX.add(newX);
    actor.newX = newX;
});
            let ptr = actors[0].pointer;
            // 🔑 Step 2: sort by new X
            actors.sort((a, b) => a.newX - b.newX);

            // 🧪 Optional sanity check
            
            actors.forEach(actor => {
                pm.add([actor.newX, actor.y, actor.id, actor.data], ptr);
                actor.pointer = ptr;
                ptr += 4;
            });
            

        });
    }
};
