const { core, utils: { shuffleArray, randomInt} } = require('../../../lib');

const { log } = require('../../../lib/utils');
const leftcap = {
	jam : {
		rightoffset: 0xAE8F,
		objset: 4,
		area: 1,
		height: 1,
		heightoffset: 0xAEB9,
		name: 'Jam Wasteland (Deborah Cliff)',
	},
	vrad: {
		height: 1,
		objset: 4,
		area: 0,
		rightoffset:  0xAE82,
		heightoffset: 0xAEB6,
		name: 'Vrad Mountain - Part 2 (Diamond Dude)',
		
	},
	strigori:{
		height: 1,
		objset: 3,
		area: 1,
		heightoffset: 0xB3be,
		rightoffset: 0xb395,
		name: 'Storigoi Graveyard (Blob Boost)',
	}
}
const areas = {
	
	ondol: {
		leftoffset: 0x8675,
		rightoffset: 0x8678,
		objset: 0,
		area: 4,
		height: 3,
		heightoffset: 0x86C1,
		name: 'Ondol',
	},
	sadam: {
		
		leftoffset: 0xB3AA,
		rightoffset: 0xB3AD,
		objset: 3,
		area: 4,
		height: 1,
		heightoffset: 0xB3C1
	},
	sadam2: {
		leftoffset: 0xB39D,
		rightoffset: 0xB3A0,
		objset: 3,
		area: 2,
		height: 1,
		heightoffset: 0xB3C0,
		branch: {
			leftoffset: 0xB3B7,
			minlength: 0,
			maxlength: 2,
			height: 2
			
		}
	},
	alba: {
		leftoffset: 0x1FA1D,
		rightoffset: 0x1FA20,
		objset: 0,
		area: 3,
		height: 3,
		heightoffset: 0x1FA4C,
		name: 'Alba',
	},
	river : {
		leftoffset: 0xA183,
		rightoffset: 0xA186,
		objset: 2,
		area: 7,
		heightoffset: 0xA1C5,
		height:1,
		branch: {
			leftoffset: 0xa178,
			minlength: 1,
			maxlength: 2,
			height: 1,
			objset:2,
			area: 6,
			requirements: {
				standard: 'HEART',
				glitch: 'HEART',
				diamondWarp: 'HEART'
			},
		}
	},
	jova: {
		leftoffset: 0x1FA12, 
		rightoffset: 0x01FA15, 
		height: 2,
		heightoffset: 0x1FA4D,
		objset: 0,
		area: 0,
		name: 'Jova',
		
	},
	jovawoods: {
		leftoffset:0xA15C,
		rightoffset: 0xA15F,
		height: 1,
		rightheight: 1,
		heightoffset: 0xA1CA,
		objset:  2,
		area: 0,
		throughbranch: {
			rightoffset: 0xA1B5,
			minlength: 1,
			maxlength: 2,
			objset: 2,
			area: 3,
			leftoffset: 0xA6E3,
			
		},
	},
	deniswoods: {
		leftoffset: 0xA16D,
		rightoffset: 0xa170,
		height: 1,
		heightoffset: 0xA1C6,
		objset: 2,
		area: 1
	},
	berkleydoor: {
		leftoffset: 0x8D4D,
		rightoffset: 0x8D50,
		height: 1,
		heightoffset:0x8D72,
		objset: 1,
		area: 1,
		name: 'Berkeley Mansion - Door',
		
		
	},
	brahmdoor: {
		height: 1,
		leftoffset: 0x968E,
		rightoffset: 0x9691,
		objset: 1,
		area: 3,
		heightoffset: 0x96ac,
		name: 'Brahm Mansion - Door',
	},
	deniswoods2: {
		leftoffset:0xA6C9,
		rightoffset: 0xA6CC,
		height: 1,
		heightoffset: 0xA6F3,
		objset: 2,
		area: 4,
	},
	dabispath: {
		leftoffset: 0xA6B8,
		rightoffset: 0xA6BB,
		height: 1,
		rightheight: 1,
		heightoffset: 0xA6F5,
		objset: 2,
		area: 3,
		name: 'Dabi\'s Path - Part 2',
		
		rightbranch: {
			heightoffset: 0xa6f5,
			rightoffset: 0xA6EA,
			usefc: true,
			height: 1,
			objset: 2,
			area: 3,
			minlength: 1,
			maxlength: 2,
		}
	},
	aljibawoods: {
		leftoffset: 0xA6AD,
		rightoffset:0xA6B0,
		height: 1,
		heightoffset: 0xA6F1,
		objset: 2,
		area: 2,
		
	},
	aljiba: {
		leftoffset: 0x1FAD5,
		rightoffset: 0x1FAD8,
		height: 2,
		heightoffset: 0x1FB34,
		objset: 0,
		area: 2,
		name: 'Aljiba',
	},
	bodley: {
		height: 1,
		leftoffset: 0x9A64,
		rightoffset: 0x9A67,
		objset:1,
		area: 4,
		heightoffset: 0x9a7c,
		name: 'Bodley Mansion - Door',
	},
	laruba: {
		height: 1,
		leftoffset: 0x88DA,
		rightoffset: 0x88DD,
		heightoffset: 0x8902,
		objset: 1,
		area: 0,
		name: 'Laruba Mansion - Door',
	},
	ditch: {
		leftoffset: 0xAE99,
		rightoffset: 0xAE9C,
		height: 1,
		heightoffset: 0xAEBA,
		objset: 4,
		area: 2,
	},
	doina: {
		height: 1,
		leftoffset: 0x1FAE0,
		rightoffset: 0x1FAE3,
		heightoffset: 0x80E2,
		objset: 0,
		area: 5,

	},
	yomi: {
		height: 1,
		leftoffset: 0x1FAEB,
		rightoffset: 0x1FAEE,
		heightoffset: 0x80E2,
		objset: 0,
		area: 6,
		
	},
	bridgeofdoom: {
		height: 1,
		leftoffset: 0xA192,
		rightoffset: 0xA195,
		heightoffset: 0xA1C9,
		objset: 2,
		
		area: 8,
		rightbranch: {
			rightoffset: 0xA1BD,
			height: 2,
			objset: 2,
			area: 8,
			minlength: 1,
			maxlength: 2,
			mustbeheight1: true,
		},
	}
	
};

