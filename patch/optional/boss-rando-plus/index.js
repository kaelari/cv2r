/////////////////////////
// Author: OranjSqueez.  Yes, I'm to blame for this nightmare.
// This thing is currently a mess and full of old notes, which may still be needed,
// but SHOULD NOT BE TRUSTED TO BE CURRENT.
//
// Important notes to future Me and whoever else has to maintain this abomination:
//
// $NNNN refers to RAM location. 0xNNNN refers to corresponding ROM location.
//
/////////////////////////

let BOSSPLUS_CURRENT_VERSION = "0.2";

//
// idea list: invisible stairs - can we also walk down them?
/*

when boss item drops, if hp of new actor is $26, then camilla's item, else death's
THIS
$9307  A5 50:       lda CurrentLevelSceneNumber
$9309  C9 06:       cmp #$06
********
roomobj.area has scene number?
place into $930a (0x531a)
********

Any mansion can have a boss, and they are not in plain sight. You must search.

Rover bossroom has a.. vertical problem.

And Rover purple block wrongwarp up to orb no longer works the way you expect. Don't do it.

Bodley monster xp party has been nerfed a bit because I needed to steal some actors from somewhere.

I haven't yet studied how to add more dialogue for new hintbooks "camilla is hiding in berkeley" etc.

This should be compatible with harder camilla/death. probably.

This should be compatible with door rando.

ROVER FERRY WARP NOTE:
Unknown41 is nonzero when riding a platform, including the ferry AND including 
rover's new invisible block behind orb room.
IF the ferry heart flag is active (talk to ferryman with heart but do not cross river)
then riding the platform when going into bossroom may send you to laruba glitchworld.

*/
const { get_current_bytes } = require('./get_current_bytes.js');
const { core, utils: { shuffleArray } } = require('../../../lib');



// destination room objects
// table entries for enemizer to know sprite tileset for bossrooms
const BASE_LOC_PTR = 0x7730; // from enemizer
const bossrooms = [
	{	// laruba
		roomobj: null,  // populate reference from current state of core
		tiletableloc: BASE_LOC_PTR + 0x30 + (4 * 6) + 2,
		actorptrloc: 0x5a14,  // point to ramaddr (from bosses) after shuffling
		req: null,  // populate custom
		oldroomname: "Laruba Mansion - Camilla Fight",
		changedroomname: "Laruba Mansion - Boss Room"  // rename room
	},
	{	// berk
		roomobj: null,  // populate reference from current state of core
		tiletableloc: BASE_LOC_PTR + 0x30 + (4 * 7) + 2,
		actorptrloc: 0x5ad4,  // point to ramaddr (from bosses) after shuffling
		req: null,  // populate custom
		oldroomname: "Berkeley Mansion - Part 2",
		newroomname: "Berkeley Mansion - Boss Room"  // append NEW room
	},
	{	// rover
		roomobj: null,  // populate reference from current state of core
		tiletableloc: BASE_LOC_PTR + 0x30 + (4 * 8) + 2,
		actorptrloc: 0x5ba0,  // point to ramaddr (from bosses) after shuffling
		req: null,  // populate custom
		oldroomname: "Rover Mansion - Part 2",
		newroomname: "Rover Mansion - Boss Room"  // append NEW room
	},
	{	// brahm
		roomobj: null,  // populate reference from current state of core
		tiletableloc: BASE_LOC_PTR + 0x30 + (4 * 9) + 2,
		actorptrloc: 0x5c5c,  // point to ramaddr (from bosses) after shuffling
		req: null,  // populate custom
		oldroomname: "Brahm Mansion - Death Fight",
		changedroomname: "Brahm Mansion - Boss Room"  // rename room
	},
	{	// bod
		roomobj: null,  // populate reference from current state of core
		tiletableloc: BASE_LOC_PTR + 0x30 + (4 * 10) + 2,
		actorptrloc: 0x5f0e,  // point to ramaddr (from bosses) after shuffling
		req: null,  // populate custom
		oldroomname: "Bodley Mansion - Part 2",
		newroomname: "Bodley Mansion - Boss Room"  // append NEW room
	},
	{	// yomi landlord, extra secret boss for fun. SHH!
		roomobj: null,  // populate reference from current state of core(? if needed ?)
		tiletableloc: BASE_LOC_PTR + (2 * 23),
		actorptrloc: 0x517a,  // ??
		req: null,  // populate custom
		oldroomname: "Yomi - Girlfriend Room",
		changedroomname: "Yomi - Landlord Room"  // rename room
	}
];
// source boss objects. will shuffle this.
// make a deep copy before reassigning into a room.
// (-0x4000 + 0x10) boss info [vanillaAddr(4bytes), spriteTableId, stock_vals]
//$9AB6 camilla        .byte $08,$0A,$42,$F0,$FF
//$9CCE reaper         .byte $08,$08,$44,$80,$FF
//$91FF yomi landlord  .byte $0C,$0C,$AC,$5A,$FF
bosses = [
	{	// laruba
		bossobj:    null,  // populate reference from current state of core
		actorblock: [0x08,0x0A,0x42,0xF0], // [x, y, type, HP]
		ramaddr: 0x9ab6, // $9ab6 RAM addr of actorblock. we will swap pointers.
		romaddr: 0x5ac6,
		tilesheet:  0xA,  // for tiletableloc
	},
	{	// berk
		bossobj:    null,  // populate reference from current state of core
		actorblock: [0x0C,0x0C,0xAC,0x5A], // [x, y, type, HP]
		ramaddr: 0x9abb, // $9abb (0x5acb) old laruba orb. we will swap pointers.
		romaddr: 0x5acb,
		tilesheet:  0x1,  // for tiletableloc
	},
	{	// rover
		bossobj:    null,  // populate reference from current state of core
		actorblock: [0x0C,0x0C,0xAC,0x5A], // [x, y, type, HP]
		ramaddr: 0x9c4e, // $9c4e (0x5c5e) carved from brahm bytes
		romaddr: 0x5c5e,
		tilesheet:  0x1,  // for tiletableloc
	},
	{	// brahm
		bossobj:    null,  // populate reference from current state of core
		actorblock: [0x08,0x08,0x44,0x80], // [x, y, type, HP]
		ramaddr: 0x9cce,   // $9ace RAM addr of actorblock. we will swap pointers.
		romaddr: 0x5cde,
		tilesheet:  0x9,  // for tiletableloc
	},
	{	// bod
		bossobj:    null,  // populate reference from current state of core
		actorblock: [0x0C,0x0C,0xAC,0x5A], // [x, y, type, HP]
		ramaddr: 0x9cd3, // $9cd3 (0x5ce3) old brahm orb. we will swap pointers.
		romaddr: 0x5ce3,
		tilesheet:  0x1,  // for tiletableloc
	}
];
// actor .x .y .id .data(HP) .pointer .enemy(bool) .requirements .locationName


