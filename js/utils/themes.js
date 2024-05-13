// ************ Themes ************
var themes = ["default","aqua","honey","memories","factory","void"]

var colors = {
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		line: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
	aqua: {
		1: "#bfdfff",
		2: "#8fa7bf",
		3: "#5f6f7f",
		color: "#dfdfdf",
		line: "#1CBDDD",
		points: "#ffffff",
		locked: "#A6AABF",
		background: "#0A1B33",
		background_tooltip: "rgba(0, 51, 153, 0.75)",
	},
	honey: {
		1: "#ffffff",
		2: "#bfbfbf",
		3: "#7f7f7f",
		color: "#dfdfdf",
		line: "#FFD299",
		points: "#FFD299",
		locked: "#BFACA2",
		background: "#19150C",
		background_tooltip: "rgba(24, 20, 0, 0.75)",
	},
	memories: {
		1: "#ffffff",
		2: "#bfbfbf",
		3: "#7f7f7f",
		color: "#dfdfdf",
		line: "#9A72E5",
		points: "#9A72E5",
		locked: "#C1A6BD",
		background: "#1E1433",
		background_tooltip: "rgba(5, 0, 15, 0.75)",
	},
	factory: {
		1: "#ffffff",
		2: "#cfcfcf",
		3: "#9f9f9f",
		color: "#cfcfcf",
		line: "#0f0f0f",
		points: "#ffffff",
		locked: "#7F7F7F",
		background: "#474747",
		background_tooltip: "rgba(15, 15, 15, 0.75)",
	},
	void: {
		1: "#7f7f7f",
		2: "#3f3f3f",
		3: "#1f1f1f",
		color: "#7f7f7f",
		line: "#3f3f3f",
		points: "#9f9f9f",
		locked: "#4C3939",
		background: "#030303",
		background_tooltip: "rgba(0, 0, 0, 0.875)",
	},
}
function changeTheme() {
	colors_theme = colors[options.theme || "default"];
	document.body.style.setProperty('--background', colors_theme["background"]);
	document.body.style.setProperty('--background_tooltip', colors_theme["background_tooltip"]);
	document.body.style.setProperty('--color', colors_theme["color"]);
	document.body.style.setProperty("--line", colors_theme["line"]);
	document.body.style.setProperty('--points', colors_theme["points"]);
	document.body.style.setProperty("--locked", colors_theme["locked"]);
}
function getThemeName() {
	return options.theme? options.theme : "default";
}

function switchTheme() {
	let index = themes.indexOf(options.theme)
	if (options.theme === null || index >= themes.length-1 || index < 0) {
		options.theme = themes[0];
	}
	else {
		index ++;
		options.theme = themes[index];
	}
	changeTheme();
	resizeCanvas();
}
