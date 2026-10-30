module.exports = {
	id: 'graveyard-duck',
	name: 'Graveyard Duck',
	requires: 'enemizer',
	description: 'Replaces "duck" merchant with an actual duck',
	//qol, random, difficulty, misc
	type: 'qol',
	character: 'g',
	flaglabel: 'duk',
	patch: function(pm) {

		// bank0: repurpose pose index 9b, but structs E0,E1 $b586 (junk 8bytes)
		pm.add( [0x86, 0xb5], 0x2d76);
		pm.add( [ 0x84, 0x1f,0xb2, 0x01,0x01,0x9a,0x9c ], 0x3596);


		// bank1: in 'secret merchant' object, check for duck graveyard,
		// (or in this case any other than camilla cemetery) if so, use new pose.
/*
;------------------------------------------
ObjectAI_object1E
	$B1BD  BD D8 03:    lda ObjectCurrentActionType,x
	$B1C0  D0 0F:       bne +		; $B1D1
<	$B1C2  A9 40:       lda #$40
<	$B1C4  9D D8 03:    sta ObjectCurrentActionType,x
<	$B1C7  A9 20:       lda #$20
<	$B1C9  9D C6 03:    sta ObjectDialogStatusFlag,x
<	$B1CC  A9 0B:       lda #$0B
<	$B1CE  4C D8 DE:    jmp SetObjectIndexToAutomaticSpriteDataTable_to_A_and_PaletteIndexTo0_and_RefreshSprite
>	A9 20         lda #$20
>	9D C6 03      sta ObjectDialogStatusFlag,x
>	A0 9B         ldy #$9b  // duck
>	A5 50         lda CurrentLevelSceneNumber // 0 if carmilla cemetery //// 2
>	              #cmp num    //// 2  // no need. just check zero
>	D0 02         bne continu //// 2
>	A0 1E         ldy #$robeguy //// 2
>continu:
>	D0 35         bne therest # $B206 - $B1D1 = $35  //// 2
...
++	$B1FD  DE 56 04:    dec ObjectAIvar2,x
	$B200  D0 09:       bne +		; $B20B -> Object_FlashPalette
	$B202  FE 44 04:    inc ObjectAIvar1,x
<	$B205  A9 00:       lda #$00
<	$B207  9D 12 03:    sta ObjectPaletteIndex,x
<	$B20A  60:          rts 
>	60            rts
>therest:
>	A9 40         lda #$40
>	4C D0 DE      jmp Object_SetCurrentActionType_And_Y_as_Pose1

[0xA9, 0x20,  0x9D, 0xC6, 0x03,  0xA0, 0x9B,  0xA5, 0x50,  0xD0, 0x02,  0xA0, 0x1E,  0xD0, 0x35]
[0x60,  0xA9, 0x40,  0x4C, 0xD0, 0xDE]
*/
		pm.add(
			[0xA9,0x20, 0x9D,0xC6,0x03, 0xA0,0x9B, 0xA5,0x50, 0xD0,0x02, 0xA0,0x1E, 0xD0,0x35]
			, 0x71d2);
		pm.add(
			[0x60, 0xA9,0x40, 0x4C,0xD0,0xDE]
			, 0x7215);


		// bank4: update palette for the duck
		pm.add([ 0x0F, 0x38, 0x27, 0x0F ], 0x120E2);


		// duck pixels into graveyard BG tilesheet, replace unused leech.
/*
full original set, but we only need idle lower body pose:
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 
1E 3D 7E 7F 7F 87 F3 87 1E 23 41 7E 54 F8 FC FC 7F 7F 5F 2F 13 1F 22 3F 78 40 60 30 1C 1F 3F 3F 00 00 80 40 C0 E0 D8 FF 00 00 80 C0 40 60 38 07 FD FE FA E4 F8 A0 20 E0 03 0E 06 1C 58 E0 E0 E0 
1E 3D 7E 7F 7F 87 F3 87 1E 23 41 7E 54 F8 FC FC 7F 7F 5F 2F 13 7C 45 3D 78 40 60 30 1C 7C 7D 3D 00 00 80 40 C0 E0 D8 FF 00 00 80 C0 40 60 38 07 FD FE FA E4 F8 90 30 E0 03 0E 06 1C 58 F0 F0 E0';
*/
		pm.add(
			[0x1E, 0x3D, 0x7E, 0x7F, 0x7F, 0x87, 0xF3, 0x87, 0x1E, 0x23, 0x41, 0x7E, 0x54, 0xF8, 0xFC, 0xFC, 0x7F, 0x7F, 0x5F, 0x2F, 0x13, 0x1F, 0x22, 0x3F, 0x78, 0x40, 0x60, 0x30, 0x1C, 0x1F, 0x3F, 0x3F, 0x00, 0x00, 0x80, 0x40, 0xC0, 0xE0, 0xD8, 0xFF, 0x00, 0x00, 0x80, 0xC0, 0x40, 0x60, 0x38, 0x07, 0xFD, 0xFE, 0xFA, 0xE4, 0xF8, 0xA0, 0x20, 0xE0, 0x03, 0x0E, 0x06, 0x1C, 0x58, 0xE0, 0xE0, 0xE0]
			, 0x24010 + 0x9a0 );

	}
};