var midcap = {
	leftoffset: 0xB385,
	height: 1,
	objset: 3,
	area: 0,
	rightoffset: 0xB388,
	heightoffset: 0xb3bd,
	
};
var rightcap = {
		rover: {
			leftoffset: 0xA6D6,
			height: 1,
			objset: 2,
			area: 5,
			requirements: {
				standard: 'BLUE_CRYSTAL',
				glitch: 'BLUE_CRYSTAL',
				diamondWarp: 'BLUE_CRYSTAL'
			},
			name: 'Rover Mansion - Door'
		},
		bordia: {
			leftoffset: 0xa1a1,
			height: 1,
			objset: 2,
			area: 9,
		},
		castlevania: {
			leftoffset: 0xAEA4,
			height: 1,
			objset: 4,
			area: 3,
			
		}
}
module.exports = {
	pre: true,
	order:1,
	id: 'map-rando',
	name: 'Map Randomizer',
	description: 'Map is randomized',
	patch: function (pm, opts) {
		const { logic, rng } = opts;
		
		var keys=Object.keys(areas);
		
		
		
		
		var last;
		shuffleArray(keys, rng);
		var leftcaps = Object.keys(leftcap);
		shuffleArray(leftcaps, rng);
		last = leftcap[leftcaps[0]];
		var rightcaps = Object.keys(rightcap);
		shuffleArray(rightcaps, rng);
		console.log("starting leftcap" +leftcaps[0]); 
		leftcaps.splice(0, 1);
		sizeofleft= randomInt(rng, 5, 10);
		console.log(keys.indexOf("jova"));
		if (keys.indexOf("jova") > 5 ) {
			keys.splice(5, 0, keys.splice(keys.indexOf("jova"), 1)[0]);	
			console.log("jova moved to front");
		}
		
		
		while (keys.length>0 && sizeofleft > 0) {
			pm.add([0xFF, areas[keys[0]].objset,areas[keys[0]].area ], last.rightoffset);
			pm.add([0xFF, last.objset, last.area ], areas[keys[0]].leftoffset);
			if (last.name){
				updatelogic(last.name, logic, '');
			}
			var height = last.height;
			if (last.rightheight != null ){
				height = last.rightheight;
				
			}
			adjustheight(last.heightoffset, height, areas[keys[0]].height, pm);
			
			
			last = areas[keys[0]];
			console.log("going to "+keys[0]);
			keys.splice(0, 1);
			if (last.rightbranch){ 
				
				var screens = randomInt(rng, last.rightbranch.minlength, last.rightbranch.maxlength);
				
				var i = 0;
				
				last2 = last;
				while (screens > 0 && keys[i] ){
					if (areas[keys[i]].rightbranch || areas[keys[i]].throughbranch ||areas[keys[i]].branch){
						i++;
						continue;
					}
					
					if (last2.rightbranch){
						if (last2.rightbranch.mustbeheight1 && areas[keys[i]].height > 1){
							i++;
							continue;
						}
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.rightbranch.rightoffset);
						if (last2.rightbranch.usefc){
							pm.add([0xFC, last2.rightbranch.objset,last2.rightbranch.area ], areas[keys[i]].leftoffset);
						}else {
							pm.add([0xFF, last2.rightbranch.objset,last2.rightbranch.area ], areas[keys[i]].leftoffset);
						}
					}else {
						pm.add([0xFF, last2.objset,last2.area ], areas[keys[i]].leftoffset);
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.rightoffset);
					}
					
					var height = last2.height;
					if (last2.branch){ 
						height = last2.branch.height;
					
					}
					
					
					adjustheight(areas[keys[i]].heightoffset, height, areas[keys[i]].height, pm);
					
					last2 = areas[keys[i]];
					keys.splice(i, 1);
					screens--;

				}
				
				//then we put a rightcap on in it
				var right = rightcap[rightcaps[0]];
				
				rightcaps.splice(0, 1);
				
				
				if (last2.rightbranch){
					pm.add([0xFF, right.objset, right.area ], last2.rightbranch.rightoffset);
					if (last2.rightbranch.usefc){
							pm.add([0xFC, last2.rightbranch.objset,last2.rightbranch.area ], right.leftoffset);
						}else {
							pm.add([0xFF, last2.rightbranch.objset,last2.rightbranch.area ], right.leftoffset);
						}
				}else {
					pm.add([0xFF, last2.objset,last2.area ], right.leftoffset);
					pm.add([0xFF, right.objset, right.area ], last2.rightoffset);	
				}
				var height = last2.height;
				if (last2.rightbranch){ 
					height = last2.rightbranch.height;
					
				}
				adjustheight(last2.heightoffset, height, right.height, pm);
				if (last2.name){
						updatelogic(last2.name, logic, branchreqs);
					}
					
				if (right.name){
					if (right.requirements){
						updatelogic(right.name, logic, right.requirements[logic]);
					}
					
				}
				
			}
			if (last.throughbranch){
				//this is veros underground we go and connect to the that tile with some number of random tiles
				var branchreqs = '';
				if (last.throughbranch.requirements){
					branchreqs = last.throughbranch.requirements[logic];
				}
				
				var screens = randomInt(rng, last.throughbranch.minlength, last.throughbranch.maxlength);
				
				var i = 0;
				
				last2 = last;
				while (screens > 0 && keys[i] ){
					if (areas[keys[i]].branch || areas[keys[i]].height != 1){
						i++;
						continue;
					}
					
					if (last2.throughbranch){
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.throughbranch.rightoffset);
						pm.add([0xFC, last2.objset,last2.area ], areas[keys[i]].leftoffset);
					}else {
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.rightoffset);
						pm.add([0xFF, last2.objset,last2.area ], areas[keys[i]].leftoffset);
					}
										
					
					if (last2.name){
						updatelogic(last2.name, logic, branchreqs);
					}
					last2 = areas[keys[i]];
					keys.splice(i, 1);
					screens--;

				}
				
				pm.add([0xFC, last.throughbranch.objset, last.throughbranch.area ], last2.rightoffset);
				pm.add([0xFF, last2.objset, last2.area ], last.throughbranch.leftoffset);
				
				
				
				
			}
			if (last.branch){
				//we go the other way through a branch and connect to a leftcap
				//or we start from a new leftcap and go to this cap
				var branchreqs = '';
				if (last.branch.requirements){
					branchreqs = last.branch.requirements[logic];
				}
				
				var screens = randomInt(rng, last.branch.minlength, last.branch.maxlength);
				
				var i = 0;
				
				last2 = last;
				while (screens > 0 && keys[i] ){
					if (areas[keys[i]].branch || areas[keys[i]].throughbranch || areas[keys[i]].rightbranch ){
						i++;
						continue;
					}
					
					if (last2.branch){
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.branch.leftoffset);
						pm.add([0xFF, last2.branch.objset,last2.branch.area ], areas[keys[i]].rightoffset);
					}else {
						pm.add([0xFF, last2.objset,last2.area ], areas[keys[i]].rightoffset);
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.leftoffset);
					}
					
					var height = last2.height;
					if (last2.branch){ 
						height = last2.branch.height;
					
					}
					
					
					adjustheight(areas[keys[i]].heightoffset, areas[keys[i]].height, height, pm);
					
					
					if (last2.name){
						updatelogic(last2.name, logic, branchreqs);
					}
					last2 = areas[keys[i]];
					keys.splice(i, 1);
					screens--;

				}
				
				//then we put a leftcap on in it
				var left = leftcap[leftcaps[0]];
				
				leftcaps.splice(0, 1);
				
				pm.add([0xFF, last2.objset,last2.area ], left.rightoffset);
				if (last2.branch){
					pm.add([0xFF, left.objset, left.area ], last2.branch.leftoffset);
				}else {
				
					pm.add([0xFF, left.objset, left.area ], last2.leftoffset);	
				}
				var height = last2.height;
				if (last2.branch){ 
					height = last2.branch.height;
					
				}
				adjustheight(left.heightoffset, left.height, height, pm);
				if (last2.name){
						updatelogic(last2.name, logic, branchreqs);
					}
				if (left.name){
					updatelogic(left.name, logic, branchreqs);
					
				}
			}
			
			
			
			sizeofleft -=1;
		}
		
		pm.add([0xFF, midcap.objset, midcap.area ], last.rightoffset);
		pm.add([0xFF, last.objset, last.area ], midcap.leftoffset);
		
		if (midcap.name){
			updatelogic(midcap.name, logic, '');
		}
		var height = last.height;
		if (last.rightheight != null ){
			height = last.rightheight;
			
		}
		adjustheight(last.heightoffset, last.height, midcap.height, pm);
		var requirements="";
		if (logic === "standard"){
			requirements = "(WHITE_CRYSTAL && BLUE_CRYSTAL && RED_CRYSTAL)";
			
		}
		last = midcap;
		console.log("part b "+keys[0]);
		while (keys.length>0) {
			
			pm.add([0xFF, areas[keys[0]].objset,areas[keys[0]].area ], last.rightoffset);
			pm.add([0xFF, last.objset, last.area ], areas[keys[0]].leftoffset);
			if (last.name){
				updatelogic(last.name, logic, requirements);
			}
			var height = last.height;
			if (last.rightheight != null ){
				height = last.rightheight;
				
			}
			adjustheight(last.heightoffset, height, areas[keys[0]].height, pm);
			
			
			last = areas[keys[0]];
			console.log("going to " + keys[0]);
			keys.splice(0, 1);
			if (last.rightbranch){ 
				
				var screens = randomInt(rng, last.rightbranch.minlength, last.rightbranch.maxlength);
				
				var i = 0;
				
				last2 = last;
				while (screens > 0 && keys[i] ){
					if (areas[keys[i]].rightbranch || areas[keys[i]].throughbranch ||areas[keys[i]].branch){
						i++;
						continue;
					}
					
					if (last2.rightbranch){
						if (last2.rightbranch.mustbeheight1 && areas[keys[i]].height > 1){
							i++;
							continue;
						}
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.rightbranch.rightoffset);
						
						if (last2.rightbranch.usefc){
							pm.add([0xFC, last2.rightbranch.objset,last2.rightbranch.area ], areas[keys[i]].leftoffset);
							
						}else {
							pm.add([0xFF, last2.rightbranch.objset,last2.rightbranch.area ], areas[keys[i]].leftoffset);
						}
					}else {
						pm.add([0xFF, last2.objset,last2.area ], areas[keys[i]].leftoffset);
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.rightoffset);
					}
					
					var height = last2.height;
					if (last2.rightbranch){ 
						height = last2.rightbranch.height;
					
					}
					
					
					adjustheight(areas[keys[i]].heightoffset, height, areas[keys[i]].height, pm);
					if (last2.name){
						updatelogic(last2.name, logic, requirements);
					}
					last2 = areas[keys[i]];
					keys.splice(i, 1);
					screens--;

				}
				
				//then we put a rightcap on in it
				var right = rightcap[rightcaps[0]];
				
				rightcaps.splice(0, 1);
				
				
				if (last2.rightbranch){
					pm.add([0xFF, right.objset, right.area ], last2.rightbranch.rightoffset);
					if (last2.rightbranch.usefc){
						pm.add([0xFC, last2.objset,last2.area ], right.leftoffset);	
					}
				}else {
					pm.add([0xFF, last2.objset,last2.area ], right.leftoffset);
					pm.add([0xFF, right.objset, right.area ], last2.rightoffset);	
				}
				var height = last2.height;
				if (last2.rightbranch){ 
					height = last2.rightbranch.height;
					
				}
				adjustheight(last2.heightoffset, height, right.height, pm);
				if (last2.name){
						updatelogic(last2.name, logic, requirements);
					}
					
				if (right.name){
					if (right.requirements){
						
						updatelogic(right.name, logic, requirements+ "&& "+right.requirements[logic]);
					}else {
					
						updatelogic(right.name, logic, requirements);
					}
					
				}
				
			}
			if (last.throughbranch){
				//this is veros underground we go and connect to the that tile with some number of random tiles
// 				var branchreqs = '';
				if (last.throughbranch.requirements){
					branchreqs = last.throughbranch.requirements[logic];
				}
				
					
				var screens = randomInt(rng, last.throughbranch.minlength, last.throughbranch.maxlength);
				
				var i = 0;
				
				last2 = last;
				while (screens > 0 && keys[i] ){
					if (areas[keys[i]].branch || areas[keys[i]].height != 1){
						i++;
						continue;
					}
					if (areas[keys[i]].rightbranch || areas[keys[i]].throughbranch || areas[keys[i]].branch){
						i++;
						continue;
					}
					if (last2.throughbranch){
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.throughbranch.rightoffset);
						pm.add([0xFC, last2.objset,last2.area ], areas[keys[i]].leftoffset);
					}else {
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.rightoffset);
						pm.add([0xFF, last2.objset,last2.area ], areas[keys[i]].leftoffset);
					}
										
					
					if (last2.name){
						updatelogic(last2.name, logic, requirements);
					}
					last2 = areas[keys[i]];
					keys.splice(i, 1);
					screens--;

				}
				
				pm.add([0xFC, last.throughbranch.objset, last.throughbranch.area ], last2.rightoffset);
				pm.add([0xFF, last2.objset, last2.area ], last.throughbranch.leftoffset);
				
				
				
				
			}
			if (last.branch){
				//we go the other way through a branch and connect to a leftcap
				//or we start from a new leftcap and go to this cap
				var branchreqs = '';
				if (last.branch.requirements){
					branchreqs = last.branch.requirements[logic];
				}
				
				var screens = randomInt(rng, last.branch.minlength, last.branch.maxlength);
				
				var i = 0;
				
				last2 = last;
				while (screens > 0 && keys[i] ){
					if (areas[keys[i]].branch || areas[keys[i]].throughbranch || areas[keys[i]].rightbranch){
						i++;
						continue;
					}
					
					if (last2.branch){
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.branch.leftoffset);
						pm.add([0xFF, last2.branch.objset,last2.branch.area ], areas[keys[i]].rightoffset);
					}else {
						pm.add([0xFF, last2.objset,last2.area ], areas[keys[i]].rightoffset);
						pm.add([0xFF, areas[keys[i]].objset, areas[keys[i]].area ], last2.leftoffset);
					}
					
					var height = last2.height;
					if (last2.branch){ 
						height = last2.branch.height;
					
					}
					
					
					adjustheight(areas[keys[i]].heightoffset, areas[keys[i]].height, height, pm);
					
					
					if (last2.name){
						if (branchreqs && requirements){
							updatelogic(last2.name, logic, "("+requirements+") && ("+branchreqs+")");
						}else if (branchreqs){
						
							updatelogic(last2.name, logic, branchreqs);
						}
						else if (requirements){
							updatelogic(last2.name, logic, requirements);
							
						}
					}
					last2 = areas[keys[i]];
					keys.splice(i, 1);
					screens--;

				}
				
				//then we put a leftcap on in it
				var left = leftcap[leftcaps[0]];
				
				leftcaps.splice(0, 1);
				
				pm.add([0xFF, last2.objset,last2.area ], left.rightoffset);
				if (last2.branch){
					pm.add([0xFF, left.objset, left.area ], last2.branch.leftoffset);
				}else {
				
					pm.add([0xFF, left.objset, left.area ], last2.leftoffset);	
				}
				var height = last2.height;
				if (last2.branch){ 
					height = last2.branch.height;
					
				}
				adjustheight(left.heightoffset, left.height, height, pm);
				if (last2.name){
						if (branchreqs && requirements) {
							updatelogic(last2.name, logic, "("+requirements+") && ("+branchreqs+")");
						}else if (requirements){ 
							updatelogic(last2.name, logic, requirements);
						}else if (branchreqs) {
							updatelogic(last2.name, logic, branchreqs);
							
						}
					}
				if (left.name){
					updatelogic(left.name, logic, branchreqs);
					
				}
			}
			//then we put a rightcap on in it
				

		}
		
		var right = rightcap[rightcaps[0]];
				
				rightcaps.splice(0, 1);
				
				pm.add([0xFF, last.objset,last.area ], right.leftoffset);
				if (last.rightbranch){
					pm.add([0xFF, right.objset, right.area ], last.rightbranch.rightoffset);
				}else {
				
					pm.add([0xFF, right.objset, right.area ], last.rightoffset);	
				}
				var height = last.height;
				if (last.rightbranch){ 
					height = last.rightbranch.height;
					
				}
				adjustheight(last.heightoffset, height, right.height, pm);
				if (last.name){
					updatelogic(last.name, logic, requirements);
				}
					
				if (right.name){
					if (right.requirements){
						updatelogic(right.name, logic, right.requirements[logic]);
					}
					
				}
		
		
		
		const tornadovalue= [0xFF, 3, 0];
		const tornadooffset = 0xAE8C;
		const tornadodestobjset = [3];
		pm.add(tornadovalue, tornadooffset);
		pm.add(tornadodestobjset, 0x1d092);
		
		updatelogic('Debious Woods - Part 3', logic, "(RED_CRYSTAL && BLUE_CRYSTAL && WHITE_CRYSTAL && HEART && NAIL && RIB && RING && MAGIC_CROSS && GARLIC && HOLY_WATER)");
	}
	
}




