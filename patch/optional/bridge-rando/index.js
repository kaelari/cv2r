const path = require('path');
//const log = require('log');
const { assemble, core,  bank, utils: { shuffleArray, textToHexString, textToBytes, randomInt, modSubroutine } } = require('../../../lib');
const { bin2array, dec2bin, bin2dec, generateClue } = require('./func.js');
module.exports = {
    pre: true,
    order: 500,
	id: 'bridge-rando',
	name: 'Requirement randomizer',
	description: 'Randomizes the requirements for Dracula\'s bridge',
	//qol, random, difficulty, misc
	type: 'random',
	character: 's',
	conflicts: 'custom-text',
	patch: function (pm, opts) {
		const { rng } = opts;
		// Generate the key for QuestItems (body parts)
		// Max is 0111 1111 = 127
		//
		// bit flags (white + blue set = red crystal)
		// 0 = unused
		// 1 = blue crystal
		// 1 = white crystal
		// 1 = ring
		// 1 = nail
		// 1 = eye
		// 1 = heart
		// 1 = rib
		let QuestItems = randomInt(rng, 0, 127);
		// BUG: There is currently a bug where if the seed rolls a white crystal bridge,
		// then you can't open the bridge if you have blue crystal.
		// It works with red since both bits are set. But for blue, the white bit gets unset.
		// Easiest way to fix is probably to never roll a white crystal seed.


		// Generate the key for MiscItems (garlic, laurels, cross, silk)
		// Max is 1111 = 15
		//
		// bit flags
		// 1 = garlic
		// 1 = laurels
		// 1 = cross
		// 1 = silk bag
		let MiscItems = randomInt(rng, 0, 15);

		// Generate the key for SubItems (subweapons)
		// Max is (0011 1111) = 63 for all regular
		// or (0111 1111) = 127 if you also want oak stake in the mix
		//
		// bit flags
		// 0 = unused
		// 1 = oak stake
		// 1 = sacred flame
		// 1 = diamond
		// 1 = holy water
		// 1 = golden knife
		// 1 = silver knife
		// 1 = dagger
		let SubItems = randomInt(rng, 0, 63);

		// Invoke our custom code. It currently uses dummy values for the requirements,
		// but we will fix it later down near the end after we run some logic.
		const modsub = modSubroutine(pm.name, path.join(__dirname, 'bridge-rando.asm'), bank[1], {
			invoke: {
				// romLoc: 0x1D931
				romLoc: 0x1D67F,
			}
		});

		// Convert to binary
		var QuestItemsHex = QuestItems.toString(16);
		var MiscItemsHex = MiscItems.toString(16);
		var SubItemsHex = SubItems.toString(16);
		QuestItems = dec2bin(QuestItems);
		MiscItems = dec2bin(MiscItems);
		SubItems = dec2bin(SubItems);

		//console.log(QuestItems);
		// Loop through each digit and add to an array
		// This is so we can know which bits are set
		// and later we can use this for clues
		// also todo make a spoiler log for the requirements.
		var QuestKey = bin2array(QuestItems);
		var MiscKey = bin2array(MiscItems);
		var SubKey = bin2array(SubItems);

		// Variable to track total number of quest items required.
		var totalQuest = 0;
		var totalCrystals = 0;
		var totalMisc = 0;
		var totalSub = 0;

		// These are unused but could be used if you wanted to roll clues to a specific
		// town. For example mansion clues all in Alba.
		//var JovaPointers = [0xD2CF, 0xD3E7, 0xD41F, 0xD498, 0xD526, 0xD67B, 0xD6B0, 0xD6E2];
		//var VerosPointers = [0xD478, 0xD4FD, 0xD5D4, 0xD716, 0xD749, 0xD306];
		//var AljibaPointers = [0xD8C6, 0xD8FA, 0xD96B, 0xDA5C, 0xDBD7, 0xDB74, 0xD92B];
		//var AlbaPointers = [0xDA36, 0xDA84, 0xD7B8, 0xDAD9, 0xDB3D, 0xD9D7, 0xDBA6];
		//var OndolPointers = [0xD445, 0xD3AF, 0xD560, 0xD594, 0xD656, 0xD607];
        
        //old method
		//var AllPointers = [0xD2CF, 0xD3E7, 0xD41F, 0xD498, 0xD526, 0xD67B, 0xD6B0, 0xD6E2,
		//				   0xD478, 0xD4FD, 0xD5D4, 0xD716, 0xD749, 0xD306,
		//				   0xD8C6, 0xD8FA, 0xD96B, 0xDA5C, 0xDBD7, 0xDB74, 0xD92B,
		//				   0xDA36, 0xDA84, 0xDAB7, 0xDAD9, 0xDB3D, 0xD9D7, 0xDBA6,
		//				   0xD445, 0xD560, 0xD594, 0xD5BA, 0xD638, 0xD656, 0xD607,
		//				   0xDA08, 0xDB0F, 0xDC07,
		//				   0xD951];
        var AllPointers = [];
        core.forEach(loc => {
            if (!loc.actors){ return; }
            if (loc.name != "Jova" && loc.name != "Veros" && loc.name != "Aljiba" && loc.name != "Alba" && loc.name != "Ondol"){ return; }
            loc.actors.forEach (actor => {
                if (actor.text != null && actor.itemType == null && actor.fixture == null && (actor.name =="man" || actor.name =="woman" || actor.name == "shepherd")){
                    if (actor.textPointer == 0xD2CF){
                        
                        actor.dontChange = true;
                    }else {
                    
                        AllPointers.push(actor);
                    }
                }
            });
            
        })
        
		// Initial shuffle, will reshuffle in the generateClue function.
		shuffleArray(AllPointers, rng);

		// Quest
		if (QuestKey[1] == 1 && QuestKey[2] == 1)
		{
			//console.log("Red Crystal required.");
			totalCrystals = 3;
			generateClue(rng, pm, "-Red Crystal-\nneeded.", AllPointers);
		}
		else if (QuestKey[1] == 1 && QuestKey[2] == 0)
		{
			//console.log("Blue Crystal required.");
			totalCrystals = 2;
			generateClue(rng, pm, "-Red Crystal-\nis junk.", AllPointers);
			generateClue(rng, pm, "-Blue Crystal-\nneeded.", AllPointers);
		}
		else if (QuestKey[1] == 0 && QuestKey[2] == 1)
		{
			QuestKey[1] = "0";
			QuestKey[2] = "0";
			//QuestItemsHex = QuestKey.toString(2);
			//console.log("White Crystal required.");
			//console.log(QuestKey[1]);
			//console.log(QuestKey[2]);
			//totalCrystals = 1;

			//generateClue(rng, pm, "Red Crystal\nis\nnot needed.", AllPointers);
			//generateClue(rng, pm, "Blue Crystal\nis\nnot needed.", AllPointers);
			//generateClue(rng, pm, "White Crystal\nneeded.", AllPointers);
		}
		if (QuestKey[3] == 1)
		{
			//console.log("Ring required.");
			totalQuest += 1;
			generateClue(rng, pm, "\-Ring\-\nneeded.", AllPointers);
		}
		else if (QuestKey[3] == 0)
		{
			generateClue(rng, pm, "\-Ring\-\nis junk.", AllPointers);
		}
		if (QuestKey[4] == 1)
		{
			//console.log("Nail required.");
			totalQuest += 1;
			generateClue(rng, pm, "\-Nail\-\nneeded.", AllPointers);
		}
		else if (QuestKey[4] == 0)
		{
			generateClue(rng, pm, "\-Nail\-\nis junk.", AllPointers);
		}
		if (QuestKey[5] == 1)
		{
			//console.log("Eye required.");
			totalQuest += 1;
			generateClue(rng, pm, "\-Eye\-\nneeded.", AllPointers);
		}
		else if (QuestKey[5] == 0)
		{
			generateClue(rng, pm, "\-Eye\-\nis junk.", AllPointers);
		}
		if (QuestKey[6] == 1)
		{
			//console.log(AllPointers);
			//console.log("Heart required.");
			totalQuest += 1;
			generateClue(rng, pm, "\-Heart\-\nneeded.", AllPointers);
			//var randActor = randomInt(rng, 0, textPointers.length);
			//var hText = "The Heart\nis required.";
			//textPointers.splice(randActor, 1);

			//pm.add(textToBytes(hText, 1), textPointers[randActor]);
			//console.log(textPointers);
		}
		else if (QuestKey[6] == 0)
		{
			generateClue(rng, pm, "\-Heart\-\nis junk.", AllPointers);
			//var randActor = randomInt(rng, 0, textPointers.length);
			//var hText = "The heart\nis absolute\ntrash.";
			//textPointers.splice(randActor, 1);
			//pm.add(textToBytes(hText, 1), textPointers[randActor]);

		}
		if (QuestKey[7] == 1)
		{
			//console.log("Rib required.");
			totalQuest += 1;
			generateClue(rng, pm, "\-Rib\-\nneeded.", AllPointers);
		}
		else if (QuestKey[7] == 0)
		{
			generateClue(rng, pm, "\-Rib\-\nis junk.", AllPointers);
		}


		// Misc
		if (MiscKey[4] == 1)
		{
			//console.log("Garlic required.");
			totalMisc += 1;
			generateClue(rng, pm, "\-Garlic\-\nneeded.", AllPointers);
		}
		else if (MiscKey[4] == 0)
		{
			generateClue(rng, pm, "\-Garlic\-\nis junk.", AllPointers);
		}
		if (MiscKey[5] == 1)
		{
			//console.log("Laurels required.");
			totalMisc += 1;
			generateClue(rng, pm, "\-Laurels\-\nneeded.", AllPointers);
		}
		else if (MiscKey[5] == 0)
		{
			generateClue(rng, pm, "\-Laurels\-\nare junk.", AllPointers);

		}
		if (MiscKey[6] == 1)
		{
			//console.log("Magic Cross required.");
			totalMisc += 1;
			generateClue(rng, pm, "\-Cross\-\nneeded.", AllPointers);
		}
		else if (MiscKey[6] == 0)
		{
			generateClue(rng, pm, "\-Cross\-\nis junk.", AllPointers);
		}
		if (MiscKey[7] == 1)
		{
			//console.log("Silk bag required.");
			totalMisc += 1;
			generateClue(rng, pm, "\-Silk Bag\-\nneeded.", AllPointers);
		}
		else if (MiscKey[7] == 0)
		{
			generateClue(rng, pm, "\-Silk Bag\-\nis junk.", AllPointers);
		}

		// Sub
		if (SubKey[1] == 1)
		{
			//console.log("Oak stake required.");
			totalSub += 1;
		}
		if (SubKey[2] == 1)
		{
			//console.log("Sacred flame required.");
			totalSub += 1;

			generateClue(rng, pm, "\-Sacred Flame\-\nneeded.", AllPointers);
		}
		else if (SubKey[2] == 0)
		{
			generateClue(rng, pm, "\-Sacred Flame\-\nis junk.", AllPointers);
		}
		if (SubKey[3] == 1)
		{
			//console.log("Diamond required.");
			totalSub += 1;
			generateClue(rng, pm, "\-Diamond\-\nneeded.", AllPointers);
		}
		else if (SubKey[3] == 0)
		{
			generateClue(rng, pm, "\-Diamond\-\nis junk.", AllPointers);
		}
		if (SubKey[4] == 1)
		{
			//console.log("Holy water required.");
			totalSub += 1;
			generateClue(rng, pm, "\-Holy Water\-\nneeded.", AllPointers);
		}
		else if (SubKey[5] == 0)
		{
			generateClue(rng, pm, "\-Holy Water\-\nis junk.", AllPointers);

		}
		if (SubKey[5] == 1)
		{
			//console.log("Golden Knife required.");
			totalSub += 1;
			generateClue(rng, pm, "\-Golden Knife\-\nneeded.", AllPointers);
		}
		else if (SubKey[5] == 0)
		{
			generateClue(rng, pm, "\-Golden Knife\-\nis junk.", AllPointers);

		}
		if (SubKey[6] == 1)
		{
			//console.log("Silver Knife required.");
			totalSub += 1;
			generateClue(rng, pm, "\-Silver Knife\-\nneeded.", AllPointers);
		}
		else if (SubKey[6] == 0)
		{
			generateClue(rng, pm, "\-Silver Knife\-\nis junk.", AllPointers);
		}
		if (SubKey[7] == 1)
		{
			//console.log("Dagger required.");
			totalSub += 1;
			generateClue(rng, pm, "\-Dagger\-\nneeded.", AllPointers);
		}
		else if (SubKey[7] == 0)
		{
			generateClue(rng, pm, "\-Dagger\-\nis junk.", AllPointers);
		}


		var test = "";
		var trueQuest = "";
		var trueMisc = "";
		var trueSub = "";

		trueQuest = QuestKey[0]+QuestKey[1]+QuestKey[2]+QuestKey[3]+QuestKey[4]+QuestKey[5]+
			QuestKey[6]+QuestKey[7];
		trueMisc = MiscKey[0]+MiscKey[1]+MiscKey[2]+MiscKey[3]+MiscKey[4]+MiscKey[5]+
			MiscKey[6]+MiscKey[7];
		trueSub = SubKey[0]+SubKey[1]+SubKey[2]+SubKey[3]+SubKey[4]+SubKey[5]+
			SubKey[6]+SubKey[7];

		var decQuest = parseInt(trueQuest, 2);
		//console.log(decQuest.toString(16));
		var decMisc = parseInt(trueMisc, 2);
		//console.log(decMisc.toString(16));
		var decSub = parseInt(trueSub, 2);
		QuestItemsHex = parseInt(decQuest, 10).toString(10);
		MiscItemsHex = parseInt(decMisc, 10).toString(10);
		SubItemsHex = parseInt(decSub, 10).toString(10);
		//console.log([parseInt(decSub, 10).toString(16)]);
		// Get location of our custom code and modify the dummy values
		// from the .asm with our now randomized values
		// 7B10 + 4 + 6 + 13 + 15 + 22 + 24
		var romLoc = modsub.rom;
		
		romLoc += 9;
		pm.add([QuestItemsHex], romLoc);
		romLoc += 2;
		pm.add([QuestItemsHex], romLoc);

		romLoc += 6;
		pm.add([MiscItemsHex], romLoc);
		romLoc += 2;
		pm.add([MiscItemsHex], romLoc);

		romLoc += 6;
		pm.add([SubItemsHex], romLoc);
		romLoc += 2;
		pm.add([SubItemsHex], romLoc);


		//console.log (romLoc.toString(16));
		//console.log ("QuestItems -> " + [QuestKey] + " (0x" + [QuestItemsHex] + ")");
		//console.log ("MiscItems -> " + [MiscKey] + " (0x" + [MiscItemsHex] + ")");
		//console.log ("SubItems -> " + [SubKey] + " (0x" + [SubItemsHex] + ")");

		//console.log("You require " + totalQuest + " quest items, and " + totalCrystals + " crystals.");
		//console.log("You require " + totalMisc + " misc items.");
		//console.log("You require " + totalSub + " sub weapons.");
		// 0xD2CF, length = 55 (0x37)
		var text = textToBytes("Body parts " + totalQuest + "\nCrystals   " + totalCrystals +
								"\nMisc       " + totalMisc + "\nSubweapons " + totalSub, 1);
		pm.add(text, 0xD2CF);

		//console.log(test);
		//console.log(QuestItems)
		//console.log(QuestKey)

		// Aljiba SUB Clues
		//var prefix = "";
		//var suffix = "";
		//prefix = "The heart";
		//suffix = "not needed";
		//text = textToBytes(prefix + "\nis\n" + suffix + ".", 1);
		//pm.add(text, 0xD41F);
		// Alba BODY Clues
		// Ondol MISC Clues

		//console.log(text);
	}
};

