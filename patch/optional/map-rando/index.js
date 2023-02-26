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
		mustbeleft: true,
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
			height: 2,
			objset: 3,
			area: 2,
			onlyheight1: true,
			fcrequired: true,
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
		},
		mustbeleft: true,
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
		//heightoffset: 0xA6F3,
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
			onlyheight1: true,
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
		//heightoffset: 0x80E2,
		objset: 0,
		area: 5,
		name: "Doina",
		
	},
	yomi: {
		height: 1,
		leftoffset: 0x1FAEB,
		rightoffset: 0x1FAEE,
		heightoffset: 0x80E2,
		objset: 0,
		area: 6,
		
	},
	veros:  {
		height: 1,
		objset: 0,
		area: 1,
		leftoffset: 0x866A,
		rightoffset: 0x866D,
		name: 'Veros',
	},
	debiouswoods: {
		leftoffset:0xB7DA,
		rightoffset: 0xB7DD,
		objset: 3,
		area: 3,
		height: 1,
		addrequires: "(BLUE_CRYSTAL && WHITE_CRYSTAL && (HOLY_WATER || NAIL) && LAURELS)",
		
		name: 'Debious Woods - Part 3'
	},
	bridgeofdoom: {
		height: 1,
		leftoffset: 0xA192,
		rightoffset: 0xA195,
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
		console.log(leftcaps);
		var rightcaps = Object.keys(rightcap);
		shuffleArray(rightcaps, rng);
		//console.log("starting leftcap" +leftcaps[0]); 
		sizeofleft= randomInt(rng, 5, 10);
		//console.log(keys.indexOf("jova"));
		if (keys.indexOf("jova") > sizeofleft ) {
			const position = randomInt(rng, 1, sizeofleft-2);
			keys.splice(position, 0, keys.splice(keys.indexOf("jova"), 1)[0]);	
			
		}
		
		//debious woods always goes first so it's in the first left branch
		keys.splice(0, 0, keys.splice(keys.indexOf("debiouswoods"), 1)[0]);	
		
		branches = keys.filter(a => areas[a].branch != null);
		//console.log(branches);
		j=0;
		console.log(keys);
		while (j< branches.length){
				//we go the other way through a branch and connect to a leftcap
				//or we start from a new leftcap and go to this cap
				var branchreqs = '';
				if (areas[branches[j]].branch.requirements){
					branchreqs = areas[branches[j]].branch.requirements[logic];
				}
				console.log("creating array for " + branches[j]);
				areas[branches[j]].contains = [];
				var screens = randomInt(rng, areas[branches[j]].branch.minlength, areas[branches[j]].branch.maxlength);
				var i = 0;
				
				last2 = areas[branches[j]];
				
				while (screens > 0 && keys[i] ){
					if (areas[keys[i]].branch || areas[keys[i]].throughbranch || areas[keys[i]].rightbranch || areas[keys[i]].nobranch ){
						i++;
						continue;
					}
					
					if ((last2.height >1 && areas[keys[i]].heightoffset == null)){
						i++;
						continue;
						
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
					if (last2.name){
						console.log("updating "+last2.name+" with "+branchreqs);
						updatelogic(last2.name, logic, branchreqs);
					}
					last2 = areas[keys[i]];
					
					keys.splice(i, 1);
					screens--;
					
				}
				//throw a cap on it
				
			var left = leftcap[leftcaps[0]];
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
				console.log(branches[j]+ " contains now " +left.name);
				updatelogic(left.name, logic, branchreqs);
				areas[branches[j]].contains.push(left.name);
				console.log(areas[branches[j]]);
			}
			if (left.mustbeleft){
				areas[branches[j]].mustbeleft = true;
				console.log("must be left!");
				console.log(left);
				console.log(areas[branches[j]]);
			}else {
				console.log("doesn't need to be left "+ j);
				console.log(left);
				
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
					if (!areas[keys[i]].heightoffset && screens ==1) {
						i++;
						continue;
					}
					if (!last2.heightoffset && areas[keys[i]].height > 1 ){
						i++;
						continue;
					}
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
					
					keys.splice(i, 1);
					screens--;
					
				}
				//throw a cap on it
				throughcap = areas[branches[j]];
				pm.add([0xFC, throughcap.throughbranch.objset, throughcap.throughbranch.area ], last2.rightoffset);
				pm.add([0xFF, last2.objset, last2.area ], throughcap.throughbranch.leftoffset)
			
			
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
				
				var screens = randomInt(rng, areas[branches[j]].rightbranch.minlength, areas[branches[j]].rightbranch.maxlength);
				var i = 0;
				
				last2 = areas[branches[j]];
				
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
					
					keys.splice(i, 1);
					screens--;
					
				}
				//throw a cap on it
			var right = rightcap[rightcaps[0]];
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
		
		
		leftareas= keys.filter(a=> areas[a].mustbeleft == true);
		z = 0;
		console.log(leftareas);
		while (leftareas.length > z){
			const position = randomInt(rng, 0, sizeofleft-1);
			keys.splice(position, 0, keys.splice(keys.indexOf(leftareas[z]), 1)[0]);	
			console.log(leftareas[z] + " must be left now "+position);
			z++;
		}
		
		
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
			
			
			attach(last, areas[keys[0]], {}, pm);
			
			if (last.name){
				
				updatelogic(last.name, logic, '');
				
			}
			if (last.contains){
				console.log("this is a branch " +last.name);
				console.log(last.contains);
			}
			last = areas[keys[0]];
			console.log(keys[0]);
			keys.splice(0, 1);
			
			sizeofleft -=1;
		}
		
		pm.add([0xFF, midcap.objset, midcap.area ], last.rightoffset);
		pm.add([0xFF, last.objset, last.area ], midcap.leftoffset);
		if (last.name){
		
			updatelogic(last.name, logic, '');
		}
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
		console.log("part b, post tornado");
		while (keys.length>0) {
			console.log(keys[0]);
			if (!last.heightoffset && areas[keys[0]].height > 1){
				//we need to adjust so we don't put this tile here
				//console.log("We're trying to put a non height 1 next to a height non-adjustable!"+ keys[0]);
				var i = 1;
				while (areas[keys[i]].height > 1){
					i+=1;
				}
				
				keys.splice(0, 0, keys.splice(i, 1)[0]);	
				
				
			}
			attach(last, areas[keys[0]], {}, pm);
			if (last.name){
				updatelogic(last.name, logic, requirements);
			}
			if (last.branch){
				console.log("this is a branch");
				
			}
			if (last.contains){
				console.log("branch");
				console.log(last);
				for (i=0; i< last.contains.length; i++) {
					updatelogic(last.contains[i], logic, requirements);
				}
			}
			
			
			last = areas[keys[0]];
			console.log(keys[0]);
			keys.splice(0, 1);

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
				if (last.contains) {
					console.log(last);
					for (i=0; i< last.contains.length; i++) {
						updatelogic(last.contains[i], logic, requirements);
					}
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
		
		//updatelogic('Debious Woods - Part 3', logic, "(RED_CRYSTAL && BLUE_CRYSTAL && WHITE_CRYSTAL && HEART && NAIL && RIB && RING && MAGIC_CROSS && EYEBALL && GARLIC && HOLY_WATER)");
	}
	
}

function attach (left, right, options, pm){
	var lefttype= 0xff;
	var righttype = 0xff;
	if (options.leftfc) {
		lefttype= 0xfc;
		
	}
	if (options.rightfc){
		righttype = 0xfc;
		
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
		pm.add([lefttype, right.objset, right.area ], left.rightoffset);
		pm.add([righttype, left.objset, left.area ], right.leftoffset);
	}
		
	
	
	if (options.noheightchange || left.heightoffset == null){
		
	}else {
		adjustheight(left.heightoffset, left.height, right.height, pm);
	}
	
	
}


function adjustheight(heightoffset, height1, height2, pm) {
		if (!heightoffset) {
			console.log("no heightoffset! Probably a problem");
			if (height1 != height2){
				console.log("height problem for sure");
				
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
		pm.add([value], heightoffset);
		//console.log("left height:" + height1+ " right height: "+height2+" value: "+value +" heightoffset: "+heightoffset);
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
				
					console.log(actor.locationName);
					console.log(" now "+newReqs);
				
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
					console.log(actor.locationName);
					console.log(" now "+newReqs);
				
			});
				
				
				
			});
	
}
