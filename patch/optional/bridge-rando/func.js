const path = require('path');
const { assemble, bank, utils: { shuffleArray, textToHexString, textToBytes, randomInt, modSubroutine  } } = require('../../../lib');
module.exports = {
    bin2array: function bin2array(input) {
        const result = [];
        for (i = 0; i < input.length; i++)
        {
            result[i] = input.substr(i, 1);
        }

        return result;
    },

    dec2bin: function dec2bin(input) {
        return ("00000000" + (parseInt(input, 10)).toString(2)).substr(-8);
    },

    bin2dec: function bin2dec(input) {
        return parseInt(input, 10);
    },
    
    generateClue: function generateClue(rng, pm, text, textPointer) {
        
        var randActor = randomInt(rng, 0, textPointer.length-1);
        
        var hText = text;
        pm.add(textToBytes(hText, 1), textPointer[randActor].textPointer);
        textPointer[randActor].dontChange = true;
        textPointer.splice(randActor, 1);
        
        shuffleArray(textPointer, rng);
        //console.log("Added: " + text + " 0x" + textPointer[randActor].toString(16) + "\n");
    },
    
    
    generateClueold: function generateClueold(rng, pm, text, textPointer) {
        var randActor = randomInt(rng, 0, textPointer.length-1);
        var hText = text;
        pm.add(textToBytes(hText, 1), textPointer[randActor]);
        
        
        textPointer.splice(randActor, 1);

        shuffleArray(textPointer, rng);
        //console.log("Added: " + text + " 0x" + textPointer[randActor].toString(16) + "\n");
    }
};