// just for fun
//const drac_boss_info = [[0x08,0x08,0x47,0xF0], 0xc];
// 0xC7 for drac
//const drac_boss_info = [[0x08,0x0a,0xc7,0x8], 0xc];
// 97 zombie (can't damage in daytime!)
// B6 becomes (small) heart
// CE does something weird to the sound while onscreen, and can't use whip.
// D5 copy of an active sprite, immobile?
// make it a heart for now. how sweet.
const drac_boss_info = [[0x0c,0x0c,0xb6,0xf0], 0x1];


///////////////////////////////////////
// start initial (static) patch contents
const patchbase = [
	//////////////
	// metatiles:

	// mansion signpost $0D (unused) to passwall. palette already correct.
	// tile bytes are file position 0x109B4
	// use vals (nonsolid blocks):
	// D9 DB D9 DB
	// DA DC DA DC
	// D9 DB D9 DB
	// DA DC DA DC
	{ "offset": 68020, "bytes": [ 217, 219, 217, 219, 218, 220, 218, 220, 217, 219, 217, 219, 218, 220, 218, 220 ] },


	///////////////
	// map table resizing:
	// laruba:
	// $88d4 decrease number of submaps (not necessary here)
	//{ "offset": 35044, "bytes": [ 2 ] },
	// $88df assign zone 3 to bossroom $88e6 (already correct, no need to shrink table either)
	//                                 ^ USE FOR OTHER MANSIONS

	// berkeley:
	// OLD $8d3a move gate ptr to shifted zone vshift list at $8d54
	//{ "offset": 36170, "bytes": [ 84, 141 ] },
	// OLD $8d45 move mansion ptr to new zone vshift list at $8d54,

	// $8d45 change mansion ptr back 1b to expanded zone vshift list at $8d62,
	// $8d47 and increase number of submaps to 2
	{ "offset": 36181, "bytes": [ 98, 141, 2 ] },
	// NOTE $8d52 has 0xD bytes redundant berk copy we are overwriting.
	// $8d52 assign zone 3 to laruba bossroom $88e6 (expand table),
	{ "offset": 36194, "bytes": [ 230, 136 ] },

	// OLD:
	// -- REMOVED $8d54 and fill zone vshifts 0 -2($fe) 0 from below, to expand palette,
	// -- REMOVED $8d57 and fill 6 7 for rover screen ptrs, to expand submap list
	// -- REMOVED $8d59 and fill $d $e for bodley screen ptrs, to expand submap list
	//{ "offset": 36194, "bytes": [ 230, 136,  0, 254, 0,  6, 7,  13, 14 ] },

	// NEW:
	// $8d54 [DYNAMIC] move rover's gate struct here. uses all available space here $B bytes.

	// OLD:
	// -- MOVED TO ROVERSPACE $8d62 [NOTE] repurpose old berk gate vshift entry for bod gate screen index (wall or no wall)
	// -- REMOVED $8d63 prepend palette entry $0f $48 to list
	//{ "offset": 36211, "bytes": [ 15, 72 ] },
	
	// NEW:
	// $8d62 expand zone vshift list back 1b from $8d63, fill with 0 -2($fe) 0
	{ "offset": 36210, "bytes": [ 0, 254, 0 ] },
	// $8d69 expand palette list forward overwriting gate palette with $0f $48
	{ "offset": 36217, "bytes": [ 15, 72 ] },

	// $8760 point unused berk copy ptr to actual berk $8d45
	{ "offset": 34672, "bytes": [ 69, 141 ] },
	// OLD $877e point both interior berk palette ptrs to new loc $8d63
	//{ "offset": 34702, "bytes": [ 99, 141, 99, 141 ] },
	// $8768 point berk gate night palette ptr to new loc (laruba version) $88f0
	{ "offset": 34680, "bytes": [ 240, 136 ] },


	// rover:
	// OLD $923d point to expanded zone vshift list at $925e
	//{ "offset": 37453, "bytes": [ 94, 146 ] },
	// $923d point to moved zone vshift list at $924e
	// $923f and increase submaps to 3
	{ "offset": 37453, "bytes": [ 78, 146, 2 ] },
	// OLD $9246 reassign zone 1,2 ptrs to new loc in berk's extra space $8d57 $8d58,
	// $9246 reassign zone 1,2 ptrs (6 7) to convenient bytes in local room and ptr $92d3 $92a5,
	// OLD $924A and assign zone 3 to laruba bossroom $88e6 (expand table)
	// $924A NOPE CAN'T DO THAT //and assign zone 3 to new connecting submap $92bb(expand table)
	// $924C and assign zone 4 to laruba bossroom $88e6 (expand table)
	{ "offset": 37462, "bytes": [ 211, 146, 165, 146,  230, 136,  230, 136 ] },
	// OLD $924C [DYNAMIC] shift entire rover gate struct down 2 bytes
	// [DYNAMIC] move rover gate struct (11 bytes) from $924a to berkspace $8d54
	// NOTE: 9 bytes $924e-$9256 available for "stuff"
	// $924e put rover's new vshift list 0 -1 -1 here
	{ "offset": 37470, "bytes": [ 0,255,0 ] },
	// $9251 [DYNAMIC] store bod gate index here from $9a69, wall or no wall
	// $92BB AAAAAAAAAAAAAAAAA THIS DOESN'T WORK AAAAAAAAAAAAAAA 8 bytes, overwrite rover voidroom padding with new submap:
	// [w+h voidroom newroom voidroom] [1,2, $07,$f8, x,x, $07,$f8]
	//{ "offset": 37579, "bytes": [ 1,2, 7,248, x,x, 7,248 ] },

	// $60 $92 $00,$FC,$02,$05,$FF,$00,$01 $57 $92:
	///// { "offset": 37468, "bytes": [ 96, 146, 0, 252, 2, 5, 255, 0, 1, 87, 146 ] },
	// palette already has 3 entries
	// OLD $925e overwrite night palette to expand zone vshift list 0 -1($ff)
	//{ "offset": 37486, "bytes": [ 0, 255 ] },
	// $925e overwrite night palette to expand palette to rover 4 $10 $49
	{ "offset": 37486, "bytes": [ 16, 73 ] },
	// OLD $8740 point rover gate screennumber entry to shifted position $924c
	//{ "offset": 34640, "bytes": [ 76, 146 ] },
	// $8740 point rover gate screennumber entry to new berkspace position $8d54
	{ "offset": 34640, "bytes": [ 84, 141 ] },

	// $876C point rover gate night palette ptr to new loc (laruba version) $88f0
	{ "offset": 34684, "bytes": [ 240, 136 ] },

	// brahm:
	// assign zone 3 to bossroom (already correct, shrink table? get 2 extra bytes?)
	// $9688 reduce submaps to 2 (allows emergency escape after botched death drop)
	{ "offset": 38552, "bytes": [ 2 ] },

	// bodley:
	// $9a51 set gate zone vshift list ptr to expanded position $9a6b
	{ "offset": 39521, "bytes": [ 107, 154 ] },
	// OLD $9a5a reassign gate ptr (wall or no wall) to a single spare byte in berk space at $8d62
	// $9a5a reassign gate ptr (wall or no wall) to a spare byte in roverspace $9251
	// $9a5c and set zone vshift list ptr to expanded position $9a6b,
	// $9A5E and increase number of submaps
	{ "offset": 39530, "bytes": [ 81, 146,  107, 154,  2 ] },
	// --OLD $9A65 reassign zone 1,2 ptrs to new loc in berk's extra space $8d59 $8d5a,
	// $9A65 reassign zone 1,2 ptrs ($D $E) to convenient bytes in our stairs $9a8c $9a84,
	// $9a69 and assign zone 3 to laruba bossroom $88e6 (expand table),
	// $9a6b and shift/expand zone vshift list 0 -3($fd)
	{ "offset": 39541, "bytes": [ 140, 154, 132, 154,  230, 136,  0, 253 ] },
	// $9A71 overwrite bod night palette to expand palette list $13,$4B
	{ "offset": 39553, "bytes": [ 19 ] },
	// $8774 point bod gate night palette ptr to new loc (brahm version) $96a7
	{ "offset": 34692, "bytes": [ 167, 150 ] },
	// [DYNAMIC] move bod gate index value (wall or no wall) from $9a69 to roverspace $9251

	///////////////
	// room composition:

	// all:
	// $88be close east exit of bossroom ($7 closed, $33 passwall)
	//{ "offset": 35022, "bytes": [ 51 ] },
	{ "offset": 35022, "bytes": [ 7 ] },
	// $8886 open east wall of blocking orbroom (for emergency escape)
	{ "offset": 34966, "bytes": [ 51 ] },


	// laruba: added a wall to force player to scroll down all the way.
	// $8c5a old laruba2 room7 repurpose for landing platform in bod2
	/*{ "offset": 35946, "bytes": [ 
		0,  0,  0,  0,  0,  0,  0,  0,
		0,  0,  0,  0,  0,  0,  0,  0,
		0,  0,  0,  0,  0,  0,  0,$40,
		0,  0,  0,  0,  0,  0,$21,$40,
		0,  0,  0,  0,$40,$14,$2b,$40,
		0,  0,  0,  0,$2f,$40,$17,  0,
		0,  0,  0,  0,  0,$2f,$40,$40,
		] },
	*/
	{ "offset": 35946, "bytes": [ 
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 64,
		0, 0, 0, 0,0, 0, 33, 64,
		0, 0, 0, 0, 64, 20, 43, 64,
		0, 0, 0, 0, 47, 64, 23, 0,
		0, 0, 0, 0, 0, 47, 64,64
		] },
	// $8B32 5 open path above new orb room to void chamber
	{ "offset": 35650, "bytes": [ 0 ] },
	// $8CCF(in room 9) open gap in floor of voidroom
	// was:
	//$01,$01,$01,$01,$01,$01,$01,$01,
	//$1E,$1A,$1E,$1A,$1E,$26,$1E,$25,
	//$01,$01,$01,$01,$01,$01,$01,$01,
	//$1E,$21,$1E,$21,$1E,$26,$1E,$21,
	//$14,$2B,$14,$1A,$1A,$26,$1A,$1A,
	//$1A,$1A,$25,$40,$40,$40,$40,$40,
	//$36,$36,$40,$40,$40,$40,$40,$40
	// to:
	//$01,$01,$01,$01,$01, $3b,$01,$01,
	//$1E,$1A,$1E,$1A,$1E,$26,$1E,$25,
	//$01,$01,$01,$01,$01,$01,$01,$01,
	//$1E,$21,$1E,$21,$1E,$26,$1E,$21,
	//$14,$2B,$14,$1A,$1A,$26,$1A,$1A,
	//$1A,$1A,$25,$40,$40,$40,$40,$40,
	//$36,$36,$40,$40,$40,$40,$40,$40
	{ "offset": 36063, "bytes": [ 59 ] },
	// $8D02 10 open path under new orb room
	// was:
	//$06,$14,$14,$07,$1A,$17,$01,$01,
	//$24,$1A,$1A,$07,$01,$21,$1A,$07,
	//$01,$01,$01,$01,$21,$1A,$01,$01,
	//$2B,$14,$2B,$14,$2B,$01,$17,$07,
	//$1A,$1A,$1A,$1A,$01,$2B,$14,$07,
	//$40,$40,$40,$06,$1A,$1A,$1A,$00,
	//$40,$40,$40,$40,$40,$40,$40,$40
	// to:
	//$06,$14,$14, $1A,$1A,$17,$01,$01,
	//$24,$1A,$1A,$07,$01,$21, $17,$07,
	//$01,$01,$01,$01,$21, $01, $14, $07,
	//$2B,$14,$2B,$14,$2B, $14,$17, $01,
	//$1A,$1A,$1A,$1A,$01, $01,$14,$07,
	
	//$40,$40,$40,$06,$1A,$1A,$1A, $33,
	//$40,$40,$40,$40,$40,$40,$40,$40
	{ "offset": 36114, "bytes": [ 
		6,20,20,26,26,23, 1, 1,
		36,26,26, 7, 1,33,23, 7,
		1, 1, 1, 1,33, 1,20, 7,
		43,20,43,20,43,20,23, 1,
		26,26,26,26, 1, 1,20, 7
		] },
	// $8d31 [DYNAMIC] laruba2_10 (Map1_1_ten) add passwall $33 SE corner to boss, else solid $07
	/////{ "offset": 36161, "bytes": [ 51 ] },

	// berk:
	// $9205 add passwall below orbroom,
	// was:
	//$40,$40,$40,$40,$40,$40,$40,$40,
	//$01,$01,$01,$01,$01,$01,$01,$01,
	//$06,$21,$2B,$14,$14,$17,$26,$07,
	//$32,$2B,$14,$2B,$14,$2B,$26,$07,
	//$06,$1E,$1A,$1A,$1E,$14,$26,$07,
	//$01,$01,$01,$01,$01,$1A,$26,$07
	//$2A,$2A,$2A,$2A,$2A,$2A,$40,$40
	// to:
	// $d, $d, $d, $d, $d, $d, $d, $d,
	//$01,$01,$01,$01,$01,$01, $3b,$01,
	//$06,$21,$2B,$14,$14,$17,$26,$07,
	//$32,$2B,$14,$2B,$14,$2B,$26,$07,
	//$06,$1E,$1A,$1A,$1E,$14,$26,$07,
	//$01,$01,$01,$01,$01,$1A,$26, $33,
	//$2A,$2A,$2A,$2A,$2A,$2A,$40,$40
	{ "offset": 37397, "bytes": [ 13, 13, 13, 13, 13, 13, 13, 13, 1, 1, 1, 1, 1, 1, 59 ] },
	// [DYNAMIC] $9234 and open east exit passwall to new bossroom
	/////{ "offset": 37444, "bytes": [ 51 ] },

	// rover:
	// $935a $9362 [DYNAMIC] rover1 add passwall $0D to new (real) orbroom
	/////{ "offset": 37738, "bytes": [ 13 ] },
	/////{ "offset": 37746, "bytes": [ 13 ] },
	// $9483 rover2 add passwall ceiling in case someone is dumb and clips past upper orbroom
	// $1,$1 to $1,$33
	{ "offset": 38035, "bytes": [ 1, 59 ] },
	// $9643 (+$1F =$9662) rover2 fill in east wall of SE corner $40 so player can jump up up to get out.
	//      (purple block wrongwarp works different now)
	{ "offset": 38514, "bytes": [ 64 ] },

	// brahm:
	// $9a19 repurpose corridor into passable orbroom copy
	//stock orbroom:
	//$40,$01,$01,$01,$01,$01,$01,$40,
	//$06,$13,$2E,$13,$13,$13,$17,$07,
	//$06,$13,$31,$13,$19,$13,$14,$07,
	//$06,$19,$13,$19,$00,$19,$28,$07,
	//$06,$21,$19,$39,$39,$01,$01,$01,
	//$00,$1A,$1E,$39,$01,$39,$39,$07,
	//$40,$40,$40,$40,$40,$40,$40,$40
	//to:
	//$40,$01,$01,$01,$01,$01,$01,$40,
	//$06,$13,$2E,$13,$13,$13,$17,$07,
	//$06,$13,$31,$13,$19,$13,$14,$07,
	//$06,$19,$13,$19,$00,$19,$28,$07,
	//$06,$21,$19,$39,$39,$01,$01, $3b,
	//$00,$1A,$1E,$39,$01,$39,$39, $33,
	//$40,$40,$40,$40,$40,$40,$40,$40
	{ "offset": 39465, "bytes": [
		64,  1,  1,  1,  1,  1,  1, 64,
		 6, 19, 46, 19, 19, 19, 23,  7,
		 6, 19, 49, 19, 25, 19, 20,  7,
		 6, 25, 19, 25,  0, 25, 40,  7,
		 6, 33, 25, 57, 57,  1,  1, 59,
		 0, 26, 30, 57,  1, 57, 57, 51,
		64, 64, 64, 64, 64, 64, 64, 64
		]},

	// bodley:
	// $9e3d [DYNAMIC] bod2 room7 add breakable/passable walls to access underneath
	// was:
	//$06,$14,$23,$04,$1D,$14,$2B,$07,
	//$06,$2B,$1A,$25,$04,$1D,$1A,$07
	//$06,$17,$01,$02,$0A,$01,$01,$01,
	//$06,$2B,$14,$23,$04,$1D,$17,$07
	//$32,$14,$2B,$1A,$25,$04,$1D,$07,
	//$06,$1A,$1A,$07,$40,$40,$40,$40
	//$40,$40,$40,$40,$40,$40,$40,$40
	// to:
	//$06,$14,$23,$04,$1D,$14,$2B,$07,
	//$06,$2B,$1A,$25,$04,$1D,$1A,$07
	//$06,$17,$01,$02,$0A,$01,$01,$01,
	//$06,$2B,$14,$23,$04,$1D,$17,$07
	//$32,$14,$2B,$1A,$25,$04,$1D,$07,
	//$06,$1A,$1A, $09, $0E,$40,$40,$40
	//$40,$40,$40,$40, $0D,$40,$40,$40
	// so, $9e68 to  $9, $e, $40,$40,$40,$40,$40,$40,$40, $0D
	/////{ "offset": 40568, "bytes": [ 9, 14, 64, 64, 64, 64, 64, 64, 64, 13 ] },


	///////////////
	// room placement:

	// all:
	// $87DF place empty nonblocking orbroom $9a19 in "blank" below bossroom
	// [EDIT] no don't do that, breaks death drop.
	//{ "offset": 34799, "bytes": [ 25, 154 ] },
	// $87DF ok let's try this, place bodley1 room1 (NW corner) $9af5 in "blank" below bossroom
	// [EDIT] nope don't do that.
	// brahm2-2 $9891
	// brahm2-7 $98c9
	// bod2-8 $9e75
	// laruba2-4 $8ad2 offset $7 = $8ad9 (wall of spikes)
	// laruba 2-8 $8c92 offset $35 = $8cc7 (floor of spikes)
	// $87e1 OK FOR REAL LET'S TRY THIS:
	//       since we are obsoleting the standalone orb room, and it immediately
	//       follows the standalone bossroom, we overwrite the first 2 bytes of
	//       the old orb submap with a ptr to floor spikes, so anyone who tries
	//       to purpleblockwrongwarp to rover's orb will respawn inside rover2.
	{ "offset": 0x87f1, "bytes": [ 0xc7,0x8c ] },

	// laruba:
	// $893c replace laruba2 room7 ptr to blocking orb room $8857
	{ "offset": 35148, "bytes": [ 87, 136 ] },

	// berk:
	// (nothing)

	// rover:
	// $92A3 rover2 ptr to blocking orbroom $8857
	{ "offset": 37555, "bytes": [ 87, 136 ] },
	// [DYNAMIC] $92b1 rover2 orbroom to new passable orbroom (if boss)

	// brahm:
	// [DYNAMIC] $9705 replace brahm corridor w passable orbroom $9a19(stock val) (if boss)
	//           else nonpassable orbroom $8857
	/////{ "offset": 38677, "bytes": [ 25, 154 ] },

	// bodley:
	// bod2 "empty" SE room ptr $9aeb to repurposed landing room at $8c5a
	{ "offset": 39675, "bytes": [ 90, 140 ] },


	///////////////
	// all [DYNAMIC]
	// actors: apply -$4000 (+0x10)
	// $9fa3 replace enemy with wide vmoving platform $22 at x= $37, y= $29 (41d) <= $32 (50d)
	// HP encodes move direction, move extent, crystal visibility..
	// berk vmove invisible block $05,$28,$22,$A4, moves 5 up
	// 1010 0100
	// rover hmove block $24,$25,$21,$85, moves 8?
	// 1000 0101
	// a5 horizontal moves right
	// a6 horizontal moves left
	// a7,a8 freezes the game
	// a3 horizontal moves right slow, invisible
	// c4 vmove up slow, invisible. 1 further than a4
	// e4 same, 1 further move
	// 05 horiz moves right, visible
	// 84 vmove up slow, invisible 1 less move than a4
	// 94 invisible vmove up .5 distance between 84, a4
	// 04 invisible, vibrates stage vertically
	// 14 vmove up .5 block invisible
	// 13 invis hmove right slow (offscreen)
	// 12 invis hmove left slow about 4 blocks(?) then right offscreen
	// 10 visible vmove up .5
	// 80 visible vmove up 4
	// 81 visible vmove up 4 ??? why
	// 82 invis hmove slow left 6 until hit wall? then right offscreen
	// 83 invis hmove slow right offscreen
	// 85 vis hmove fast right 8
	// 86 vis hmove fast left 8
	// 47 freeze
	// 49 reset to title
	// 4a freeze, but sprite is visible 5.5 blocks higher than start pos
	// 4b vis immobile, screws up background map visual (collision is normal)
	// 4c freeze
	// 8f freeze
	// 24 invisible, moves up 1
	// e4 
	// 0a freezes game, palette glitch
	// 1e freeze
	// 15 invisible, hmove right 1 block fast
	// 05 invisible, hmove right fast infinite?
	//{ "offset": 24499, "bytes": [ 55, 48, 34, 225 ] },

	//{ "offset": 24499, "bytes": [ 55, 48, 34, 228 ] }, // invisible
	// 0 
	// 1 
	// 2 
	// 3 
	// 4 4-7 extent of (v?) movement, in 8px tiles (half blocks)
	// 5 '   so, max movement is 7.5 blocks
	// 6 '
	// 7 '
	//{}
];
// end initial (static) patch contents
///////////////////////////////////////


