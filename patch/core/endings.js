module.exports = {
	patch: function(pm) {
		const { utils: { TEXT_MAP_ENDING, textToBytes } } = require('../../lib');

		// convert text string to bytes and add the patch
		const endingPrint = (text, rom) => pm.add(textToBytes(text, TEXT_MAP_ENDING), rom);
        //good ending
		endingPrint('simon\'s quest', 0x126C2);
		endingPrint('of revenge &', 0x126D2);
		endingPrint('narcissism is ', 0x126E1);
		endingPrint('finally done.', 0x126F2);

		endingPrint('his bloodlust ', 0x12702);
		endingPrint('momentarily   ', 0x12713);
		endingPrint('sated after', 0x12724);
		endingPrint('resurrecting ', 0x12732);

		endingPrint('Dracula, only', 0x12742);
		endingPrint('to execute', 0x12752);
		endingPrint('him yet again ', 0x1275F);
		endingPrint('moments later.', 0x12770);

		endingPrint('he now plans a', 0x12781);
		endingPrint('Doina PR tour', 0x12792);
		endingPrint('to restore the', 0x127A2);
		endingPrint('Belmont name.', 0x127B3);
        
        //medium ending
        endingPrint('After Simon ', 0x125C6);
		endingPrint('killed vrad, ', 0x125D5);
		endingPrint('he got lost. ', 0x125E5);
		endingPrint('a passerby ', 0x125F5);

		endingPrint('David anber   ', 0x12603);
		endingPrint('told simon he ', 0x12614);
		endingPrint('was lost in', 0x12625);
		endingPrint('an illogical ', 0x12633);

		endingPrint('loop and that ', 0x12643);
		endingPrint('without some  ', 0x12654);
		endingPrint('baja rib last', 0x12665);
		endingPrint('he would die', 0x12675);

		endingPrint('with grizelda', 0x12684);
		endingPrint('in laruba --', 0x12694);
		endingPrint('spanish for ', 0x126A3);
		endingPrint('\'the ruba\'   ', 0x126B2);
        
        
        
        
        
        
        
	}
};
