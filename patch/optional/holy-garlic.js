module.exports = {
	"id": "holy-garlic",
	"name": "Holy Garlic",
	"version": "1.2",
    "author": "OranjSkueez",
	"description": "Garlic now breaks breakable floors",
	"type": "misc",
    "character": "%TOMB%",
	"patch": [
		{ "offset": 121292, "bytes": [ 32, 78, 219, 160, 7, 132, 151, 200, 169, 0, 32, 63, 218, 240, 240, 76, 169, 218 ] },
		{ "offset": 121504, "bytes": [ 32, 78, 219, 160, 255, 76, 193, 217, 165, 151, 48, 5, 32, 130, 223, 240, 209, 169, 22, 32, 24, 193, 76, 103, 218, 201, 1, 208, 235, 32, 100, 214, 166, 150, 96 ] }
	]
}