function adjustheight(heightoffset, height1, height2, pm) {
		
		if (height1 != height2){
					if (height1 > height2) {
						value = 256 - (height1 - height2);
					}
					if (height1 < height2) {
						value = Math.abs(height1 - height2);
					}
					pm.add([value], heightoffset);
				}else {
					
					pm.add([0], heightoffset);
				
				}
	
}
function updatelogic(area, logic, townReqs) {
	
		const actors = core
				.filter(loc => loc.name === area)
				.reduce((a, c) => {
					return a.concat(c.actors || []);
				}, []);
		actors.filter(a => a.holdsItem).forEach(actor => {
				var actorReqs ='';
				if (actor.actorRequirements){
					actorReqs= actor.actorRequirements[logic];
				}
				
				let newReqs;
				if (townReqs && actorReqs) {
					newReqs = `(${townReqs}) && (${actorReqs})`;
				} else if (townReqs) {
					newReqs = townReqs;
				} else if (actorReqs) {
					newReqs = actorReqs;
				} else {
					newReqs = '';
				}
				actor.requirements[logic] = newReqs;
				if (newReqs){
					console.log(actor.name + "now logic: " +newReqs);
				}
			});
		
		let doors = core.find(c => c.name == area).doors;
			if (doors === undefined ){
				return;
				
			}
			
			doors.requirements[logic] = townReqs;
			doors.data.forEach(door => {
				const actors = core
				.filter(loc => loc.objset === door.target.objset && loc.area === door.target.area)
				.reduce((a, c) => {
					return a.concat(c.actors || []);
				}, []);
			actors.filter(a => a.holdsItem).forEach(actor => {
				const actorReqs = actor.actorRequirements[logic];
				let newReqs;
				if (townReqs && actorReqs) {
					newReqs = `(${townReqs}) && (${actorReqs})`;
				} else if (townReqs) {
					newReqs = townReqs;
				} else if (actorReqs) {
					newReqs = actorReqs;
				} else {
					newReqs = '';
				}
				actor.requirements[logic] = newReqs;
				if (newReqs){
					console.log(door.name + " "+ actor.name + "now logic: " +newReqs);
				}
			});
				
				
				
			});
	
}