////////////////////////////////
// start build patch stuff func
function build_patch_stuff(pm, opts)
{
	const { logic, rng } = opts;
	let idx, b, x, z;
	let pat = patchbase;

	///////////
	// populate boss and room objects from core
	// TODO  move laruba,brahm orb refs into appropriate core.loc objects

	// yomi first so we can deepclone the actor
	bossrooms[5].roomobj = z = core.find(loc => loc.name == bossrooms[5].oldroomname);
	landlordtemplate = z.actors[0];
	bossrooms[5].req = core.filter(loc => loc.name == "Yomi")[0].doors.requirements[logic].slice();
	z.name = bossrooms[5].changedroomname;
	landlordtemplate.locationName = z.name;

	// laruba: name: 'Laruba Mansion - Camilla Fight',
	//         actors[0].requirements[logic]
	bossrooms[0].roomobj = z = core.find(loc => loc.name == bossrooms[0].oldroomname);
	bosses[0].bossobj = z.actors[0];
	bossrooms[0].req = z.actors[0].requirements[logic].slice();
	z.name = bossrooms[0].changedroomname;
	z.actors.shift();

	// berk:   name: 'Berkeley Mansion - Part 2',
	//         actors.filter( a => a.name == "merchant" )[0].requirements[logic]
	bossrooms[1].roomobj = z = JSON.parse(JSON.stringify(core.find(loc => loc.name == bossrooms[1].oldroomname)));
	bosses[1].bossobj = JSON.parse(JSON.stringify(landlordtemplate));
	bosses[1].bossobj.pointer = bosses[1].romaddr;
	bossrooms[1].req = z.actors.filter( a => a.name == "merchant" )[0].requirements[logic].slice();
	z.actors = [];
	z.submap = 2;
	z.entryRoom = z.name;
	z.name = bossrooms[1].newroomname;
	core.unshift(z);

	//   rover:  name: 'Rover Mansion - Part 2',
	//           actors.filter( a => a.name == "merchant" )[0].requirements[logic]
	bossrooms[2].roomobj = z = JSON.parse(JSON.stringify(core.find(loc => loc.name == bossrooms[2].oldroomname)));
	bosses[2].bossobj = JSON.parse(JSON.stringify(landlordtemplate));
	bosses[2].bossobj.pointer = bosses[2].romaddr;
	bossrooms[2].req = z.actors.filter( a => a.name == "merchant" )[0].requirements[logic].slice();
	z.actors = [];
	z.submap = 2;
	z.entryRoom = z.name;
	z.name = bossrooms[2].newroomname;
	core.unshift(z);

	//   brahm:  name: 'Brahm Mansion - Death Fight',
	//           actors[0].requirements[logic]
	bossrooms[3].roomobj = z = core.find(loc => loc.name == bossrooms[3].oldroomname);
	bosses[3].bossobj = z.actors[0];
	bossrooms[3].req = z.actors[0].requirements[logic].slice();
	z.name = bossrooms[3].changedroomname;
	z.actors.shift();

	//   bod:    name: 'Bodley Mansion - Part 2',
	//           actors.filter( a => a.name == "merchant" )[0].requirements[logic]
	bossrooms[4].roomobj = z = JSON.parse(JSON.stringify(core.find(loc => loc.name == bossrooms[4].oldroomname)));
	bosses[4].bossobj = JSON.parse(JSON.stringify(landlordtemplate));
	bosses[4].bossobj.pointer = bosses[4].romaddr;
	bossrooms[4].req = z.actors.filter( a => a.name == "merchant" )[0].requirements[logic].slice();
	z.actors = [];
	z.submap = 2;
	z.entryRoom = z.name;
	z.name = bossrooms[4].newroomname;
	core.unshift(z);

	///////////
	// fill new boss actor lists. we will swap pointers to these.
	// don't touch camilla/death lists, maybe we can be compatible with betterboss mods?
	pat.push( {"offset": bosses[1].romaddr, "bytes": bosses[1].actorblock} );
	pat.push( {"offset": bosses[2].romaddr, "bytes": bosses[2].actorblock} );
	pat.push( {"offset": bosses[4].romaddr, "bytes": bosses[4].actorblock} );


	///////////
	// Do The Rando Thing: pick which mansions have bosses.
	shuffleArray(bosses, rng);
	//console.log(bosses);


	///////////
	// set new boss actor requirements/values, and update logic flow
	for(i=0;i<5;++i) {
		let boss = bosses[i].bossobj,
			room = bossrooms[i].roomobj;
		if(boss.requirements) {
			boss.requirements[logic] = bossrooms[i].req;
		}
		//boss.pointer = bosses[i].romaddr;
		boss.area = room.area;
		boss.submap = room.submap;
		boss.locationName = room.name;
		// $930a (0x531a) if camilla, set correct area value for itemdrop condition
		// note: if more bosses are added, this must become more complicated.
		if(boss.name == "Camilla") {
			pat.push( {"offset": 0x531a, "bytes": [boss.area]} );
		}

		room.pattern["value"] = bosses[i].tilesheet;
		room.pattern["pointer"] = bossrooms[i].tiletableloc;
		room.actors.push(boss);
	}


	///////////
	// [dynamic] mansion map stuff from above.

	// $9251 [DYNAMIC] move bod gate index value (wall or no wall) from $9a69 to roverspace
	b = get_current_bytes(0x9a79, [ 2 ] );
	pat.push( {"offset": 0x9261, "bytes": b} );

	// OLD $924C [DYNAMIC] shift entire rover gate struct down 2 bytes from $924a
	// $8d54 [DYNAMIC] move entire rover gate struct into berkspace from $924a
	// $60 $92 $00,$FC,$02,$05,$FF,$00,$01 $57 $92:
	b = get_current_bytes(0x925a, [ 96, 146, 0, 252, 2, 5, 255, 0, 1, 87, 146 ] );
	pat.push( {"offset": 0x8d64, "bytes": b} );

	// $8d31 [DYNAMIC] laruba2_10 (Map1_1_ten) add passwall $33 SE corner to boss (if boss)
	//       else solid wall $07
	if(bosses[0].bossobj.boss) {
		pat.push( {"offset": 0x8d41, "bytes": [0x33]} );
	} else {
		pat.push( {"offset": 0x8d41, "bytes": [0x7]} );
	}

	// $9234 [DYNAMIC] berk open east exit passwall to new bossroom (if boss)
	if(bosses[1].bossobj.boss) {
		pat.push( {"offset": 0x9244, "bytes": [0x33]} );
	}

	// $935a $9362 [DYNAMIC] rover1 add 2x2 passwall $0D to new (real) orbroom (if boss)
	// $92b1 and rover2 orbroom ptr to new passable orbroom $9a19 (if boss)
	if(bosses[2].bossobj.boss) {
		pat.push( {"offset": 0x936a, "bytes": [0xd]} );
		pat.push( {"offset": 0x9372, "bytes": [0xd]} );
		pat.push( {"offset": 0x92c1, "bytes": [0x19,0x9a]} );
	}

	// $9705 [DYNAMIC] replace brahm corridor w passable orbroom $9a19(stock val) (if boss)
	//           else nonpassable orbroom $8857
	//{ "offset": 38677, "bytes": [ 25, 154 ] },
	if(bosses[3].bossobj.boss) {
		pat.push( {"offset": 0x9715, "bytes": [0x19, 0x9a]} );
	}else{
		pat.push( {"offset": 0x9715, "bytes": [0x57, 0x88]} );
	}

	// $9e3d [DYNAMIC] bod2 room7 add breakable/passable walls to access underneath (if boss)
	// so, $9e68 to  $9, $e, $40,$40,$40,$40,$40,$40,$40, $0D
	if(bosses[4].bossobj.boss) {
		pat.push( {"offset": 0x9e78, "bytes": [ 9, 14, 64, 64, 64, 64, 64, 64, 64, 13 ]} );
	}


	///////////
	// actor lists.
	// all rom addresses become (-0x4000 +0x10)

	//// laruba
	// (laruba3 ptr is set by shuffler)
	// $9a06 set defunct laruba4 list ptr to some $FF at $9aba
	pat.push( {"offset": 0x5a16, "bytes": [0xba, 0x9a]} );
	// $ 9a55 (list) laruba2 2 orbroom enemies (indexes 0x11 y=$26,0x14 y=$20) move north to at most y = 0x1c,
	//          and move SE platform enemy (index 0x15 y=$30) south 2 tiles along with platform,
	//          and replace last enemy (index 0x17) to orb [$0D+roomX,$07+roomY,$25,$1C]
	// orbroom enemy up
	idx = 0x5a65 + (0x11 * 4) + 1;
	b = get_current_bytes(idx, [0x26]);
	b[0] = b[0] - (0x26 - 0x1c);
	pat.push( {"offset": idx, "bytes": b} );
	// orbroom enemy up
	idx = 0x5a65 + (0x14 * 4) + 1;
	b = get_current_bytes(idx, [0x20]);
	b[0] = b[0] - (0x20 - 0x1c);
	pat.push( {"offset": idx, "bytes": b} );
	// platform enemy down
	idx = 0x5a65 + (0x15 * 4) + 1;
	b = get_current_bytes(idx, [0x30]);
	b[0] = b[0] + 2;
	pat.push( {"offset": idx, "bytes": b} );
	// orb
	idx = 0x5a65 + (0x17 * 4);
	pat.push( {"offset": idx, "bytes": [0xd + (0x10 * 2), 0x7 + (0xe * 2), 0x25, 0x1c]} );
	// ($9abb repurpose old orb as boss for berk/rover/bod)

	//// berk
	// $9ac0 expand actor pointer table forward 2 bytes into berk1, setting new ptrs,
	//       (boss list ptrs are set after)
	pat.push( {"offset": 0x5ad0, "bytes": [0xc6, 0x9a, 0x2b, 0x9b]} ); //,0,0]} );
	// $9ac6 berk1 shrink forward 2 bytes from $9ac4,
	//       and remove bottom enemy (index 0xa x=$18 y=$26) in breakable cage
	idx = 0x5ad4;
	b = get_current_bytes(idx, [
		0x04,0x0E,0x05,0x02,0x05,0x28,0x22,0xA4,0x08,0x10,0x03,0x02,0x08,0x14,0x03,0x02,
		0x0C,0x08,0x03,0x02,0x0C,0x1E,0x05,0x02,0x14,0x0E,0x1F,0x01,0x14,0x18,0x0F,0x02,
		0x18,0x08,0x03,0x02,0x18,0x1E,0x03,0x02, 0x18,0x26,0x03,0x02, 0x1C,0x0E,0x1F,0x01,
		0x1C,0x18,0x1F,0x01,0x24,0x0E,0x1F,0x01,0x24,0x18,0x1F,0x01,0x28,0x08,0x03,0x02,
		0x28,0x18,0x1F,0x01,0x28,0x1E,0x03,0x02,0x2C,0x0E,0x1F,0x01,0x2C,0x26,0x0F,0x02,
		0x34,0x0C,0x03,0x02,0x34,0x26,0x03,0x02,0x38,0x06,0x03,0x02,0x3C,0x0C,0x03,0x02,
		0x3C,0x22,0x03,0x02,0x3E,0x0C,0x27,0x1E,0xFF
	]);
	b = b.slice(0, 0xa * 4).concat(b.slice(0xb * 4));
	pat.push( {"offset": idx + 2, "bytes": b} );
	// $9b2b berk2 simple move back 2 bytes from $9b2d
	idx = 0x5b3d;
	b = get_current_bytes(idx, [
		0x01,0x0C,0x27,0x1F,0x04,0x26,0x0F,0x02,0x07,0x0C,0xAE,0x06,0x08,0x22,0x05,0x02,
		0x0C,0x06,0x0D,0x02,0x0C,0x26,0x0F,0x02,0x14,0x1C,0x03,0x02,0x14,0x22,0x05,0x02,
		0x14,0x26,0x05,0x02,0x18,0x06,0x0D,0x02,0x18,0x16,0x03,0x02,0x1C,0x0C,0x03,0x02,
		0x1C,0x12,0x03,0x02,0x1C,0x26,0x05,0x02,0x28,0x12,0x03,0x02,0x28,0x1E,0x03,0x02,
		0x28,0x24,0x03,0x02,0x2C,0x16,0x1F,0x01,0x2C,0x1A,0x03,0x02,0x2C,0x26,0x03,0x02,
		0x2E,0x16,0x27,0x20,0x34,0x26,0x1F,0x01,0x38,0x26,0x1F,0x01,0x3D,0x15,0x25,0x18,
		0xFF
	]);
	pat.push( {"offset": idx - 2, "bytes": b} );

	//// rover
	// $92c5 redirect master ptr to rover's shifted table at $9b8c
	pat.push( {"offset": 0x52d5, "bytes": [0x8c, 0x9b]} );
	// $9b8c expand ptr table back 2 bytes from $9b8e, overwriting berk2 actors,
	//       (boss list ptrs are set after)
	pat.push( {"offset": 0x5b9c, "bytes": [0x92, 0x9b, 0xf7, 0x9b]} ); //,0,0]} );
	// ($9b92 leave rover1 alone)
	// $9bf7 (list) rover2
	//        top center enemy (index 0xc x=$2c y=$08) to orbroom moving block [+$f,+$d,$34,$84] (if boss, else FF FF FF FF),
	//        and move orb (index 0x11) to NW room [$0D+roomX,$07+roomY,$25,$19] (if boss)
	//        TODO? fake orb. need another actor.
	idx = 0x5c07;
	b = get_current_bytes(idx, [
		0x03,0x28,0x0D,0x04,0x07,0x28,0x0D,0x04, 0x14,0x14,0x03,0x04,0x14,0x1C,0x03,0x04,
		0x18,0x16,0x03,0x04,0x18,0x22,0x03,0x04,0x24,0x08,0x03,0x04,0x24,0x12,0x03,0x04,
		0x24,0x1A,0x05,0x04,0x24,0x25,0x21,0x85,0x28,0x0E,0x03,0x04,0x28,0x1A,0x05,0x04,
		0x2C,0x08,0x03,0x04, 0x34,0x08,0x05,0x04,0x34,0x28,0x0D,0x04,0x38,0x22,0x03,0x04,
		0x38,0x28,0xAE,0x06, 0x3D,0x15,0x25,0x19, 0x3E,0x08,0x27,0x21,0x3E,0x22,0x27,0x22,
		0xFF
	]);
	if(bosses[2].bossobj.boss) {  // boss
		// first 2 enemies
		b = b.slice(0, 0x2 * 4)
			// insert new orb
			.concat( [0xd, 0x7, 0x25, 0x19] )
			// slice out enemy
			.concat(b.slice(0x2 * 4, 0xc * 4))
			// slice out old orb
			.concat(b.slice(0xd * 4, 0x11 * 4))
			// truncate FF
			.concat(b.slice(0x12 * 4, -1))
			// append moving block
			.concat( [0xe + (0x10 * 3), 0xd + (0xe), 0x34, 0x84] )
			// new FF
			.concat( [0xff] );
		pat.push( {"offset": idx, "bytes": b} );
	} else {  // no boss
		// technically I don't need to do anything, but I don't want the presence
		// of that one enemy to give away there isn't a boss here.
		idx += 0xc * 4;
		b = b.slice(0xd * 4);
		pat.push( {"offset": idx, "bytes": b} );
	}

	//// brahm
	// $9c48 set shifted brahm1,2 list ptrs (boss list ptrs are set after)
	pat.push( {"offset": 0x5c58, "bytes": [0x54, 0x9c, 0xb5, 0x9c]} );
	// ($9c4e repurpose brahm4 ptr + 1 brahm2 enemy (6 bytes total) for new boss actor)
	// $9c54 brahm1 simple move forward 4 bytes from $9c50, overwriting 1 brahm2 enemy
	b = get_current_bytes(0x5c60, [
		0x01,0x10,0x27,0x23,0x03,0x10,0x03,0x08,0x04,0x2E,0x03,0x08,0x08,0x1E,0x03,0x08,
		0x08,0x2A,0x1F,0x04,0x0C,0x16,0x03,0x08,0x0C,0x24,0x1F,0x04,0x0C,0x30,0x05,0x08,
		0x14,0x0E,0x03,0x08,0x14,0x24,0x05,0x08,0x18,0x08,0x0F,0x08,0x18,0x16,0x03,0x08,
		0x18,0x2A,0x03,0x08,0x18,0x30,0x05,0x08,0x1C,0x0E,0x03,0x08,0x1C,0x1E,0x03,0x08,
		0x23,0x16,0xAE,0x06,0x24,0x20,0x05,0x08,0x24,0x30,0x1F,0x04,0x24,0x36,0x1F,0x04,
		0x28,0x08,0x05,0x08,0x28,0x18,0x05,0x08,0x28,0x1C,0x05,0x08,0x2C,0x26,0x03,0x08,
		0xFF
	]);
	pat.push( {"offset": 0x5c64, "bytes": b} );
	// $9cb5 brahm2 shrink forward 4 bytes from $9cb1,
	//        corridor-to-orbroom: remove 3 enemies (index 2,3,5),
	//        insert orb [$0D+roomX,$07+roomY,$25,$1A] before book(x=$e),
	//        insert moving block [+$f,+$d,$34,$84] at end (if boss, else FF FF FF FF)
	idx = 0x5cc1;
	b = get_current_bytes(idx, [
		0x04,0x0C,0x0F,0x08,0x04,0x16,0x05,0x08, 0x04,0x32,0x11,0x04, 0x08,0x32,0x11,0x04,
		0x0C,0x0C,0x0F,0x08, 0x0C,0x32,0x11,0x04, 0x0E,0x18,0x27,0x24, 0xFF
	]);
	// first 2 enemies, slice out index 2,3
	b = b.slice(0, (2 * 4))
		// slice out index 5
		.concat(b.slice(4 * 4, 5 * 4))
		// insert orb
		.concat( [0xd, 0x7 + (0xe * 3), 0x25, 0x1A] )
		// get book, truncate FF
		.concat(b.slice(6 * 4, -1))
		// append block (if boss)
		.concat( bosses[3].bossobj.boss ? [0xe, 0xd + (0xe * 3), 0x34, 0x84] : [0xff] )
		// new FF
		.concat( [0xff] );
	pat.push( {"offset": idx + 4, "bytes": b} );
	// (#9cce leave brahm3 alone)
	// ($9cd3 repurpose brahm4 old orb as boss for berk/rover/bod)

	//// bod NOTE: if I could figure out stairs, I may not need elevators!
	// $9efa expand ptr table forward 2 bytes into bod1, set new ptrs,
	//       (boss list ptrs are set after)
	pat.push( {"offset": 0x5f0a, "bytes": [0x00, 0x9f, 0x4d, 0x9f]} ); //,0,0]} );
	// $9f00 bod1 shrink forward 2 bytes from $9efe, remove 3 rocks (index 2,3,4)
	idx = 0x5f0e;
	b = get_current_bytes(idx, [
		0x04,0x0C,0x03,0x0F,0x08,0x28,0x05,0x0F, 0x09,0x0C,0x3E,0x00,0x0A,0x0C,0x3E,0x00,
		0x0B,0x0C,0x3E,0x00, 0x0C,0x0C,0x3E,0x00,0x0D,0x0C,0x3E,0x00,0x0E,0x0C,0x3E,0x00,
		0x0F,0x0C,0x3E,0x00,0x14,0x12,0x1F,0x08,0x14,0x28,0x03,0x0F,0x18,0x0C,0x03,0x0F,
		0x18,0x1A,0x03,0x0F,0x18,0x20,0x03,0x0F,0x1C,0x12,0x1F,0x08,0x24,0x08,0x03,0x0F,
		0x24,0x28,0x03,0x0F,0x28,0x06,0x03,0x0F,0x28,0x20,0x03,0x0F,0x34,0x0C,0x03,0x0F,
		0x34,0x20,0x03,0x0F,0x3C,0x06,0x03,0x0F,0xFF
	]);
	b = b.slice(0, 2 * 4).concat(b.slice(5 * 4));
	pat.push( {"offset": idx + 2, "bytes": b} );
	// $9f4d bod2 expand back 0xa bytes from $9f57,
	//       add 2 moving platforms under SE corner:
	//       (before idx $13) [$37,$30,$22,$e1]
	//       --(before idx $15) [$3b,$30,$22,$81]
	//       hang on, try [$39,$32,$22,$81] instead
	idx = 0x5f67;
	b = get_current_bytes(idx, [
		0x04,0x0C,0x03,0x0F,0x04,0x14,0x03,0x0F,0x04,0x2E,0x03,0x0F,0x08,0x06,0x03,0x0F,
		0x08,0x14,0x03,0x0F,0x08,0x1A,0x03,0x0F,0x08,0x20,0x03,0x0F,0x08,0x2C,0x03,0x0F,
		0x0C,0x0C,0x03,0x0F,0x0C,0x36,0x03,0x0F,0x14,0x36,0x03,0x0F,0x18,0x30,0x03,0x0F,
		0x18,0x2A,0xAE,0x06,0x1C,0x1A,0x03,0x0F,0x1C,0x36,0x03,0x0F,0x28,0x1A,0x03,0x0F,
		0x2C,0x16,0x27,0x25,0x2D,0x31,0x25,0x1B,0x34,0x28,0x0D,0x06, 0x38,0x14,0x05,0x0F,
		0x38,0x1A,0x05,0x0F, 0x3C,0x20,0x05,0x0F,0xFF
	]);
	b = b.slice(0, 0x13 * 4)
		.concat( [0x37,0x30,0x22,0xe1] )
		.concat(b.slice(0x13 * 4, 0x15 * 4))
		.concat( [0x39,0x32,0x22,0x81] )
		.concat(b.slice(0x15 * 4));
	pat.push( {"offset": idx - 0xa, "bytes": b} );


	//////////////
	// actually patch the boss actor ptrs
	for(i=0;i<5;++i) {
		x = bosses[i].ramaddr;
		pat.push( {"offset": bossrooms[i].actorptrloc, "bytes": [x % 0x100, Math.floor(x / 0x100)] } );
	}


	///////////
	// boss room sprite indexes into enemizer zone table.
	for(i=0;i<5;++i) {
		pat.push( {"offset": bossrooms[i].tiletableloc, "bytes": [bosses[i].tilesheet]} );
	}

	// fun test: yomi landlord is drac
	pat.push( {"offset": 0x520F, "bytes": drac_boss_info[0]} );
	pat.push( {"offset": bossrooms[5].tiletableloc, "bytes": [drac_boss_info[1]]} );



//temp debug
//x = core.filter(loc => loc.name.search("Boss") > 0);
//x.forEach( (l) => {
//	console.log(l.actors[0]);
//	console.log(l.actors[0].locationName);
//	} );
/*
bossrooms.forEach(x => {
	console.log(x);
	console.log(x.roomobj.actors[x.roomobj.actors.length - 1]);
//cv2r-1.8.12-3LdDInSuJN8olM7N.spoiler-log
});
*/

/*
	const actors = core
		.filter(loc => loc.actors && loc.actors.length > 0)
		.reduce((a, c) => {
			return a.concat( c.actors.reduce((b,d) => {return [[c["name"], d]]}, []) );
		}, []);
	console.log(actors);
	actors.filter(a => a[1].holdsItem).forEach(actor => {
		console.log("/////////");
		console.log(actor[0]);
		console.log(actor[1].actorRequirements[logic]);
		console.log(actor[1].requirements[logic]);
	});
*/

/*
	const {
			utils: { TEXT_MAP_TITLE, textToBytes }
		} = require('../../../lib');
	//textToBytes(text, TEXT_MAP_TITLE)
	//titlePrint('  randomizer  ', 0x01041E);
	//titlePrint(titlePad(string, 24), 0x010179);
	s = textToBytes('  boss randoX beta 0.2  ', TEXT_MAP_TITLE);
	s[0xc] = 0x5c;
	pat.push( {"offset": 0x010179, "bytes": s} );
*/
	///////////
	// send all results to pm
	for(i in pat) {
		//console.log(i+","+pat[i]["offset"]+","+pat[i]["bytes"]);
		pm.add(pat[i]["bytes"], pat[i]["offset"]);
	}
}
// end build patch stuff func
////////////////////////////////


// NOTE this must execute AFTER enemizer, town-rando, map-rando, **AND enemy-hp**.
//      but BEFORE itemizer.
module.exports =
{
	pre: true,
	order: 120,
	id: "boss-rando-plus",
	name: "Boss Rando Plus",
	requires: "enemizer",
	conflicts: "boss-rando",
	version: BOSSPLUS_CURRENT_VERSION,
    author: "OranjSkueez",
	description: "Randomizes which mansions have bosses.",
	type: "random",
    character: "",
    flaglabel: "brp",
	patch: build_patch_stuff
};

