const { assemble, bank, core, utils: { modSubroutine, shuffleArray, randomInt, textToBytes} } = require('../../../lib');
const path = require('path');
const { log } = require('../../../lib/utils');

const heightmap = {
	254 : [0xB1, 0x86],
	255 : [0x24, 0xFB],
	00 : [0xB0, 0x86],
	01 : [0xE1, 0xA6],
	02 : [0xA9, 0xAE],
	
}
var map = [];
var leftbranches = [];
var rightbranches = [];
var centerbranch = [];
var tornadorequires = "WHITE_CRYSTAL && BLUE_CRYSTAL && RED_CRYSTAL";
const leftcap = {
	"jam wasteland" : {
		rightoffset: 0xAE8F,
		objset: 4,
		area: 1,
		height: 1,
		heightoffset: 0xAEB9,
		heightoffsetpointer: 0xAE89,
		rightsubmap:1,
		heightmap: [0x00, 0x02],
		name: 'Jam Wasteland (Deborah Cliff)',
		mustbeleft: true,
		tornadosource: true,
	},
	"vrad mountain": {
		height: 1,
		objset: 4,
		area: 0,
		rightoffset:  0xAE82,
		heightoffset: 0xAEB6,
		heightmap: [0x00, 0x00],
		heightoffsetpointer: 0xAE7C,
		rightsubmap:1,
		
		name: 'Vrad Mountain - Part 2 (Diamond Dude)',
		
	},
	"storigoi":{
		height: 1,
		objset: 3,
		area: 1,
		heightoffset: 0xB3be,
		rightoffset: 0xb395,
		name: 'Storigoi Graveyard (Blob Boost)',
		heightmap: [0x00],
		heightoffsetpointer: 0xB38F,
		rightsubmap:0,
		
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
		heightoffsetpointer: 0x8672,
		rightsubmap:0,
	},
	sadam: {
		
		leftoffset: 0xB3AA,
		righttype: 0xf9,
		rightoffset: 0xB3AD,
		objset: 3,
		area: 4,
		height: 1,
		heightoffset: 0xB3C1,
		heightmap: [0x00],
		heightoffsetpointer: 0xB3A7,
		rightsubmap:0,
		
		
	},
	sadamwoods: {
		leftoffset: 0xB39D,
		lefttype: 0xf9,
		rightoffset: 0xB3A0,
		objset: 3,
		area: 2,
		height: 1,
		heightoffset: 0xB3C0,
		branch: {
			leftoffset: 0xB3B7,
			minlength: 0,
			maxlength: 2,
			height: 2,
			objset: 3,
			area: 2,
			onlyheight1: true,
			fcrequired: true,
		},
		heightmap: [0x00, 0x02, 0xFF, 0x00, 0x00],
		heightoffsetpointer: 0xB39A,
		rightsubmap:1,
		
	},
	alba: {
		leftoffset: 0x1FA1D,
		rightoffset: 0x1FA20,
		objset: 0,
		area: 3,
		height: 3,
		heightoffset: 0x1FA4C,
		name: 'Alba',
		heightoffsetpointer: 0x1FA1A,
		rightsubmap: 0,
		
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
		},
// 		mustbeleft: true,
		heightoffsetpointer: 0xA180,
		rightsubmap: 2,
	},
	jova: {
		leftoffset: 0x1FA12, 
		rightoffset: 0x01FA15, 
		height: 2,
		heightoffset: 0x1FA4D,
		objset: 0,
		area: 0,
		name: 'Jova',
		nobranch: true,
		mustbeleft: true,
		heightoffsetpointer: 0x1FA0F,
		rightsubmap: 0,
	},
	jovawoods: {
		leftoffset:0xA15C,
		rightoffset: 0xA15F,
		righttype: 0xf9,
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
			throughname: "Dabi's Path",
		
		},
		heightoffsetpointer: 0xA159,
		rightsubmap: 3,
	},
	deniswoods: {
		leftoffset: 0xA16D,
		rightoffset: 0xa170,
		lefttype: 0xf9,
		height: 1,
		heightoffset: 0xA1C6,
		objset: 2,
		area: 1,
		heightoffsetpointer: 0xA16A,
		rightsubmap: 0,
		
		
	},
	berkleydoor: {
		leftoffset: 0x8D4D,
		rightoffset: 0x8D50,
		height: 1,
		heightoffset:0x8D72,
		objset: 1,
		area: 1,
		name: 'Berkeley Mansion - Door',
		
		heightoffsetpointer: 0x8D4A,
		rightsubmap: 0,
		
	},
	brahmdoor: {
		height: 1,
		leftoffset: 0x968E,
		rightoffset: 0x9691,
		objset: 1,
		area: 3,
		heightoffset: 0x96ac,
		name: 'Brahm Mansion - Door',
		heightoffsetpointer: 0x968B,
		rightsubmap: 0,
		
	},
	deniswoods2: {
		leftoffset:0xA6C9,
		rightoffset: 0xA6CC,
		righttype: 0xF9,
		height: 1,
		heightoffset: 0xA6F3,
		objset: 2,
		area: 4,
		heightoffsetpointer: 0xA6C6,
		rightsubmap: 1,
		
	},
	dabispath: {
		leftoffset: 0xA6B8,
		lefttype: 0xf9,
		rightoffset: 0xA6BB,
		righttype: 0xf9,
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
			onlyheight1: true,
		},
		heightoffsetpointer: 0xA6B5,
		rightsubmap: 3,
		
	},
	aljibawoods: {
		leftoffset: 0xA6AD,
		rightoffset:0xA6B0,
		lefttype: 0xf9,
		height: 1,
		heightoffset: 0xA6F1,
		objset: 2,
		area: 2,
		heightoffsetpointer: 0xA6AA,
		rightsubmap: 0,
		
	},
	aljiba: {
		leftoffset: 0x1FAD5,
		
		rightoffset: 0x1FAD8,
		height: 2,
		heightoffset: 0x1FB34,
		objset: 0,
		area: 2,
		name: 'Aljiba',
		heightoffsetpointer: 0x1FAD2,
		rightsubmap: 0,
		
	},
	bodley: {
		height: 1,
		leftoffset: 0x9A64,
		rightoffset: 0x9A67,
		objset:1,
		area: 4,
		heightoffset: 0x9a7c,
		name: 'Bodley Mansion - Door',
		heightoffsetpointer: 0x9A61,
		rightsubmap: 0,
		
	},
	laruba: {
		height: 1,
		leftoffset: 0x88DA,
		rightoffset: 0x88DD,
		heightoffset: 0x8902,
		objset: 1,
		area: 0,
		name: 'Laruba Mansion - Door',
		heightoffsetpointer: 0x88D7,
		rightsubmap: 0,
		
	},
	ditch: {
		leftoffset: 0xAE99,
		rightoffset: 0xAE9C,
		height: 1,
		heightoffset: 0xAEBA,
		objset: 4,
		area: 2,
		heightmap: [0x00],
		heightoffsetpointer: 0xAE96,
		rightsubmap: 0,
		
	},
	doina: {
		height: 1,
		leftoffset: 0x1FAE0,
		rightoffset: 0x1FAE3,
		//heightoffset: 0x80E2,
		objset: 0,
		area: 5,
		name: "Doina",
		heightoffsetpointer: 0x1FADD,
		rightsubmap: 0,
		
	},
	yomi: {
		height: 1,
		leftoffset: 0x1FAEB,
		rightoffset: 0x1FAEE,
		heightoffset: 0x100E2,
		objset: 0,
		area: 6,
		heightoffsetpointer: 0x1FAE8,
		rightsubmap: 0,
		name: 'Yomi'
	},
	veros:  {
		height: 1,
		objset: 0,
		area: 1,
		leftoffset: 0x866A,
		rightoffset: 0x866D,
		name: 'Veros',
		heightoffset: 0x86C0,
		heightoffsetpointer: 0x8667,
		rightsubmap: 0,
		
	},
	debiouswoods: {
		leftoffset:0xB7DA,
		rightoffset: 0xB7DD,
		objset: 3,
		area: 3,
		height: 1,
		addrequires: "(BLUE_CRYSTAL && WHITE_CRYSTAL && (HOLY_WATER || NAIL) && LAURELS)",
		
		name: 'Debious Woods - Part 3',
		
		//heightoffsetpointer: 0xB7D7,
		rightsubmap: 5,
		heightmap: [00, 02, 0xFF, 00, 00],
		
		
	},
	"bridge o doom": {
		height: 1,
		leftoffset: 0xA192,
		rightoffset: 0xA195,
		righttype: 0xf9,
		//heightoffset: 0xA1C9,  //also used elsewhere. yes grrr
		objset: 2,
		area: 8,
		rightbranch: {
			rightoffset: 0xA1BD,
			height: 2,
			objset: 2,
			area: 8,
			minlength: 1,
			maxlength: 2,
			onlyheight1: true,
		},
		zzz: "bridgeofdoom",
		heightoffsetpointer: 0xA18F,
		rightsubmap: 2,
		
	}
	
};

