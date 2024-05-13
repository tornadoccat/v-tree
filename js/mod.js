let modInfo = {
	name: "V's Reali-Tree",
	id: "vtree",
	author: "V",
	pointsName: "celestial cells",
	modFiles: ["layers.js", "tree.js"],

	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "",
	name: '"No one is better at making tree mods than me!"',
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v</h3><br>
		- Added V.`

let winText = `Congratulations! You helped V master their Reality!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	
	
	// Effects that boost point gen
	gain = gain.pow(tmp['v'].effect)	
	if (hasUpgrade('v', 24))    	gain = gain.pow(upgradeEffect('v', 24))	
	if (inChallenge('ra', 11))  	gain = gain.pow(3)	
	if (hasUpgrade('a', 10003)) 	gain = gain.pow(1/100)	
	
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [function() {return `
	<br>You are currently in ${inChallenge('ra', 11) ? "Recognition Therapy in" : ""} V's Reality.
`}
]

// Determines when the game "ends"
function isEndgame() {
	return player.v.points.gte(new Decimal("2").pow(1024))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}