var midcap = {
	leftoffset: 0xB385,
	height: 1,
	objset: 3,
	area: 0,
	rightoffset: 0xB388,
	heightoffset: 0xb3bd,
	heightmap: [0x00, 0x00],
	heightoffsetpointer: 0xB382,
	rightsubmap: 1,
	name: 'Camilla Cemetery',	
};
var rightcap = {
		rover: {
			leftoffset: 0xA6D6,
			height: 1,
			objset: 2,
			area: 5,
			requirements: {
				standard: 'WHITE_CRYSTAL && BLUE_CRYSTAL',
				glitch: 'WHITE_CRYSTAL && BLUE_CRYSTAL',
				diamondWarp: 'WHITE_CRYSTAL && BLUE_CRYSTAL'
			},
			name: 'Rover Mansion - Door'
		},
		bordia: {
			leftoffset: 0xa1a1,
			lefttype: 0xf9,
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
	conflicts: 'Town-rando',
	//qol, random, difficulty, misc
	type: 'random',
    character: 'm',
	patch: function (pm, opts) {
		const { logic, rng } = opts;
		
		var keys=Object.keys(areas);
		
		
		
		
		var last;
		shuffleArray(keys, rng);
		
		var leftcaps = Object.keys(leftcap);
		shuffleArray(leftcaps, rng);
		
		var rightcaps = Object.keys(rightcap);
		shuffleArray(rightcaps, rng);
		//console.log("starting leftcap" +leftcaps[0]); 
		sizeofleft= randomInt(rng, 5, 10);
		//console.log(keys.indexOf("jova"));
		
		//we grab a town or mansion to be right of camilla cemetery for tornado to not derp.
		townsmansion = keys.filter( a => areas[a].objset === 1 || areas[a].objset === 0);
		shuffleArray(townsmansion, rng);
		reservedtown = keys.splice(keys.indexOf(townsmansion[0]), 1);
		if (reservedtown == "jova"){
			reservedtown = keys.splice(keys.indexOf(townsmansion[0]), 1);
			keys.unshift("jova");
		}
			
		//debious woods always goes first so it's in the first left branch
		keys.splice(0, 0, keys.splice(keys.indexOf("debiouswoods"), 1)[0]);	
		
		
		branches = keys.filter(a => areas[a].branch != null);
		
		j=0;
		
		while (j< branches.length){
				//we go the other way through a branch and connect to a leftcap
				//or we start from a new leftcap and go to this cap
				var branchreqs = '';
				if (areas[branches[j]].branch.requirements){
					branchreqs = areas[branches[j]].branch.requirements[logic];
				}
				
				
				areas[branches[j]].contains = [];
				var screens = randomInt(rng, areas[branches[j]].branch.minlength, areas[branches[j]].branch.maxlength);
				var i = 0;
				
				last2 = areas[branches[j]];
				leftbranches[j] = [];
				leftbranches[j].push(branches[j]);
				
				while (screens > 0 && keys[i] ){
					if (areas[keys[i]].branch || areas[keys[i]].throughbranch || areas[keys[i]].rightbranch || areas[keys[i]].nobranch ){
						i++;
						continue;
					}
					
					if ((last2.height >1 && areas[keys[i]].heightoffset == null)){
						i++;
						continue;
						
					}
					
					
					var rightfc = false;
					if (last2.branch){
						
						if (last2.branch.onlyheight1){
							if (areas[keys[i]].height > 1){
								i++;
                                
								continue;
							}
							rightfc= true;
							
						}
						attach(areas[keys[i]],last2,  {leftbranch: true, rightfc: rightfc}, pm);
					}	else {
						attach( areas[keys[i]],last2, {}, pm);
					}
					if (areas[keys[i]].name){
						areas[branches[j]].contains.push(areas[keys[i]].name);
					}
					
					if (areas[keys[i]].addrequires){
                        
                        
						if (branchreqs){
							branchreqs = "( "+branchreqs+") && ("+areas[keys[i]].addrequires+")";
						}else {
							branchreqs = areas[keys[i]].addrequires;
							
						}
						
					}
					
					if (last2.name){
						
						updatelogic(last2.name, logic, branchreqs);
					}
					
					last2 = areas[keys[i]];
					leftbranches[j].push(keys[i]);
					keys.splice(i, 1);
					screens--;
					
				}
				//throw a cap on it
				
			var left = leftcap[leftcaps[0]];
			leftbranches[j].push(leftcaps[0]);
			leftcaps.splice(0, 1);
			if (last2.branch){
				attach(left, last2, {leftbranch:true, rightfc: true}, pm);		
			}else {
				attach(left, last2, {}, pm);		
			}
			if (last2.name){
                
				updatelogic(last2.name, logic, branchreqs);
				
			}
			if (left.name){
				
				updatelogic(left.name, logic, branchreqs);
				areas[branches[j]].contains.push(left.name);
				
			}
			if (left.mustbeleft){
				areas[branches[j]].mustbeleft = true;
			}
			if (left.tornadosource && branchreqs){
				tornadorequires = "( "+ tornadorequires+" && "+branchreqs+")";
				//console.log("tornado now requires: "+tornadorequires);
				
			}
			j++;
		}
		branches = keys.filter(a => areas[a].throughbranch != null);
		//console.log(branches);
		j=0;
		while (j< branches.length){
				//we go the other way through a branch and connect to a leftcap
				//or we start from a new leftcap and go to this cap
				
				var screens = randomInt(rng, areas[branches[j]].throughbranch.minlength, areas[branches[j]].throughbranch.maxlength);
				var i = 0;
				centerbranch[j] = [];
				centerbranch[j].push(branches[j]);
				
				last2 = areas[branches[j]];
				areas[branches[j]].contains = [];
				
				while (screens > 0 && keys[i] ){
					if (areas[keys[i]].branch || areas[keys[i]].throughbranch || areas[keys[i]].rightbranch || areas[keys[i]].nobranch ){
						i++;
						continue;
					}
					if (areas[keys[i]].height > 1){
						i++;
						continue;
					}
// 					if (!areas[keys[i]].heightoffset && screens ==1) {
// 						i++;
// 						continue;
// 					}
// 					if (!last2.heightoffset && areas[keys[i]].height > 1 ){
// 						i++;
// 						continue;
// 					}
					if (last2.name){
						areas[branches[j]].contains.push(last2.name);
					}
					var leftfc = false;
					if (last2.throughbranch){
						leftfc= true;
						attach(last2, areas[keys[i]],  {throughbranch: true, leftfc: leftfc}, pm);
					}	else {
						attach( last2, areas[keys[i]], {}, pm);
					}
					
					last2 = areas[keys[i]];
					centerbranch[j].push(keys[i]);
					keys.splice(i, 1);
					screens--;
					
				}
				//throw a cap on it
				throughcap = areas[branches[j]];
				centerbranch[j].push(throughcap.throughbranch.throughname);
				
				pm.add([0xFC, throughcap.throughbranch.objset, throughcap.throughbranch.area ], last2.rightoffset);
				if (last2.righttype){
					pm.add([last2.righttype, last2.objset, last2.area ], throughcap.throughbranch.leftoffset);
				}else {
					pm.add([0xFF, last2.objset, last2.area ], throughcap.throughbranch.leftoffset);
				}
			
			j++;
		}
		branches = keys.filter(a => areas[a].rightbranch != null);
		//console.log(branches);
		j=0;
		while (j< branches.length){
				//we go the other way through a branch and connect to a leftcap
				//or we start from a new leftcap and go to this cap
				var branchreqs = '';
				if (areas[branches[j]].rightbranch.requirements){
					branchreqs = areas[branches[j]].rightbranch.requirements[logic];
				}
				areas[branches[j]].contains = [];
				rightbranches[j]=[];
				
				var screens = randomInt(rng, areas[branches[j]].rightbranch.minlength, areas[branches[j]].rightbranch.maxlength);
				var i = 0;
				
				last2 = areas[branches[j]];
				rightbranches[j].push(branches[j]);
				while (screens > 0 && keys[i] ){
					if (areas[keys[i]].branch || areas[keys[i]].throughbranch || areas[keys[i]].rightbranch || areas[keys[i]].nobranch ){
						i++;
						continue;
					}
					
					var leftfc = false;
					if (!last2.heightoffset && areas[keys[i]].height > 1) {
						i++;
						continue;
					}
					if (areas[keys[i]].name){
						areas[branches[j]].contains.push(areas[keys[i]].name);
					}
					
					if (last2.rightbranch){
						
						if (last2.rightbranch.onlyheight1){
							if (areas[keys[i]].height > 1){
								i++;
								continue;
							}
							leftfc= true;
							
						}
						attach(last2, areas[keys[i]],  {rightbranch: true, leftfc: leftfc}, pm);
					}else {
						attach( last2, areas[keys[i]], {}, pm);
					}
					if (last2.name){
                        
						updatelogic(last2.name, logic, branchreqs);
					}
					last2 = areas[keys[i]];
					rightbranches[j].push(keys[i]);
					keys.splice(i, 1);
					screens--;
					
				}
				//throw a cap on it
			var right = rightcap[rightcaps[0]];
			rightbranches[j].push(rightcaps[0]);
			rightcaps.splice(0, 1);
			attach(last2, right, {}, pm);		
			if (last2.name){
                
				updatelogic(last2.name, logic, branchreqs);
			}
			if (right.name){
				if (right.requirements && branchreqs){
                    
					updatelogic(right.name, logic, right.requirements[logic]+" && "+branchreqs);	
				}else if (right.requirements){
                    
					updatelogic(right.name, logic, right.requirements[logic]);	
				}else if (branchreqs) {
                    
					updatelogic(right.name, logic, right.branchreqs);	
				}else {
                    
					updatelogic(right.name, logic, "");	
				}
				
				areas[branches[j]].contains.push(right.name);
			
			}

			j++;
		}
		
		
		leftareas= keys.filter(a=> areas[a].mustbeleft === true);
		z = 0;
		console.log(leftareas);
		//console.log(keys);
		
		while (leftareas.length > z){
			
			const position = randomInt(rng, 0, sizeofleft-leftareas.length-1);
			keys.splice(position, 0, keys.splice(keys.indexOf(leftareas[z]), 1)[0]);	
			z++;
		}
		
		map.push(leftcaps[0]);
		last = leftcap[leftcaps[0]];
		leftcaps.splice(0, 1);
		
		
		while (keys.length>0 && sizeofleft > 0) {
			
			if (!last.heightoffset && areas[keys[0]].height > 1){
				//we need to adjust so we don't put this tile here
				//console.log("We're trying to put a non height 1 next to a height non-adjustable!"+ keys[0]);
				var i = 1;
				while (areas[keys[i]].height > 1){
					i+=1;
				}
				
				keys.splice(0, 0, keys.splice(i, 1)[0]);	
				
				
			}
			
			map.push(keys[0]);
			attach(last, areas[keys[0]], {}, pm);
			
			if (last.name){
				
				updatelogic(last.name, logic, '');
				
			}
			if (last.contains){
				
				
			}
			last = areas[keys[0]];
			
			keys.splice(0, 1);
			
			sizeofleft -=1;
		}
		attach(last, midcap, {}, pm);
// 		pm.add([0xFF, midcap.objset, midcap.area ], last.rightoffset);
// 		pm.add([0xFF, last.objset, last.area ], midcap.leftoffset);
		if (last.name){
            
			updatelogic(last.name, logic, '');
		}
		if (midcap.name){
            
			updatelogic(midcap.name, logic, '');
		}
		
		map.push(midcap.name);
		var height = last.height;
		if (last.rightheight != null ){
			height = last.rightheight;
			
		}
		adjustheight(last.heightoffsetpointer, last.rightsubmap, last.height, midcap.height, pm);
		var requirements="";
		if (logic === "standard"){
			requirements = tornadorequires;
			
		}
		last = midcap;
		var tornado = null;
		keys.unshift(reservedtown);
		//console.log("part b, post tornado");
		while (keys.length>0) {
			
// 			if (!last.heightoffset && areas[keys[0]].height > 1){
// 				//we need to adjust so we don't put this tile here
// 				//console.log("We're trying to put a non height 1 next to a height non-adjustable!"+ keys[0]);
// 				var i = 1;
// 				while (areas[keys[i]].height > 1){
// 					i+=1;
// 				}
// 				
// 				keys.splice(0, 0, keys.splice(i, 1)[0]);	
// 				
// 				
// 			}
			attach(last, areas[keys[0]], {}, pm);
			if (last.name && last != midcap){
                
				updatelogic(last.name, logic, requirements);
			}
			if (last.branch){
				
				
			}
			if (last.contains){
                branchreqs = requirements;
                
                
				if (last.branch && last.branch.requirements){
					branchreqs += "&& ("+last.branch.requirements[logic]+")";
				}
				if (last.rightbranch && last.rightbranch.requirements){
					branchreqs += "&& ("+last.rightbranch.requirements[logic]+")";
				}
				
				for (i=0; i< last.contains.length; i++) {
                    
					updatelogic(last.contains[i], logic, branchreqs);
                    //console.log("updating logic, "+last.contains[i]+" logic: "+logic+" requirements: "+branchreqs);
				}
			}
			
			//first town or mansion becomes tornado dest
			if (tornado === null ){
				if (areas[keys[0]].objset == 1 || areas[keys[0]].objset == 0 ){
					tornado = areas[keys[0]];
				
				}
			}
			map.push(keys[0]);
			last = areas[keys[0]];
			
			keys.splice(0, 1);
			
		}
		map.push(rightcaps[0]);
		var right = rightcap[rightcaps[0]];
				//console.log(last);
				rightcaps.splice(0, 1);
				attach(last, right, {}, pm);
				
				if (last.name){
                    
					updatelogic(last.name, logic, requirements);
				}
				if (last.contains) {
					
					for (i=0; i< last.contains.length; i++) {
                        
						updatelogic(last.contains[i], logic, requirements);
					}
				}
				if (right.name){
					if (right.requirements){
                        
						updatelogic(right.name, logic, right.requirements[logic]);
					}
					
				}
		
		
		if (tornado === null) {
			//tornado has no dest!
			log("ERROR NO DEST FOR TORNADO!");
		}
		const tornadovalue= [0xFF, tornado.objset, tornado.area];
		const tornadooffset = 0xAE8C;
		const tornadodestobjset = [tornado.objset];
		pm.add(tornadovalue, tornadooffset);
		pm.add(tornadodestobjset, 0x1d092);
 		//console.log(map.join("->"));
		signs(map, pm);
		leftbranches.forEach( branch => {
			const foo  = branch.reverse();
			signs(foo, pm)
		});
		centerbranch.forEach( branch => {
			signs(branch, pm)
		});
		rightbranches.forEach( branch => {
			//console.log(branch.join("->"));
			signs(branch, pm)
		});
		const exit = modSubroutine(pm.name, path.join(__dirname, 'transition.asm'), bank[7]);
		const code = `JMP $${exit.ram.toString(16)}`;
		var bytes = assemble(code);
		pm.add(bytes, 0x1D0E0);
		const exit2 = modSubroutine(pm.name, path.join(__dirname, 'transition2.asm'), bank[7]);
		const code2 = `JMP $${exit2.ram.toString(16)}`;
		bytes = assemble(code2);
 		bytes.push([0xEA]);
		pm.add(bytes, 0x1D201);
		
		//allow lake to be drained even if the screen is scrolled down some
		pm.add([0xA9, 0x00], 0x67CF);
		
		//remove the wall from the rover cave to prevent getting stuck
		pm.add([00], 0xA8A4);
		pm.add([00], 0xA89C);
		
		//updatelogic('Debious Woods - Part 3', logic, "(RED_CRYSTAL && BLUE_CRYSTAL && WHITE_CRYSTAL && HEART && NAIL && RIB && RING && MAGIC_CROSS && EYEBALL && GARLIC && HOLY_WATER)");
	
	const actors = core
				.reduce((a, c) => {
					return a.concat(c.actors || []);
				}, []);
	actors.filter(a => a.holdsItem).forEach(actor => {
        
//         console.log(actor.locationName+ " "+actor.name+" requires " +actor.requirements[logic]);
    });
    }
}

function signs (map, pm) {
// 	console.log(map);
	for ( i = 0; i < map.length; i++){
			var m = map[i];
			
			if (areas[m] != undefined){
				if (areas[m].name) {
				//console.log(areas[m]);
					const actors = core
					.filter(loc => loc.name === areas[m].name)
					.reduce((a, c) => {
						return a.concat(c.actors || []);
					}, []);
					//console.log(actors);
					const sign=actors.find(a => a.name == "sign");
					if (sign != undefined){
						//const line1= areas[m].name+"\n";
						var chars = 13 - areas[m].name.length;
						chars = Math.floor(chars/2);
						
						const line1 = " ".repeat(chars) + areas[m].name + "\n";
						
						const line2 = "Left for\n";
						var line3 = "";
						for (z=1; map[i-z] != undefined; z++){
							if (areas[map[i-z]] != undefined){
								if (areas[map[i-z]].name != undefined){
									
									line3 = areas[map[i-z]].name;
									line3 = line3.substring(0, 13);
									
									line3 += "\n";
									break;
								}
								
							}
							if (midcap.name == map[i-z]) {
									line3 = map[i-z].substring(0,13);
									line3 += "\n";
									break;
							}
						}
						if (line3 === "") {
							line3 = map[0]+"\n";
							
						}
						line3 = line3.replace('-', "");
						const line4 = "Right for\n";
						var line5 = "";
						for (z=1; map[i+z] != undefined; z++){
							if (areas[map[i+z]] != undefined){
								if (areas[map[i+z]].name){
									
									line5 = areas[map[i+z]].name;
									line5 = line5.substring(0, 13);
									line5 += "\n";
									break;
								}
							}
							if (midcap.name == map[i+z]) {
									line5 = map[i+z];
									line5 = line5.substring(0, 13);
									line5 += "\n";
									break;
							}
						}
						if (line5 === "" ) {
							line5 = map[map.length-1]+"\n";

						}
						line5 = line5.replace('-', "");
						var newtext = line1+line2+line3+line4+line5;
// 						console.log("text is now: " +newtext);
						newtext = newtext.substring(0, sign.text.length);
						const textBytes = textToBytes(newtext);
						pm.add(textBytes, sign.textPointer);
					}
				}
			}
	}
	
}

function attach (left, right, options, pm){
	var lefttype= 0xff;
	var righttype = 0xff;
	if (right.lefttype && !options.leftbranch) {
		righttype = right.lefttype;
	}
	if (left.righttype && !options.rightbranch){
		lefttype = left.righttype;
// 		console.log(left);
// 		console.log(left.righttype);
	}
	
	
	
	if (options.leftfc) {
		lefttype= 0xfc;
		
	}
	if (options.rightfc){
		righttype = 0xfc;
		
	}
// 	console.log(righttype+ "  "+lefttype);
	
	
// 	log ("left type: "+lefttype + " Right type: "+righttype);
	if (lefttype ==0xf9){
//  			log(lefttype+" "+ right.objset+" "+right.area);
//  			log(right);
			
		}
		if (righttype ==0xf9){
//  			log(righttype+" "+ left.objset+" "+left.area);
//  			log(left);
		}
	if (options.leftbranch) {
		pm.add([lefttype, left.objset, left.area ], right.branch.leftoffset);
		pm.add([righttype, right.branch.objset, right.branch.area ], left.rightoffset);
	}else if (options.throughbranch) {
		
		pm.add([lefttype, left.objset, left.area ], right.leftoffset);
		pm.add([righttype, right.objset, right.area ], left.throughbranch.rightoffset);
		
	}else if (options.rightbranch){
		
		pm.add([lefttype, left.rightbranch.objset, left.rightbranch.area ], right.leftoffset);
		pm.add([righttype, right.objset, right.area ], left.rightbranch.rightoffset);
		
	}else {
		pm.add([lefttype, left.objset, left.area ], right.leftoffset);
		pm.add([righttype, right.objset, right.area ], left.rightoffset);
		
	}
		
	
	
	if (options.noheightchange || left.heightoffsetpointer == null){
		//log("HEIGHT ISSUE");
	}else if (!options.leftfc && !options.rightfc) {
		adjustheight(left.heightoffsetpointer, left.rightsubmap, left.height, right.height, pm);
	}
	
	
}


function adjustheight(heightoffsetpointer, submap, height1, height2, pm) {
		if (!heightoffsetpointer) {
			log("no heightoffset! Probably a problem");
			if (height1 != height2){
 				log("height problem for sure");
			}
			return;
		}
		
		var value=0;
		if (height1 != height2){
					if (height1 > height2) {
						value = 256 - (height1 - height2);
					}
					if (height1 < height2) {
						value = Math.abs(height1 - height2);
					}
				}
		//pm.add([value], heightoffset);
		
// 		console.log(heightoffsetpointer.toString(16) + " -> "+value.toString(16)+ " : "+heightmap[value][1].toString(16) +heightmap[value][0].toString(16));
// 		console.log("submap: "+submap);
		var bytes =[];
		bytes[0]= heightmap[value][0];
		bytes[1]= heightmap[value][1];
		bytes[0]-=submap;
		pm.add(bytes, heightoffsetpointer);
		
		//console.log("left height:" + height1+ " right height: "+height2+" value: "+value +" heightoffset: "+heightoffset);
}

function countlogic(logic) {
	count=0;
	const actors = core.reduce((a, c) => {
					return a.concat(c.actors || []);
				}, []);
	actors.filter(a => a.holdsItem).forEach(actor => {
		
		if (actor.requirements[logic]){
			return;
		}else {
			//log(actor);
			count +=1
			
		}
		
	});
	
	
	return count;
}
function updatelogic(area, logic, townReqs) {
//         console.log("updating logic for "+area + " with "+townReqs);
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
				
				let newReqs='';
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
				
//  					console.log(actor.locationName);
//  					console.log(" now "+newReqs);
				
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
				let newReqs='';
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
 					
				
			});
				
				
				
			});
	
}
