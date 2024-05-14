function basicVReset(layer) {
	let pupgs = []
	if(hasUpgrade('v', 41)) pupgs.push("41")
	if(hasUpgrade('v', 42)) pupgs.push("42")
	if(hasUpgrade('v', 43)) pupgs.push("43")
	if(hasUpgrade('v', 51)) pupgs.push("51")
	if(hasUpgrade('v', 52)) pupgs.push("52")
	if(hasUpgrade('v', 53)) pupgs.push("53")
	if(hasUpgrade('v', 61)) pupgs.push("61")
	let keep = []
	if(hasUpgrade('vp', 21) && layer=="vp") keep.push("upgrades") 
	if(hasUpgrade('vp', 22) && layer=="vp") keep.push("buyables") 
	if(layer=="vp") keep.push("v_resets") 
	layerDataReset("v",keep)
	if(((!hasUpgrade('vp', 21)) && layer=="vp") || (layer == "a") || (layer == "ra") || (layer == "vb") ) player["v"].upgrades = pupgs
}

function hasAffordableVUpgrades() {
	for (const element of Object.values(tmp.v.upgrades)) {
		if (parseInt(element.id) < 40 && element.unlocked && element.cost.lte(player.v.points) && !(player.v.upgrades.includes(Number(element.id)))) return true
		// this only looks at the first three rows, the other upgrades are special and aren't tested here
	}	
	return false
}
function hasAffordableVBuyables() {
	for (const element of Object.values(tmp.v.buyables)) {
		if (element.unlocked && element.cost.lte(player.v.points)) return true
	}	
	return false
}

addLayer("v", {
    name: "v points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "V", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		v_resets: new Decimal(0),
		best_points_min: new Decimal(0),
    }},
    color: "#FFE167",
    requires() {
		req = new Decimal(10)
		req = req.times(layers["v"].buyables[11].effect())
		
		if (hasUpgrade('a', 11)) req = req.div(2)
		if (hasUpgrade('a', 41)) req = req.div(3)
		if (hasUpgrade('a', 42)) req = req.times(10)

		if (hasUpgrade('v', 14)) req = req.times(upgradeEffect('v', 14))

		if(hasUpgrade('a', 10001)) req = req.max(10)
		
		return req
	},
    resource: "V points", // Name of prestige currency
    baseResource: "celestial cells", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/4, // Prestige currency exponent
    effect() {
		return player["v"].points.pow(0.4).add(1).log(2).add(1).pow(0.5)
	},
    effectDescription(){
	   return "raising cell gain to ^" + format(tmp[this.layer].effect)       
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade('v', 11)) mult = mult.times(upgradeEffect('v', 11))
		if (hasUpgrade('v', 12)) mult = mult.times(upgradeEffect('v', 12))
		if (hasUpgrade('v', 13)) mult = mult.times(upgradeEffect('v', 13))
		if (hasUpgrade('v', 21)) mult = mult.times(upgradeEffect('v', 21))
		if (hasUpgrade('v', 22)) mult = mult.times(upgradeEffect('v', 22))
		if (hasUpgrade('v', 23)) mult = mult.times(upgradeEffect('v', 23))
		if (hasUpgrade('v', 31)) mult = mult.times(upgradeEffect('v', 31))
		if (hasUpgrade('v', 32)) mult = mult.times(upgradeEffect('v', 32))
		if (hasUpgrade('v', 33)) mult = mult.times(upgradeEffect('v', 33))
		
		mult = mult.times(tmp["vp"].effect)
		if (hasUpgrade('vp', 11)) mult = mult.times(upgradeEffect('vp', 11))
		if (hasUpgrade('vp', 13)) mult = mult.times(upgradeEffect('vp', 13))
		if (hasUpgrade('vp', 31)) mult = mult.times(upgradeEffect('vp', 31))
		if (hasUpgrade('vp', 33)) mult = mult.times(upgradeEffect('vp', 33))
		if (hasUpgrade('vp', 42)) mult = mult.times(upgradeEffect('vp', 42))	
		if (hasUpgrade('vp', 16)) mult = mult.times(upgradeEffect('vp', 16))

		if (hasUpgrade('vp', 36)) mult = mult.times(upgradeEffect('vp', 36))
			
		if (hasUpgrade('a', 21)) mult = mult.times(upgradeEffect('a', 21))
		if (hasUpgrade('a', 22)) mult = mult.times(upgradeEffect('a', 22))
		if (hasUpgrade('a', 31)) mult = mult.times(upgradeEffect('a', 31))
		if (hasUpgrade('a', 32)) mult = mult.times(upgradeEffect('a', 32))
		if (hasUpgrade('a', 42)) mult = mult.times(8)
		if (hasUpgrade('a', 51)) mult = mult.times(upgradeEffect('a', 51))
		if (hasUpgrade('a', 52)) mult = mult.times(upgradeEffect('a', 52))
		if (hasUpgrade('a', 72)) mult = mult.div(4)
		if (hasUpgrade('a', 91)) mult = mult.div(100)
		if (hasUpgrade('a', 92)) mult = mult.times(2)
		if (hasUpgrade('a', 93)) mult = mult.times(10)
			
		if (hasUpgrade('a', 101)) mult = mult.times(100)
		if (hasUpgrade('a', 105)) mult = mult.times(upgradeEffect('a', 105))
			
		if (hasMilestone('a', 1)) mult = mult.times(am1eff())
			
		if (!inChallenge('ra', 11)) mult = mult.times(tmp["vb"].effect[0])
		
		mult = mult.times(buyableEffect("v",12))
		mult = mult.times(buyableEffect("v",22))
		mult = mult.times(buyableEffect("vp",13))
		
		if (hasMilestone('ra', 100)) mult = mult.times(raMilestoneEff(100))
		if (hasMilestone('ra', 206)) mult = mult.times(raMilestoneEff(206))
			
		if (hasUpgrade('a', 10004)) mult = mult.div(upgradeEffect('a', 10004))
	
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		pow = new Decimal(1)
		if (hasUpgrade('a', 1)) pow = pow.times(0.5)
		if (hasUpgrade('a', 10002)) pow = pow.times(0.9)
		if (hasUpgrade('vp', 55)) pow = pow.times(1.05)
		return pow
    },
	resetsNothing() {
        if (inChallenge('ra', 11)) return true
		return false		
	},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "V: Reset for v points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
			description: "Boost v point gain based on cells",
			cost: new Decimal(1),
			effect() {
				mult = player.points.pow(0.1).add(player.points.add(1).log(10)).max(1)
				if (hasUpgrade('vp', 43)) mult = mult.pow(upgradeEffect('vp', 43))	
				return mult
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked: true,
        },
        12: {
			description: "Boost v point gain based on v points",
			cost: new Decimal(10),
			effect() {
				return player["v"].points.pow(0.1).add(player["v"].points.add(1).log(10)).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasMilestone('a', 4) || hasUpgrade('v', 11)},
        },
        21: {
			description: "Boost v point gain based on cells again",
			cost: new Decimal(10),
			effect() {
				mult = player.points.pow(0.05).add(player.points.add(1).log(6)).sub(0.5).max(1)
				if (hasUpgrade('vp', 43)) mult = mult.pow(upgradeEffect('vp', 43))	
				return mult
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasMilestone('a', 4) || hasUpgrade('v', 11)},
        },
        13: {
			description: "Boost v point gain based on v upgrade amount",
			cost: new Decimal(100),
			effect() {
				return new Decimal(1).mul(1.2).pow(new Decimal(player["v"].upgrades.length).add(layers["v"].buyables[13].effect()))
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasMilestone('a', 4) || hasUpgrade('v', 12)},
        },
        22: {
			description: "Boost v point gain based on v points again",
			cost: new Decimal(100),
			effect() {
				return player["v"].points.pow(0.05).add(player["v"].points.add(1).log(6)).sub(1).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasMilestone('a', 4) || hasUpgrade('v', 12) || hasUpgrade('v', 21)},
        },
        31: {
			description: "Boost v point gain based on cells yet again",
			cost: new Decimal(100),
			effect() {
				mult = player.points.pow(0.025).add(player.points.add(1).log(4)).sub(1).max(1)
				if (hasUpgrade('vp', 43)) mult = mult.pow(upgradeEffect('vp', 43))	
				return mult
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasMilestone('a', 4) || hasUpgrade('v', 21)},
        },
        32: {
			description: "Boost v point gain based on v points yet again",
			cost: new Decimal(10000),
			effect() {
				return player["v"].points.pow(0.025).add(player["v"].points.add(1).log(4)).sub(2).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasMilestone('a', 4) || hasUpgrade('v', 22) || hasUpgrade('v', 31)},
        },
        23: {
			description: "Boost v point gain based on v upgrade amount again",
			cost: new Decimal(10000),
			effect() {
				return new Decimal(1).mul(1.3).pow(new Decimal(player["v"].upgrades.length).add(layers["v"].buyables[13].effect())).div(3).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasMilestone('a', 4) || hasUpgrade('v', 13) || hasUpgrade('v', 22)},
        },
        33: {
			description: "Boost v point gain based on v upgrade amount yet again",
			cost: new Decimal(100000),
			effect() {
				return new Decimal(1).mul(1.5).pow(new Decimal(player["v"].upgrades.length).add(layers["v"].buyables[13].effect())).div(10).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasMilestone('a', 4) || hasUpgrade('v', 32) || hasUpgrade('v', 23)},
        },
        41: {
			description: "Unlock V-Prestige.<br>(increase cost of other unlocks)",
			cost() {
				cost = new Decimal(10**6)
				if (hasUpgrade('v', 42)) cost = cost.times(1000)
				if (hasUpgrade('v', 43)) cost = cost.times(1000)
				if (hasUpgrade('v', 43) && !hasUpgrade('v', 41) && !hasUpgrade('v', 42)) cost = cost.div(2)
				return cost
			},
			unlocked() {return hasUpgrade('v', 33) || hasUpgrade('v', 41) || hasUpgrade('v', 42) || hasUpgrade('v', 43)},
        },
        42: {
			description: "Unlock V-Buyables.<br>(increase cost of other unlocks)",
			cost() {
				cost = new Decimal(10**6)
				if (hasUpgrade('v', 41)) cost = cost.times(1000)
				if (hasUpgrade('v', 43)) cost = cost.times(1000)
				if (hasUpgrade('v', 43) && !hasUpgrade('v', 41) && !hasUpgrade('v', 42)) cost = cost.div(2)
				return cost
			},
			unlocked() {return hasUpgrade('v', 33) || hasUpgrade('v', 41) || hasUpgrade('v', 42) || hasUpgrade('v', 43)},
        },
        43: {
			description: "Unlock V-Achievements.<br>(increase cost of other unlocks)",
			cost() {
				cost = new Decimal(10**6)
				if (hasUpgrade('v', 41)) cost = cost.times(1000)
				if (hasUpgrade('v', 42)) cost = cost.times(1000)
				return cost
				
			},
			unlocked() {return hasUpgrade('v', 33) || hasUpgrade('v', 41) || hasUpgrade('v', 42) || hasUpgrade('v', 43)},
        },
        14: {
			description: "V reset requirement x0.75",
			cost: new Decimal(10**10),
			effect() {
				return new Decimal(0.75)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return (hasMilestone('a', 4) || hasUpgrade('v', 13)) && hasMilestone('a', 3)},
        },	
        24: {
			description: "Square celestial cell gain",
			cost: new Decimal(10**20),
			effect() {
				return new Decimal(2)
			},
			effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
			unlocked() {return (hasMilestone('a', 4) || hasUpgrade('v', 23) || hasUpgrade('v', 14)) && hasMilestone('a', 3)},
        },		
        34: {
			description: "Quadruple v prestige point gain",
			cost: new Decimal(10**30),
			effect() {
				return new Decimal(4)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return (hasMilestone('a', 4) || hasUpgrade('v', 33) || hasUpgrade('v', 24)) && hasMilestone('a', 3)},
        },		
        51: {
			description: "Unlock more V-Prestige upgrades.<br>(increase cost of other unlocks)",
			cost() {
				cost = new Decimal(10**18)
				if (hasUpgrade('v', 52)) cost = cost.times(10**9)
				if (hasUpgrade('v', 53)) cost = cost.times(10**9)
				if (hasUpgrade('v', 52) && !hasUpgrade('v', 53) && !hasUpgrade('v', 51)) cost = cost.div(10**3)
				return cost
			},
			unlocked() {return hasMilestone('a', 3)},
        },
        52: {
			description: "Unlock more V-Buyables.<br>(increase cost of other unlocks)",
			cost() {
				cost = new Decimal(10**18)
				if (hasUpgrade('v', 51)) cost = cost.times(10**9)
				if (hasUpgrade('v', 53)) cost = cost.times(10**9)
				if (hasUpgrade('v', 51) && !hasUpgrade('v', 53) && !hasUpgrade('v', 52)) cost = cost.div(10**3)
				return cost
			},
			unlocked() {return hasMilestone('a', 3)},
        },
        53: {
			description: "Unlock more V-Achievements.<br>(increase cost of other unlocks)",
			cost() {
				cost = new Decimal(10**18)
				if (hasUpgrade('v', 51)) cost = cost.times(10**9)
				if (hasUpgrade('v', 52)) cost = cost.times(10**9)
				if (hasUpgrade('v', 52) && !hasUpgrade('v', 51) && !hasUpgrade('v', 53)) cost = cost.div(10**3)
				if (hasUpgrade('v', 51) && !hasUpgrade('v', 53) && !hasUpgrade('v', 52)) cost = cost.div(10**3)
				return cost
			},
			unlocked() {return hasMilestone('a', 3)},
        },
        61: {
			description: "Increase V Level 1 milestone base by 0.4",
			cost() {
				return new Decimal(10**300)
			},
			unlocked() {return hasUpgrade('vp', 55) && !inChallenge('ra', 11)},
        },
	},

	buyables: {
		11: {
			cost(x) { if(hasUpgrade('a', 10005)) x = x.times(2); 
				if(hasUpgrade('a', 61)) return new Decimal(8).pow(x.pow(1.08))
				return new Decimal(10).pow(x.pow(1.2)) 
			},
			display() { return ` Reduce v reset requirement by 10%.
                Effect: x${format(this.effect())}
                Level: ${format(player[this.layer].buyables[this.id])}${bonus2str()}
                Cost: ${format(this.cost())} V Points`}, 
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				var amt = getBuyableAmount("v", 11)
				if (hasUpgrade('vp', 64)) amt = amt.add(2)
				return new Decimal(0.9).pow(amt)
			},
			unlocked() {return hasUpgrade('v', 41) && hasUpgrade('v', 42)}
		},
		12: {
			cost(x) { if(hasUpgrade('a', 10005)) x = x.times(2); return new Decimal(10**6).mul(new Decimal(2).pow(x)) },
			display() { return ` Increase V Points earned by 1x.
                Effect: x${format(this.effect())}
                Level: ${format(player[this.layer].buyables[this.id])}${bonus2str()}
                Cost: ${format(this.cost())} V Points`}, 
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				var amt = getBuyableAmount("v", 12)
				if (hasUpgrade('vp', 64)) amt = amt.add(2)
				var mul = new Decimal(1).add(amt.mul(1))
				if(hasUpgrade('a', 62)) mul=mul.pow(2)
				return mul
			},
			unlocked() {return hasUpgrade('v', 42)}
		},
		13: {
			cost(x) { if(hasUpgrade('a', 10005)) x = x.times(2); return new Decimal(10**3).pow(x).mul(10**3) },
			display() { return ` Gain effective free v upgrades
                Effect: +${format(this.effect())}
                Level: ${format(player[this.layer].buyables[this.id])}${bonus2str()}
                Cost: ${format(this.cost())} V Points`}, 
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				var amt = getBuyableAmount("v", 13)
				if (hasUpgrade('vp', 64) && player.a.vachs[4] > 5) amt = amt.add(2)
				var mult = new Decimal(0.5)
				if(hasUpgrade('vp', 63)) mult = mult.times(2)
				if(hasUpgrade('a', 63)) return new Decimal(0).add(amt.pow(3/4).mul(mult))
				return new Decimal(0).add(amt.pow(0.5).mul(mult))
			},
			unlocked() {return hasUpgrade('v', 42) && hasUpgrade('v', 43)}
		},
		21: {
			cost(x) { if(hasUpgrade('a', 10005)) x = x.times(2); 
				return new Decimal(10**9).mul(new Decimal(10).pow(x.pow(1.2))).mul(new Decimal(1000).pow(x))
			},
			display() { return ` Boost passive V Point generation by 50%.
                Effect: +${format(this.effect().sub(1).mul(100),precision=0)}%
                Level: ${format(player[this.layer].buyables[this.id])}${bonus2str()}
                Cost: ${format(this.cost())} V Points`}, 
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				var amt = getBuyableAmount("v", 21)
				if (hasUpgrade('vp', 64) && hasUpgrade('v', 52)) amt = amt.add(2)
				return amt.mul(0.5).add(1)
			},
			unlocked() {return hasUpgrade('v', 52)}
		},
		22: {
			cost(x) { if(hasUpgrade('a', 10005)) x = x.times(2); 
				cost = new Decimal(10**18).mul(new Decimal(100).pow(x)).mul(new Decimal(1.1).pow(x.sub(1).max(0).pow(2)))
				// different pre extended tree scaling
				if(!hasUpgrade('v', 53)) cost = new Decimal(10**18).mul(new Decimal(10).pow(x)).mul(new Decimal(1.1).pow(x.sub(1).max(0).pow(1.5))).times(new Decimal(10).pow(x.sub(9).max(0).pow(2)))
				return cost
			},
			display() { return ` Multiply v points by log(log(v points)).
                Effect: x${format(this.effect())}
                Level: ${format(player[this.layer].buyables[this.id])}${bonus2str()}
                Cost: ${format(this.cost())} V Points`}, 
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				var amt = getBuyableAmount("v", 22)
				if (hasUpgrade('vp', 64) && hasUpgrade('v', 52)) amt = amt.add(2)
				return player.v.points.add(1).log(10).add(1).log(10).pow(amt).max(1)
			},
			unlocked() {return hasUpgrade('v', 52)}
		},
		23: {
			cost(x) { if(hasUpgrade('a', 10005)) x = x.times(2); 
				return new Decimal(10).pow(new Decimal(2).pow(x))
			},
			display() { return ` Reduce the Space Theorem cost of Space Studies by 0.1.
                Effect: -${format(this.effect())}
                Level: ${format(player[this.layer].buyables[this.id])}${bonus2str()}
                Cost: ${format(this.cost())} V Points`}, 
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				var amt = getBuyableAmount("v", 23)
				if (hasUpgrade('vp', 64) && hasUpgrade('v', 52)) amt = amt.add(2)
				return new Decimal(0.1).times(amt)
			},
			unlocked() {return hasUpgrade('v', 52)}
		},
	},
	onPrestige(gain) {
		let bpm = gain.div(player["v"].resetTime).times(60)
		if (bpm.gt(player["v"].best_points_min)) player["v"].best_points_min = bpm
		
		if (inChallenge('ra', 11)) {	
			player.points = new Decimal(0)
			player["v"].resetTime = 0
		}
		
		let resets = new Decimal(1)
		player.v.v_resets = player.v.v_resets.add(resets)
	},
	getResetGain() {
		if (inChallenge('ra', 11)) {	
			var gain = getResetGain(this.layer, useType = "normal")
			var postcap = r11gaincap()
			var mbonus = raMilestoneEff(206)
			if (hasUpgrade('a', 1)) mbonus = mbonus.pow(0.5)
			if (hasMilestone('ra', 206)) postcap = postcap.times(mbonus)
			if(gain.gt(postcap)) gain = postcap
			return gain
		}	
		return getResetGain(this.layer, useType = "normal")
	},

	doReset(resettingLayer) {
		if(layers[resettingLayer].row <= layers["v"].row) return
		if (resettingLayer == "vp") basicVReset("vp")
		if (resettingLayer == "vb") basicVReset("vb")
	},

	update(diff) {
		if ((hasMilestone('a', 2)) && player["v"].best_points_min.gt(0)) {
			player.v.points = player.v.points.add(player.v.best_points_min.times(vautopow()).times(diff).div(60))
		}
	},
	
	
	prestigeButtonText() {
		layer = this.layer
		if (Object.keys(tmp[layer].resetGain).length === 0) return ""
		text = `${player[layer].points.lt(1e3) ? (tmp[layer].resetDescription !== undefined ? tmp[layer].resetDescription : "Reset for ") : ""}+<b>${formatWhole(tmp[layer].resetGain)}</b> ${tmp[layer].resource} ${tmp[layer].resetGain.lt(100) && player[layer].points.lt(1e3) ? `<br><br>Next at ${(tmp[layer].roundUpCost ? formatWhole(tmp[layer].nextAt) : format(tmp[layer].nextAt))} ${tmp[layer].baseResource}` : ""}`		
		if (hasMilestone('a', 2)) {
			var permin = tmp[layer].resetGain.div(player["v"].resetTime).times(60)
			if (isNaN(permin.layer)) permin = new Decimal(0)
			text += `<br><br> ${format(permin)} ${tmp[layer].resource}/min`
		}
		return text
	},

	clickables: {
		11: {
			display() {
				return "Buy all affordable upgrades"
			},
			onClick() {
				// note: only affects the first three rows
				for (const element of [11,12,13,14,21,22,23,24,31,32,33,34]) {
					if (tmp.v.upgrades[element].unlocked) buyUpgrade('v', element)
				}					
			},
			canClick() {return hasAffordableVUpgrades()},
			unlocked() {
				return player.ra.showtherapy
			},
			style: {"min-height":"40px","width":"225px"}
		},
		12: {
			display() {
				return "Buy all affordable buyables"
			},			
			onClick() {
				for (const element of Object.values(tmp.v.buyables)) {
					if (!element.unlocked) continue
					var count = 1
					let cap = 9999
					while (element.cost.lte(player.v.points)) {
						if(count > cap) break
						buyBuyable("v",element.id)
						count++
					}
				}					
			},
			canClick() {return hasAffordableVBuyables()},
			unlocked() {
				return player.ra.showtherapy
			},
			style: {"min-height":"40px","width":"225px"}
		},
	},

	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"buyables",
		"clickables",
		"upgrades",
		"blank",
		"blank",
	],
	
})

function r13upgs() {
	var amt = 0
	if (hasUpgrade('v', 11)) amt++
	if (hasUpgrade('v', 12)) amt++
	if (hasUpgrade('v', 13)) amt++
	if (hasUpgrade('v', 14)) amt++
	if (hasUpgrade('v', 21)) amt++
	if (hasUpgrade('v', 22)) amt++
	if (hasUpgrade('v', 23)) amt++
	if (hasUpgrade('v', 24)) amt++
	if (hasUpgrade('v', 31)) amt++
	if (hasUpgrade('v', 32)) amt++
	if (hasUpgrade('v', 33)) amt++
	if (hasUpgrade('v', 34)) amt++
	return amt 
}
function bonus2str() {
	if (hasUpgrade('vp', 64)) return "+2.00"
	return ""
}
addLayer("vp", {
    name: "v prestige points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "VP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#CCAD33",
    requires() {
		req = new Decimal(10**6)
		if (player["v"].points.gte(req.mul(10))) req = req.mul(10).div(new Decimal(2).pow(5/3))
		else if (player["v"].points.gte(req)) req = player["v"].points.sub(1).max(10**6)
		return req
	}, // Can be a function that takes requirement increases into account
    resource: "V prestige points", // Name of prestige currency
    baseResource: "v points", // Name of resource prestige is based on
    baseAmount() {return player["v"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade('vp', 12)) mult = mult.times(upgradeEffect('vp', 12))
		if (hasUpgrade('vp', 13)) mult = mult.times(upgradeEffect('vp', 13))
		if (hasUpgrade('vp', 14)) mult = mult.times(upgradeEffect('vp', 14))
		if (hasUpgrade('vp', 41)) mult = mult.times(upgradeEffect('vp', 41))	
		if (hasUpgrade('vp', 61)) mult = mult.times(upgradeEffect('vp', 61))	
		if (hasUpgrade('vp', 16)) mult = mult.times(upgradeEffect('vp', 16))
		if (hasUpgrade('v', 34)) mult = mult.times(upgradeEffect('v', 34))
		
		if (hasUpgrade('a', 91)) mult = mult.times(100)
		if (hasUpgrade('a', 92)) mult = mult.times(3)
		if (hasUpgrade('a', 93)) mult = mult.div(10)	

		mult = mult.times(layers["vp"].buyables[11].effect())
	
		if (!inChallenge('ra', 11)) mult = mult.times(tmp["vb"].effect[1])

		if (hasUpgrade('v', 51) && !hasUpgrade('v', 53)) mult = mult.times(50)
	
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
    },
	resetsNothing() {
        if (inChallenge('ra', 11)) return true
		return false		
	},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for v prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)},
		unlocked() {return hasUpgrade('v', 41)},		
		},
    ],
    layerShown(){ return hasUpgrade('v', 41) },
    effect() {
		var eff = softcap(
			softcap(
				player["vp"].points.pow(0.5).times(0.1).add(1),new Decimal(10),
			new Decimal(2/3)),
			new Decimal(10**10)
		)
		if (hasUpgrade('a', 10008)) eff = eff.pow(0.5)
		return eff
	},
    effectDescription(){
	   return "boosting V Point gain by x" + format(tmp[this.layer].effect)       
    },
	upgrades: {
        11: {
			description: "Double v point gain",
			cost: new Decimal(10),
			effect() {
				return new Decimal(2)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked: true,
        },
        12: {
			description: "Triple v prestige point gain",
			cost: new Decimal(100),
			effect() {
				return new Decimal(3)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked: true,
        },
        13: {
			description: "Double v point and v prestige point gain",
			cost: new Decimal(1000),
			effect() {
				return new Decimal(2)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked: true,
        },
        14: {
			description: "Celestial cells boost v prestige point gain",
			cost() {
				cost = new Decimal(10**6)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				if(hasUpgrade('a', 104)) return upgradeEffect('a', 104)
				return player.points.add(1).log(5).max(1).pow(0.75)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51) || inChallenge('ra', 11)},
        },
        21: {
			description: "Keep v upgrades on v prestige",
			cost: new Decimal(10000),
			unlocked() {return (hasUpgrade('vp', 11) && hasUpgrade('vp', 12) && hasUpgrade('vp', 13)) || inChallenge('ra', 11)},
        },
        22: {
			description: "Keep v buyables on v prestige",
			cost: new Decimal(10**6),
			unlocked() {return (hasUpgrade('vp', 21) && hasUpgrade('v', 42)) || inChallenge('ra', 11)},
        },
        23: {
			description: "Unlock a v prestige buyable",
			cost() {
				cost = new Decimal(10**9)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			unlocked() {return hasUpgrade('v', 51) || inChallenge('ra', 11)},
        },
        24: {
			description: "Unlock another v prestige buyable",
			cost() {
				cost = new Decimal(10**18)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			unlocked() {return hasUpgrade('vp', 23) || inChallenge('ra', 11)},
        },
        31: {
			description: "V point gain x1000 but /5 for every v upgrade in rows 1-3 (can't go below x1)",
			cost() {
				cost = new Decimal(10**10)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				return new Decimal(1000).div(new Decimal(5).pow(r13upgs())).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51)},
        },
        32: {
			description: "Double the first v achievement milestone's effect<br>(start with 2 cells)",
			cost() {
				cost = new Decimal(10**8)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			unlocked() {return hasUpgrade('v', 51)},
        },
        33: {
			description: "Gain 0.6% more v points per (v ach./2)^2, up to x36",
			cost() {
				cost = new Decimal(10**11).mul(5)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				return new Decimal(1.006).pow(player.a.points.mul(player.a.points.add(1)).div(2)).min(36)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51)},
        },
        34: {
			description: "Celestial cells boost passive v point gen",
			cost() {
				cost = new Decimal(10**9).mul(2)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				return player.points.add(1).log(10).add(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51)},
        },
        41: {
			description: "V prestige points boost their own gain",
			cost() {
				cost = new Decimal(10**9)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				return player.vp.points.add(1).log(4).add(player.vp.points.div(10**9).pow(0.2)).max(1).pow(0.5)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51) && (hasUpgrade('v', 52) || hasUpgrade('v', 53))},
        },
        42: {
			description: "10x v point gain",
			cost() {
				cost = new Decimal(10**10).times(3)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				return new Decimal(10)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51) && (hasUpgrade('v', 52) || hasUpgrade('v', 53))},
        },
        43: {
			description: "Power up the first<br>v upg. and the two below it based on celestial cells<br>(effectively boost vp gain based on cells)",
			cost() {
				cost = new Decimal(10**12)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				return player.points.add(1).log(8).add(1).log(8).add(1).pow(0.8)
			},
			effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51) && (hasUpgrade('v', 52) || hasUpgrade('v', 53))},
        },
        44: {
			description: "Reduce the Space Theorem cost of Space Studies by 0.5",
			cost() {
				cost = new Decimal(10**14)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			unlocked() {return hasUpgrade('v', 51) && (hasUpgrade('v', 52) || hasUpgrade('v', 53))},
        },
        51: {
			description() {return hasMilestone('ra', 200) ? "Ra memory chunks boost memory gain" : "?????? boost ?????? gain"},
			cost() {
				cost = new Decimal(10**48).times(4)
				if(hasUpgrade('vp', 45)) return cost.div(10**6)
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				return player.ra.ra_chunks.add(1).log(10).pow(0.35).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51) && hasUpgrade('v', 52) && hasUpgrade('v', 53)},
        },
        52: {
			description() {return hasMilestone('ra', /*101*/200) ? "Divide the V booster cost by 1e10" : "Divide the ?????? cost by 1e10"},
			cost() {
				cost = new Decimal(10**38)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			unlocked() {return hasUpgrade('v', 51) && hasUpgrade('v', 52) && hasUpgrade('v', 53)},
        },
        53: {
			description() {return hasMilestone('ra', 200) ? "V prestige points boost memory gain" : "V prestige points boost ?????? gain"},
			cost() {
				cost = new Decimal(10**27)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				return player.vp.points.add(1).log(10).sub(30).max(1).pow(0.2)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51) && hasUpgrade('v', 52) && hasUpgrade('v', 53)},
        },
        54: {
			description() {return hasMilestone('ra', 200) ? "V memory chunks boost v point gain" : "?????? boost v point gain"},
			cost() {
				cost = new Decimal(10**31).times(1.5)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				return player.ra.v_chunks.pow(0.05).add(player.ra.v_chunks.add(1).log(10**4)).max(0).pow(3).add(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51) && hasUpgrade('v', 52) && hasUpgrade('v', 53)},
        },
        61: {
			description: "Buyable 1 boosts v prestige point gain",
			cost() {
				cost = new Decimal(10**12).mul(2.5)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				return getBuyableAmount("v",11).div(2).pow(0.6).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51)},
        },
        62: {
			description: "Buyable 2 boosts passive v point gain",
			cost() {
				cost = new Decimal(10**15).mul(2.5)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			effect() {
				var mult = getBuyableAmount("v",12).mul(0.05).add(1)
				if(hasUpgrade('a', 62)) mult=mult.times(2).sub(1)
				return mult
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return hasUpgrade('v', 51)},
        },
        63: {
			description: "Double free v upgs from buyable 3",
			cost() {
				cost = new Decimal(10**18).mul(2.5)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			unlocked() {return hasUpgrade('v', 51)},
        },
        64: {
			description: "Get 2 bonus levels of each V buyable",
			cost() {
				cost = new Decimal(10**21).mul(2.5)
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**6)
				if(hasUpgrade('v', 53)) cost = cost.times(10**6)
				return cost
			},
			unlocked() {return (hasUpgrade('vp', 61) && hasUpgrade('vp', 62) && hasUpgrade('vp', 63)) || inChallenge('ra', 11)},
        },
		// Recognition Therapy upgrades
        15: {
			description: "Triple memory gain",
			cost() {
				cost = new Decimal(10**6)
				if(!inChallenge('ra', 11)) cost = new Decimal(10**96)
				return cost
			},
			effect() {
				return new Decimal(3)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        16: {
			description: "Gain 10x v points and 10x v prestige points",
			cost() {
				cost = new Decimal(10**9)
				if(!inChallenge('ra', 11)) cost = new Decimal(10**140)
				return cost
			},
			effect() {
				return new Decimal(10)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        25: {
			description: "Unlock a third v prestige buyable",
			cost() {
				cost = new Decimal(10**12)
				if(!inChallenge('ra', 11)) cost = new Decimal(10**160)
				return cost
			},
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        26: {
			description: "Unlock 2 exclusive space studies in Recognition Therapy",
			cost() {
				cost = new Decimal(3*10**6)
				if(!inChallenge('ra', 11)) cost = new Decimal(3*10**36)
				return cost
			},
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        35: {
			description: "V prestige points boost memory chunk gain",
			cost() {
				cost = new Decimal(4*10**13)
				if(!inChallenge('ra', 11)) cost = new Decimal(4*10**50)
				return cost
			},
			effect() {
				return player.vp.points.add(1).log(10).pow(0.5).div(2).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        36: {
			description: "Boost v point gain based on therapy's<br>v point gain cap",
			cost() {
				cost = new Decimal(10**15)
				if(!inChallenge('ra', 11)) cost = new Decimal(10**150)
				return cost
			},
			effect() {
				return r11gaincap().add(1).log(10).add(r11gaincap().pow(0.1).div(10**36)).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        45: {
			description: "Many VP upgrades are cheaper",
			cost() {
				cost = new Decimal(10**20)
				if(!inChallenge('ra', 11)) cost = new Decimal(10**100)
				return cost
			},
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        46: {
			description: "Reduce the Space Theorem cost of Space Studies by 0.5",
			cost() {
				cost = new Decimal(10**26)
				if(!inChallenge('ra', 11)) cost = new Decimal(10**144)
				return cost
			},
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        55: {
			description: "V point gain ^1.05",
			cost() {
				cost = new Decimal(10**36)
				if(!inChallenge('ra', 11)) cost = new Decimal(10**200)
				return cost
			},
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        56: {
			description: "Get a free level to the third VP buyable for every 5 V levels",
			cost() {
				cost = new Decimal(2*10**40)
				if(!inChallenge('ra', 11)) cost = new Decimal(2*10**180)
				return cost
			},
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        65: {
			description: "All Memory Chunks produce more Memories based on current celestial cells",
			cost() {
				cost = new Decimal(10**45)
				if(!inChallenge('ra', 11)) cost = new Decimal(10**145)
				return cost
			},
			effect() {
				return player.points.add(1).log(2).div(10).add(1).pow(1.6)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect

			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
        66: {
			description: "All Memory Chunks produce more Memories based on total celestial levels",
			cost() {
				cost = new Decimal(10**48)
				if(!inChallenge('ra', 11)) cost = new Decimal(10**148)
				return cost
			},
			effect() {
				return new Decimal(1).add(totalCelLevels().div(50)).pow(1.6)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			unlocked() {return (inChallenge('ra', 11) && hasMilestone('ra', 203)) || hasMilestone('a', 8)},
        },
	},
	buyables: {
		11: {
			cost(x) { 
				cost = new Decimal(10**9).times(new Decimal(10).pow(x))
				if(hasUpgrade('vp', 45)) return cost
				if(hasUpgrade('v', 52)) cost = cost.times(10**3)
				if(hasUpgrade('v', 53)) cost = cost.times(10**3)
				return cost
			},
			display() { 
				var bonusLvs = ""
				if(hasMilestone('ra', 104)) bonusLvs = "+"+format(getBuyableAmount("ra", 13).add(1))
				return ` +20% v prestige points/level.
                Effect: x${format(this.effect())}
                Level: ${format(player[this.layer].buyables[this.id])}${bonusLvs}
                Cost: ${format(this.cost())} V Prestige Points`
			}, 
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				var amt = getBuyableAmount("vp", 11)
				if(hasMilestone('ra', 104)) amt = amt.add(getBuyableAmount("ra", 13).add(1))
				return new Decimal(1.2).pow(amt)
			},
			unlocked() {return hasUpgrade('vp', 23) || inChallenge('ra', 11)}
		},
		12: {
			cost(x) {
				cost = new Decimal(10**15).times(new Decimal(100).pow(x)).times(
					new Decimal(10).pow(x.pow(1.25))
				)
				return cost
			},
			display() { 
				var bonusLvs = ""
				if(hasMilestone('ra', 104)) bonusLvs = "+"+format(getBuyableAmount("ra", 13).add(1).div(2).floor())
				return ` +1 bonus Space Theorem.
                Effect: +${format(this.effect())}
                Level: ${format(player[this.layer].buyables[this.id])}${bonusLvs}
                Cost: ${format(this.cost())} V Prestige Points`
			}, 
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
				player.a.theorems = player.a.theorems.add(1)
			},
			effect() {
				var amt = getBuyableAmount("vp", 12)
				if(hasMilestone('ra', 104)) amt = amt.add(getBuyableAmount("ra", 13).add(1).div(2).floor())
				return new Decimal(amt).times(1)
			},
			unlocked() {return hasUpgrade('vp', 24) || inChallenge('ra', 11)}
		},
		13: {
			cost(x) {
				if (typeof x === 'undefined') return new Decimal(1)
				cost = new Decimal(10**12).times(new Decimal(10).pow(x)).times(new Decimal(1.05).pow(x.pow(2))).times(new Decimal(100).pow(x.sub(25).max(0).pow(1.5)))
				return cost
			},
			display() { 
				var bonusLvs = ""
				if(hasMilestone('ra', 104) && hasUpgrade('vp', 56)) bonusLvs = "+"+format(getBuyableAmount("ra", 13).add(1).div(5).floor())
				return ` Double v point gain and Recognition Therapy v point gain cap.
                Effect: *${format(this.effect())}
                Level: ${format(player[this.layer].buyables[this.id])}${bonusLvs}
                Cost: ${format(this.cost())} V Prestige Points`
			}, 
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				var amt = getBuyableAmount("vp", 13)
				if(hasMilestone('ra', 104) && hasUpgrade('vp', 56)) amt = amt.add(getBuyableAmount("ra", 13).add(1).div(5).floor())
				return new Decimal(2).pow(amt)
			},
			unlocked() {return hasUpgrade('vp', 25)}
		},
	},
	branches: ["v"],
	onPrestige(gain) {
		if (inChallenge('ra', 11)) {	
			player.points = new Decimal(0)
			basicVReset("vp")
			player["vp"].resetTime = 0
		}

		if (player["a"].vachs[1] < 6 && hasUpgrade('v', 41) && hasUpgrade('v', 43)) {
			console.log(gain)
			for (let i = player["a"].vachs[1]; i < 6; i++) {
				if (gain.gte(vachreqs(1,i))) {
					earnvach(1)
				}
			}
		}
	},
})
function canGetHardV1() {
	// Player must be in Recognition Therapy without any V Prestige content or Space Studies
	return (inChallenge('ra', 11) && player.vp.points.equals(0) && player.vp.upgrades.length == 0 && getvpbuys().equals(0) && player["a"].upgrades.length == 0)
}
function getvupgs() {
	ret = new Decimal(player["v"].upgrades.length).add(layers["v"].buyables[13].effect())
	if (hasUpgrade('v', 41)) ret = ret.sub(1)
	if (hasUpgrade('v', 42)) ret = ret.sub(1)
	if (hasUpgrade('v', 43)) ret = ret.sub(1)
	if (hasUpgrade('v', 51)) ret = ret.sub(1)
	if (hasUpgrade('v', 52)) ret = ret.sub(1)
	if (hasUpgrade('v', 53)) ret = ret.sub(1)
	return ret
}
function getvbuys() {
	return getBuyableAmount("v",11).add(getBuyableAmount("v",12)).add(getBuyableAmount("v",13)).add(getBuyableAmount("v",21)).add(getBuyableAmount("v",22)).add(getBuyableAmount("v",23))
}
function getvpbuys() {
	return getBuyableAmount("vp",11).add(getBuyableAmount("vp",12))
}
function vachreqs(id,level) {
	if (level > 5) level = 5
	if (id > 6 && level > 4) level = 4
	ret = [
		[],
		[ new Decimal(10**3), new Decimal(10**4), new Decimal(10**5), new Decimal(10**6), new Decimal(10**7), new Decimal(10**8), ],
		[ new Decimal(10), new Decimal(5), new Decimal(3), new Decimal(2), new Decimal(1), new Decimal(0), ],
		[ new Decimal(9), new Decimal(7), new Decimal(5), new Decimal(3), new Decimal(1), new Decimal(0), ],
		[ new Decimal(6), new Decimal(5), new Decimal(4), new Decimal(3), new Decimal(2), new Decimal(1), ],
		[ new Decimal(8), new Decimal(6), new Decimal(5), new Decimal(4), new Decimal(3), new Decimal(2), ],
		[ new Decimal(10**18), new Decimal(10**21), new Decimal(10**24), new Decimal(10**27), new Decimal(10**30), new Decimal(10**33), ],
		[ new Decimal(10**6), new Decimal(10**8), new Decimal(10**10), new Decimal(10**12), new Decimal(10**18) ],
		[ new Decimal(6), new Decimal(7), new Decimal(8), new Decimal(9), new Decimal(10),  ],
		[ new Decimal(120), new Decimal(140), new Decimal(160), new Decimal(180), new Decimal(200) ],
		[ new Decimal(4), new Decimal(5), new Decimal(6), new Decimal(7), new Decimal(8) ],
		[ new Decimal(10**30), new Decimal(10**35), new Decimal(10**40), new Decimal(10**45), new Decimal(10**50) ],
		[ new Decimal(25), new Decimal(27), new Decimal(29), new Decimal(31), new Decimal(33) ],
	][id][level]
	if(id==6&&hasUpgrade('v', 51)&&hasUpgrade('v', 52)&&hasUpgrade('v', 53))
		ret = ret.times(10**12)
	return ret
}
function vachreqs2(id,level) {
	if (level > 5) level = 5
	if (id > 6 && level > 4) level = 4
	ret = [
		[],
		[],
		[ new Decimal(10**6), new Decimal(10**8), new Decimal(10**10), new Decimal(10**12), new Decimal(10**14), new Decimal(10**16), ],
		[],
		[ new Decimal(10**12), new Decimal(10**12), new Decimal(10**12), new Decimal(10**12), new Decimal(10**12), new Decimal(10**12), ],
		[ new Decimal(10**18), new Decimal(10**20), new Decimal(10**22), new Decimal(10**24), new Decimal(10**24), new Decimal(10**24), ],
		[],
		[],
		[],
		[],
		[ new Decimal(10**120), new Decimal(10**140), new Decimal(10**130), new Decimal(10**120), new Decimal(10**110) ],
		[],
		[],
	][id][level]
	if(id==4&&hasUpgrade('v', 51)&&hasUpgrade('v', 52)&&hasUpgrade('v', 53))
		ret = ret.times(10**6)
	if(id==5&&hasUpgrade('v', 51)&&hasUpgrade('v', 52)&&hasUpgrade('v', 53))
		ret = ret.times(10**12)
	return ret
}
function vachtst() {
	return new Decimal(
		player["a"].vachs[1] + 
		player["a"].vachs[2] + 
		player["a"].vachs[3] +
		player["a"].vachs[4] + 
		player["a"].vachs[5] + 
		player["a"].vachs[6] + 
		2*(
			player["a"].vachs[7] + 
			player["a"].vachs[8] + 
			player["a"].vachs[9] + 
			player["a"].vachs[10] + 
			player["a"].vachs[11] + 
			player["a"].vachs[12]
		)
	).add(layers["vp"].buyables[12].effect())
}
function getvachname(id) {
	if (id == 1) return "V-ACH-1"
	if (id == 2) return "V-ACH-2"
	if (id == 3) return "V-ACH-3"
	if (id == 4) return "V-ACH-4"
	if (id == 5) return "V-ACH-5"
	if (id == 6) return "V-ACH-6"
	if (id == 7) return "V-ACH-H1"
	if (id == 8) return "V-ACH-H2"
	if (id == 9) return "V-ACH-H3"
	if (id == 10) return "V-ACH-H4"
	if (id == 11) return "V-ACH-H5"
	if (id == 12) return "V-ACH-H6"
	console.err("NO V ACHIEVEMENT NAME AAAHHH "+id)
	return "UH??????"
}
function earnvach(id) {
	if (id < 1 || id > 12) return
	if (player["a"].vachs[id] >= 6) return
	if (id > 6 && player["a"].vachs[id] >= 5) return
	player["a"].vachs[id]++
	var count = 1
	if (id > 6) count = 2
	player["a"].theorems = player["a"].theorems.add(count)
	player["a"].points = player["a"].points.add(count)
	var col = "#EAD584"
	if (id > 6) col = "#CD5C5C"
	doPopup(type = "none", text = `Completed ${getvachname(id)}<br>at level ${player["a"].vachs[id]}`, title = "V-Achievement!", timer = 3, color = col)
}
function am1eff() {
	return new Decimal(10).add(vachtst()).mul(0.1)
}
function vautopow() {
	if (hasUpgrade('a', 10006)) return new Decimal(0) // disable passive v point generation
	var mult = new Decimal(0.1)

	if (hasUpgrade('vp', 62)) mult = mult.times(upgradeEffect('vp', 62))	
	mult = mult.times(buyableEffect("v",21))
	if (hasUpgrade('vp', 34)) mult = mult.times(upgradeEffect('vp', 34))
	if (hasUpgrade('a', 72)) mult = mult.times(16)
		
	mult = softcap(mult,new Decimal(0.5),new Decimal(1/6))
	
	if (hasUpgrade('a', 72) && mult.gte(0.5)) mult = mult.times(2)
	if (hasUpgrade('a', 71)) mult = mult.times(2)
	if (hasUpgrade('a', 101)) mult = mult.div(10)
	
	return mult
}
function ssdiscount() {
	var discount = new Decimal(0)
	if(hasMilestone('a', 5)) discount = discount.add(2)
	if(hasUpgrade('a', 81)) discount = discount.add(1)
	if(hasUpgrade('a', 103)) discount = discount.add(1)
	if(hasUpgrade('vp', 44)) discount = discount.add(0.5)
	if(hasUpgrade('vp', 46)) discount = discount.add(0.5)
	discount = discount.add(buyableEffect("v",23))
	if (hasMilestone('ra', 204) && inChallenge('ra', 11)) discount = discount.add(getBuyableAmount("ra", 23).add(1).mul(0.1))
	return discount
}
function respecSpaceStudies() {
	player["a"].upgrades = []
	player["a"].theorems = new Decimal(vachtst())
}
function getPenaltyStudyAmt(){
	var amt = 0
	for (const element of player["a"].upgrades) {
		if (parseInt(element) > 10000) amt++
	}
	return new Decimal(amt)
}
function exportSpaceTree() {
	if (player["a"].upgrades.length == 0) return
	var str = ""
	for (const element of player["a"].upgrades) {
		var study = parseInt(element)
		if (study > 10000) study = -(study-10000)
		str = str + study + ","
	}
	str = str.substring(0,str.length-1)
	// Export to clipboard
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
	el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);		
	doPopup(type = "none", text = "<span style='font-size: 16px'>Space Studies exported to clipboard</span>", title = "Exported tree", timer = 2, color = "#FFFFFF")
}
function importSpaceTree() {
	imported = prompt("Input your tree");
	if (imported == null) return
	studies = imported.split(",")
	study_set = []
	for (const element of studies) {
		var study = parseInt(element)
		if(isNaN(study)) continue
		if(study > 10000) continue
		if(study < 0) {
			if(!player.a.show_penalty_studies) continue
			study = 0-study+10000
		}
		study_set.push(study)
	}
}
addLayer("a", {
    name: "V-Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		vachs: [-1,0,0,0,0,0,0,0,0,0,0,0,0],
		theorems: new Decimal(0),
		lowest_penalty: new Decimal(0),
		show_penalty_studies: true,
    }},
    color: "#FFFFFF",
    resource: "V-Achievements", // Name of prestige currency
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasUpgrade('v', 43)},

	tabFormat: [
		"main-display",
		["bar", "vach1"],
		["bar", "vach2"],
		["bar", "vach3"],
		["bar", "vach4"],
		["bar", "vach5"],
		["bar", "vach6"],
		["bar", "vach7"],
		["bar", "vach8"],
		["bar", "vach9"],
		["bar", "vach10"],
		["bar", "vach11"],
		["bar", "vach12"],
		"blank",
		["display-text", function() {return `You have ${format(player["a"].theorems)} Space Theorems`}],
		["display-text", function() {return `You have ${format(vachtst())} total Space Theorems`}],
		"blank",
		"blank",
		"clickables",
		"blank",
		"blank",
		//"upgrades",
		["upgrade-tree", function() {
			// early tree is small
			if(!hasUpgrade('v', 53)) return [[41,11,42],[21,22],[31,32]]
			// 2 special studies in tree with this upgrade
			if(hasUpgrade('vp', 26) && inChallenge('ra', 11)) return [[1, 2], [41,11,42,10001],[21,22,10002],[31,32,10003],[51,52,10004],[61,62,63,10005],[71,72,10006],[82,81,83,10007],[91,92,93,10008],[101,102,103,104,105,106]]
			// standard tree
			return [[41,11,42,10001],[21,22,10002],[31,32,10003],[51,52,10004],[61,62,63,10005],[71,72,10006],[82,81,83,10007],[91,92,93,10008],[101,102,103,104,105,106]]
		}],
		"milestones",
	],

	bars: {
		vach1: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-1<br>
			V-Prestige for ${format(vachreqs(1,player["a"].vachs[1]))} V-Prestige Points<br>
			${player["a"].vachs[1]}/6` },
			progress() { return player["a"].vachs[1]/6 },
			unlocked() {return hasUpgrade('v', 41) && hasUpgrade('v', 43) && !hasMilestone('ra', 103)},
			fillStyle: {"background-color": "#99863D"},
		},
		vach2: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-2<br>
			Reach ${format(vachreqs2(2,player["a"].vachs[2]))} V Points with at most ${vachreqs(2,player["a"].vachs[2])} V-Buyables <br>
			Currently: ${format(getvbuys(),precision=0)} buyables<br>
			${player["a"].vachs[2]}/6` },
			progress() { return player["a"].vachs[2]/6 },
			unlocked() {return hasUpgrade('v', 42) && hasUpgrade('v', 43) && !hasMilestone('ra', 103)},
			fillStyle: {"background-color": "#99863D"},
		},
		vach3: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-3<br>
			Reach ${format(new Decimal(10**6))} V Points with at most ${vachreqs(3,player["a"].vachs[3])} V-Upgrades<br>
			Currently: ${format(getvupgs(),precision=0)} upgrades (doesn't count row 4)<br>
			${player["a"].vachs[3]}/6` },
			progress() { return player["a"].vachs[3]/6 },
			unlocked() {return hasUpgrade('v', 43) && hasUpgrade('v', 43) && !hasMilestone('ra', 103)},
			fillStyle: {"background-color": "#99863D"},
		},
		vach4: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-4<br>
			Reach ${format(vachreqs2(4,player["a"].vachs[4]))} V Points with at most<br>${vachreqs(4,player["a"].vachs[4])} V-Upgrades, ${vachreqs(4,player["a"].vachs[4])} V-Buyables, and ${vachreqs(4,player["a"].vachs[4])} Space Studies<br>
			Currently: ${format(getvupgs(),precision=0)}/${format(getvbuys(),precision=0)}/${format(player["a"].upgrades.length,precision=0)} <br>
			${player["a"].vachs[4]}/6` },
			progress() { return player["a"].vachs[4]/6 },
			unlocked() {return hasUpgrade('v', 53) && !hasMilestone('ra', 103)},
			fillStyle: {"background-color": "#99863D"},
		},
		vach5: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-5<br>
			Reach ${format(vachreqs2(5,player["a"].vachs[5]))} V Points in at most ${vachreqs(5,player["a"].vachs[5])} V-Resets<br>
			Currently: ${format(player.v.v_resets,precision=0)} V-Resets (only resets on tree respec reset)<br>
			${player["a"].vachs[5]}/6` },
			progress() { return player["a"].vachs[5]/6 },
			unlocked() {return hasUpgrade('v', 53) && !hasMilestone('ra', 103)},
			fillStyle: {"background-color": "#99863D"},
		},
		vach6: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-6<br>
			Generate ${format(vachreqs(6,player["a"].vachs[6]))} passive V Points per minute<br>
			Currently: ${format(player.v.best_points_min.times(vautopow()))} passive VP/min<br>
			${player["a"].vachs[6]}/6` },
			progress() { return player["a"].vachs[6]/6 },
			unlocked() {return hasUpgrade('v', 53) && !hasMilestone('ra', 103)},
			fillStyle: {"background-color": "#99863D"},
		},
		vach7: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-H1<br>
			Reach ${format(vachreqs(7,player["a"].vachs[7]))} V Points in Recognition Therapy<br>without any V Prestige Points/Upgrades or Space Studies<br>
			Currently: ${canGetHardV1() ? "Active" : "Can't be earned"}<br>
			${player["a"].vachs[7]}/5` },
			progress() { return player["a"].vachs[7]/5 },
			unlocked() {return hasMilestone('ra', 103)},
			fillStyle: {"background-color": "#993D3D"},
		},
		vach8: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-H2<br>
			Get ${format(vachreqs(8,player["a"].vachs[8]),precision=0)} V Boosters<br>
			Currently: ${format(player.vb.points,precision=0)} V Boosters<br>
			${player["a"].vachs[8]}/5` },
			progress() { return player["a"].vachs[8]/5 },
			unlocked() {return hasMilestone('ra', 103)},
			fillStyle: {"background-color": "#993D3D"},
		},
		vach9: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-H3<br>
			Buy ${format(vachreqs(9,player["a"].vachs[9]),precision=0)} total V buyable levels<br>without buying the second V buyable<br>
			Currently: ${getBuyableAmount("v",12).equals(0) ? format(getvbuys(),precision=0)+" buyables" : "Can't be earned"}<br>
			${player["a"].vachs[9]}/5` },
			progress() { return player["a"].vachs[9]/5 },
			unlocked() {return hasMilestone('ra', 103)},
			fillStyle: {"background-color": "#993D3D"},
		},
		vach10: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { let tr = (getPenaltyStudyAmt().gte(vachreqs(10,player["a"].vachs[10])) ? " (Try forcing a V reset)" :"")
			return `V-ACH-H4<br>
			Reach ${format(vachreqs2(10,player["a"].vachs[10]))} V Points with at least ${format(vachreqs(10,player["a"].vachs[10]),precision=0)} Penalty Studies<br>
			Currently: ${player.a.lowest_penalty.gte(vachreqs(10,player["a"].vachs[10])) ? format(player.a.lowest_penalty,precision=0)+" Penalty Studies" : "Can't be earned"+tr}<br>
			${player["a"].vachs[10]}/5` },
			progress() { return player["a"].vachs[10]/5 },
			unlocked() {return hasMilestone('ra', 106)},
			fillStyle: {"background-color": "#993D3D"},
		},
		vach11: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-H5<br>
			Reach ${format(vachreqs(11,player["a"].vachs[11]))} V Prestige Points in Recognition Therapy<br>
			Currently: ${inChallenge('ra', 11) ? format(player.vp.points)+" V Prestige Points" : "Can't be earned"}<br>
			${player["a"].vachs[11]}/5` },
			progress() { return player["a"].vachs[11]/5 },
			unlocked() {return hasMilestone('ra', 106)},
			fillStyle: {"background-color": "#993D3D"},
		},
		vach12: {
			direction: RIGHT,
			width: 500,
			height: 100,
			display() { return `V-ACH-H6<br>
			Have ${format(vachreqs(12,player["a"].vachs[12]),precision=0)} total Space Studies bought at once<br>
			Currently: ${player.a.upgrades.length}<br>
			${player["a"].vachs[12]}/5` },
			progress() { return player["a"].vachs[12]/5 },
			unlocked() {return hasMilestone('ra', 106)},
			fillStyle: {"background-color": "#993D3D"},
		},
		
	},
	
	update() {
		if(!hasUpgrade('v', 43)) return
		if (player["a"].vachs[2] < 6 && hasUpgrade('v', 42)) {
			for (let i = player["a"].vachs[2]; i < 6; i++) {
				if( player["v"].points.gte(vachreqs2(2,player["a"].vachs[2])) && getvbuys().lte(vachreqs(3,player["a"].vachs[2])) ) {
					earnvach(2)
				}
			}
		}
		if (player["a"].vachs[3] < 6 && hasUpgrade('v', 43)) {
			for (let i = player["a"].vachs[3]; i < 6; i++) {
				if( player["v"].points.gte(10**6) && getvupgs().lte(vachreqs(3,player["a"].vachs[3])) ) {
					earnvach(3)
				}
			}
		}
		if (player["a"].vachs[4] < 6 && hasUpgrade('v', 53)) {
			for (let i = player["a"].vachs[4]; i < 6; i++) {
				if( player["v"].points.gte(vachreqs2(4,player["a"].vachs[4])) 
				&& getvupgs().lte(vachreqs(4,player["a"].vachs[4])) 
				&& getvbuys().lte(vachreqs(4,player["a"].vachs[4])) 
				&& new Decimal(player["a"].upgrades.length).lte(vachreqs(4,player["a"].vachs[4])) ) {
					earnvach(4)
				}
			}
		}
		if (player["a"].vachs[5] < 6 && hasUpgrade('v', 53)) {
			for (let i = player["a"].vachs[5]; i < 6; i++) {
				if( player["v"].points.gte(vachreqs2(5,player["a"].vachs[5])) && player.v.v_resets.lte(vachreqs(5,player["a"].vachs[5]))) {
					earnvach(5)
				}
			}
		}
		if (player["a"].vachs[6] < 6 && hasUpgrade('v', 53)) {
			for (let i = player["a"].vachs[6]; i < 6; i++) {
				if( player.v.best_points_min.times(vautopow()).gte(vachreqs(6,player["a"].vachs[6])) ) {
					earnvach(6)
				}
			}
		}
		if (hasMilestone('a', 0) && player.points.lt(1)) {
			var amt = 1
			if (hasUpgrade('vp', 32)) amt *= 2
			player.points = new Decimal(amt)
		}
		
		// Hard V
		if (player["a"].vachs[7] < 5 && hasMilestone('ra', 103)) {
			for (let i = player["a"].vachs[7]; i < 5; i++) {
				if( canGetHardV1() && player.v.points.gte(vachreqs(7,player["a"].vachs[7])) ) {
					earnvach(7)
				}
			}
		}	
		if (player["a"].vachs[8] < 5 && hasMilestone('ra', 103)) {
			for (let i = player["a"].vachs[8]; i < 5; i++) {
				if( player.vb.points.gte(vachreqs(8,player["a"].vachs[8])) ) {
					earnvach(8)
				}
			}
		}	
		if (player["a"].vachs[9] < 5 && hasMilestone('ra', 103)) {
			for (let i = player["a"].vachs[9]; i < 5; i++) {
				if(getBuyableAmount("v",12).equals(0) && getvbuys().gte(vachreqs(9,player["a"].vachs[9])) ) {
					earnvach(9)
				}
			}
		}	
		
		if (player["a"].vachs[10] < 5 && hasMilestone('ra', 106)) {
			for (let i = player["a"].vachs[10]; i < 5; i++) {
				if(player.a.lowest_penalty.gte(vachreqs(10,player["a"].vachs[10])) && player.v.points.gte(vachreqs2(10,player["a"].vachs[10]))) {
					earnvach(10)
				}
			}
		}	
		if (player["a"].vachs[11] < 5 && hasMilestone('ra', 106)) {
			for (let i = player["a"].vachs[11]; i < 5; i++) {
				if(inChallenge('ra', 11) && player.vp.points.gte(vachreqs(11,player["a"].vachs[11]))) {
					earnvach(11)
				}
			}
		}	
		if (player["a"].vachs[12] < 5 && hasMilestone('ra', 106)) {
			for (let i = player["a"].vachs[12]; i < 5; i++) {
				if(new Decimal(player["a"].upgrades.length).gte(vachreqs(12,player["a"].vachs[12]))) {
					earnvach(12)
				}
			}
		}	
		
		// Preset saving
		if (typeof study_set == "object" && study_set.length > 0) {
			study = study_set.shift()
			buyUpgrade('a', study)
		}
		
	},

	clickables: {
		11: {
			display() {return "Export tree"},
			onClick() {
				exportSpaceTree()
			},
			canClick() {return true},
			style: {"min-height": "60px", "width": "80px"}
		},
		12: {
			display() {return "Respec space studies"},
			onClick() {
				if(!confirm("Really respec space studies?\n(Resets V layer)")) return
				if (inChallenge('ra', 11)) {	
					completeChallenge('ra', 11)
				}
				player.points = new Decimal(0)
				basicVReset("a")
				respecSpaceStudies()
				player.a.lowest_penalty = new Decimal(0)
			},
			canClick() {return true},
			style: {"min-height": "60px"}
		},
		13: {
			display() {return "Force a V reset"},
			onClick() {
				if(!confirm("Really reset the V layer for no reward?")) return
				player.points = new Decimal(0)
				basicVReset("a")
				player.a.lowest_penalty = getPenaltyStudyAmt()
			},
			canClick() {return true},
			unlocked() {return getPenaltyStudyAmt().gt(0)},
			style: {"min-height": "60px"}
		},
		14: {
			display() {return "Hide penalty studies"},
			onClick() {
				player.a.show_penalty_studies = false
			},
			canClick() {return true},
			unlocked() {return player.a.show_penalty_studies && hasMilestone('ra', 106) && !getPenaltyStudyAmt().gt(0)},
			style: {"min-height": "60px"}
		},
		15: {
			display() {return "Show penalty studies"},
			onClick() {
				player.a.show_penalty_studies = true
			},
			canClick() {return true},
			unlocked() {return !player.a.show_penalty_studies && hasMilestone('ra', 106)},
			style: {"min-height": "60px"}
		},
		16: {
			display() {return "Import tree"},
			onClick() {
				importSpaceTree()
			},
			canClick() {return true},
			style: {"min-height": "60px", "width": "80px"}
		},
	},
	
	upgrades: {
        11: {
			description: "Halve v reset requirement",
			cost() {
				cost = new Decimal(1)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked: true,
			branches: [21,22,41,42],
        },
        21: {
			description: "Boost v point gain based on cells",
			cost() { 
				cost = new Decimal(2)
				if(hasUpgrade('a', 22)) cost = cost.times(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked: true,
			effect() {
				return player.points.pow(0.01).add(player.points.add(1).log(2)).max(1).pow(0.5)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			canAfford() {return hasUpgrade('a', 11)},
			branches: [31,32],
        },
        22: {
			description: "Boost v point gain based on v points",
			cost() { 
				cost = new Decimal(2)
				if(hasUpgrade('a', 21)) cost = cost.times(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked: true,
			effect() {
				return player["v"].points.pow(0.01).add(player["v"].points.add(1).log(2)).div(10).add(1).pow(0.5)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			canAfford() {return hasUpgrade('a', 11)},
			branches: [31,32],
        },
        31: {
			description: "Boost v point gain based on v prestige points",
			cost() { 
				cost = new Decimal(3)
				if(hasUpgrade('a', 32)) cost = cost.times(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 41)},
			effect() {
				return player["vp"].points.pow(0.05).add(player["vp"].points.add(1).log(10)).div(2).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			canAfford() {return hasUpgrade('a', 21) || hasUpgrade('a', 22)},
			branches: [51,52],
        },
        32: {
			description: "Gain 5% more v points for each purchased v buyable",
			cost() { 
				cost = new Decimal(3)
				if(hasUpgrade('a', 31)) cost = cost.times(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 42)},
			effect() {
				return new Decimal(1.05).pow(getvbuys())
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			canAfford() {return hasUpgrade('a', 21) || hasUpgrade('a', 22)},
			branches: [51,52],
        },
        41: {
			description: "Divide V reset requirement by 3",
			cost() { 
				cost = new Decimal(5)
				if(hasUpgrade('a', 42)) cost = cost.times(2)				
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked: true,
			canAfford() {return hasUpgrade('a', 11)},
        },
        42: {
			description: "V reset requirement ×10, but v point gain ×8",
			cost() { 
				cost = new Decimal(5)
				if(hasUpgrade('a', 41)) cost = cost.times(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked: true,
			canAfford() {return hasUpgrade('a', 11)},
        },
        51: {
			description: "V point boost based on unspent Space Theorems",
			cost() { 
				cost = new Decimal(4)
				if(hasUpgrade('a', 52)) cost = cost.times(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 53)},
			effect() {
				return player["a"].theorems.pow(0.9).add(2)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			canAfford() {return hasUpgrade('a', 31) || hasUpgrade('a', 32)},
			branches: [61,62,63,81],
        },
        52: {
			description: "Bought space study amount multiplies v point gain",
			cost() { 
				cost = new Decimal(4)
				if(hasUpgrade('a', 51)) cost = cost.times(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 53)},
			effect() {
				return new Decimal(player["a"].upgrades.length).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			canAfford() {return hasUpgrade('a', 31) || hasUpgrade('a', 32)},
			branches: [61,62,63,81],
        },
        61: {
			description: "Reduce buyable 1 cost scaling",
			cost() { 
				cost = new Decimal(6)
				if(hasUpgrade('a', 62)) cost = cost.add(6)				
				if(hasUpgrade('a', 63)) cost = cost.add(6)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 53)},
			canAfford() {return hasUpgrade('a', 51) || hasUpgrade('a', 52)},
			branches: [71,72],
        },
        62: {
			description: "Square effect of buyable 2",
			cost() { 
				cost = new Decimal(6)
				if(hasUpgrade('a', 61)) cost = cost.add(6)				
				if(hasUpgrade('a', 63)) cost = cost.add(6)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 53)},
			canAfford() {return hasUpgrade('a', 51) || hasUpgrade('a', 52)},
			branches: [71,72],
        },
        63: {
			description: "Improve buyable 3 effect formula",
			cost() { 
				cost = new Decimal(6)
				if(hasUpgrade('a', 61)) cost = cost.add(6)				
				if(hasUpgrade('a', 62)) cost = cost.add(6)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 53)},
			canAfford() {return hasUpgrade('a', 51) || hasUpgrade('a', 52)},
			branches: [71,72],
        },
        71: {
			description: "Double passive v point gain",
			cost() { 
				cost = new Decimal(8)
				if(hasUpgrade('a', 72)) cost = cost.times(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 53)},
			canAfford() {return hasUpgrade('a', 61) || hasUpgrade('a', 62) || hasUpgrade('a', 63)},
			branches: [91,92,93],
        },
        72: {
			description: "Passive v point gain is 16x stronger but gain 4x less v points",
			cost() { 
				cost = new Decimal(8)
				if(hasUpgrade('a', 71)) cost = cost.times(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 53)},
			canAfford() {return hasUpgrade('a', 61) || hasUpgrade('a', 62) || hasUpgrade('a', 63)},
			branches: [91,92,93],
        },
        81: {
			description: "Reduce the Space Theorem cost of Space Studies by 1",
			cost() { 
				cost = new Decimal(10)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 53)},
			canAfford() {return hasUpgrade('a', 51) || hasUpgrade('a', 52)},
        },
        91: {
			description: "Gain 100x less v points but 100x more v prestige points",
			cost() { 
				cost = new Decimal(10)
				if(hasUpgrade('a', 92)) cost = cost.add(10)				
				if(hasUpgrade('a', 93)) cost = cost.add(10)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 51) && hasUpgrade('v', 52) && hasUpgrade('v', 53)},
			canAfford() {return hasUpgrade('a', 71) || hasUpgrade('a', 72)},
			onPurchase() {
				// :/
				player.v.points = player.v.points.div(100)
				player.v.best_points_min = player.v.best_points_min.div(100)
			},
			branches: [101,102,103,104,105,106],
        },
        92: {
			description: "Double v point and v prestige point gain",
			cost() { 
				cost = new Decimal(10)
				if(hasUpgrade('a', 91)) cost = cost.add(10)				
				if(hasUpgrade('a', 93)) cost = cost.add(10)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 51) && hasUpgrade('v', 52) && hasUpgrade('v', 53)},
			canAfford() {return hasUpgrade('a', 71) || hasUpgrade('a', 72)},
			branches: [101,102,103,104,105,106],
        },
        93: {
			description: "Gain 10x more v points but 10x less v prestige points",
			cost() { 
				cost = new Decimal(10)
				if(hasUpgrade('a', 91)) cost = cost.add(10)				
				if(hasUpgrade('a', 92)) cost = cost.add(10)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasUpgrade('v', 51) && hasUpgrade('v', 52) && hasUpgrade('v', 53)},
			canAfford() {return hasUpgrade('a', 71) || hasUpgrade('a', 72)},
			branches: [101,102,103,104,105,106],
        },
        101: {
			description: "Multiply v point gain by 100 but divide passive v point gain by 10",
			cost() { 
				cost = new Decimal(10)
				if(hasUpgrade('a', 102)) cost = cost.add(10)				
				if(hasUpgrade('a', 103)) cost = cost.add(10)
				if(hasUpgrade('a', 104)) cost = cost.add(10)
				if(hasUpgrade('a', 105)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.div(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return getBuyableAmount("ra", 13).add(1).gte(6)},
			
			canAfford() {return hasUpgrade('a', 91) || hasUpgrade('a', 92) || hasUpgrade('a', 93)},
        },
        102: {
			description: "Unspent Space Theorems boost all memory chunk gain",
			cost() { 
				cost = new Decimal(10)
				if(hasUpgrade('a', 101)) cost = cost.add(10)				
				if(hasUpgrade('a', 103)) cost = cost.add(10)
				if(hasUpgrade('a', 104)) cost = cost.add(10)
				if(hasUpgrade('a', 105)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.div(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return getBuyableAmount("ra", 13).add(1).gte(12)},
			effect() {
				return player["a"].theorems.pow(4/9).max(1)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			canAfford() {return hasUpgrade('a', 91) || hasUpgrade('a', 92) || hasUpgrade('a', 93)},
        },
        103: {
			description: "Reduce the Space Theorem cost of Space Studies by 1",
			cost() { 
				cost = new Decimal(10)
				if(hasUpgrade('a', 101)) cost = cost.add(10)				
				if(hasUpgrade('a', 102)) cost = cost.add(10)
				if(hasUpgrade('a', 104)) cost = cost.add(10)
				if(hasUpgrade('a', 105)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.div(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return getBuyableAmount("ra", 13).add(1).gte(18)},
			canAfford() {return hasUpgrade('a', 91) || hasUpgrade('a', 92) || hasUpgrade('a', 93)},
        },
        104: {
			description: "\"Celestial cells boost v prestige point gain\" VP upgrade is much stronger",
			cost() { 
				cost = new Decimal(10)
				if(hasUpgrade('a', 101)) cost = cost.add(10)				
				if(hasUpgrade('a', 102)) cost = cost.add(10)
				if(hasUpgrade('a', 103)) cost = cost.add(10)
				if(hasUpgrade('a', 105)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.div(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return getBuyableAmount("ra", 13).add(1).gte(24)},
			effect() {
				return softcap(player.points.div(10).pow(1.36).times(6).max(1),new Decimal(10**6),new Decimal(0.36))
			},
			effectDisplay() { return "Upgrade effect is "+format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			canAfford() {return hasUpgrade('a', 91) || hasUpgrade('a', 92) || hasUpgrade('a', 93)},
        },
        105: {
			description: "Memories boost V point gain",
			cost() { 
				cost = new Decimal(10)
				if(hasUpgrade('a', 101)) cost = cost.add(10)				
				if(hasUpgrade('a', 102)) cost = cost.add(10)
				if(hasUpgrade('a', 103)) cost = cost.add(10)
				if(hasUpgrade('a', 104)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.div(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return getBuyableAmount("ra", 13).add(1).gte(30)},
			effect() {
				return player.ra.v_memories.mul(player.ra.ra_memories).max(1).pow(0.5).log(10**6).pow(6)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
			canAfford() {return hasUpgrade('a', 91) || hasUpgrade('a', 92) || hasUpgrade('a', 93)},
        },
        106: {
			description: "Halve the costs of all studies in this row (before discount)",
			cost() { 
				cost = new Decimal(10)
				if(hasUpgrade('a', 101)) cost = cost.add(10)				
				if(hasUpgrade('a', 102)) cost = cost.add(10)
				if(hasUpgrade('a', 103)) cost = cost.add(10)
				if(hasUpgrade('a', 104)) cost = cost.add(10)
				if(hasUpgrade('a', 105)) cost = cost.add(10)
				if(hasUpgrade('a', 106)) cost = cost.div(2)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return getBuyableAmount("ra", 13).add(1).gte(36)},
			canAfford() {return hasUpgrade('a', 91) || hasUpgrade('a', 92) || hasUpgrade('a', 93)},
        },
        1: {
			description: "Square v point gain cap but square root v point gain",
			cost() { 
				cost = new Decimal(12)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return inChallenge('ra', 11) && hasUpgrade('vp', 26)},
        },
        2: {
			description: "When you buy this study, instantly gain VP points based on your best Recognition Therapy VP point amount",
			cost() { 
				cost = new Decimal(12)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return inChallenge('ra', 11) && hasUpgrade('vp', 26)},
			effect() {
				return player.ra.bestTherapyVP.pow(0.5).floor().mul(1000)
			},
			effectDisplay() { return "Awards "+format(upgradeEffect(this.layer, this.id))+" VP points" }, // Add formatting to the effect
			onPurchase() {
				player.vp.points = player.vp.points.add(upgradeEffect(this.layer, this.id))
			}
        },
        82: {
			description: "Divide the V Booster cost by 1e15",
			cost() { 
				cost = new Decimal(30)
				if(hasUpgrade('a', 83)) cost = cost.add(30)				
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasMilestone('ra', 105) && !inChallenge('ra', 11)},
			canAfford() {return hasUpgrade('a', 81)},
			branches: [81],
        },
        83: {
			description: "Divide the V Booster cost by 10 per unspent Space Theorem",
			cost() { 
				cost = new Decimal(30)
				if(hasUpgrade('a', 82)) cost = cost.add(30)				
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasMilestone('ra', 105) && !inChallenge('ra', 11)},
			canAfford() {return hasUpgrade('a', 81)},
			effect() {
				return softcap(softcap(new Decimal(10).pow(player["a"].theorems),new Decimal("1e25")),new Decimal(player.vb.points.gte(18) ? "1e36" : "1e30")) // shhhhhh
			},
			effectDisplay() { 
			var softcapText = ""
			if(upgradeEffect(this.layer, this.id).gt("1e25")) softcapText = "<br>(softcap at 1e25)"
			return "÷"+format(upgradeEffect(this.layer, this.id),precision=0)+softcapText 
			}, // Add formatting to the effect
			branches: [81],
        },
		
		// PENALTY studies
        10001: {
			description: "PENALTY: V reset requirement is always at least 10",
			cost() { 
				cost = new Decimal(0)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasMilestone('ra', 106) && player.a.show_penalty_studies},
			canAfford() {return hasUpgrade('a', 11)},
			style() {
				if (hasUpgrade(this.layer,this.id)) return {"background-color": "#7F2F1F"}
				if (!canAffordUpgrade(this.layer,this.id)) return {"background-color": "#BF8F8F"}
				return {"background-color": "#CC3314"}
			},
        },
        10002: {
			description: "PENALTY: V point gain ^0.9",
			cost() { 
				cost = new Decimal(0)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasMilestone('ra', 106) && player.a.show_penalty_studies},
			canAfford() {return hasUpgrade('a', 21) || hasUpgrade('a', 22)},
			style() {
				if (hasUpgrade(this.layer,this.id)) return {"background-color": "#7F2F1F"}
				if (!canAffordUpgrade(this.layer,this.id)) return {"background-color": "#BF8F8F"}
				return {"background-color": "#CC3314"}
			},
        },
        10003: {
			description: "PENALTY: Celestial cell gain ^(1/100)",
			cost() { 
				cost = new Decimal(0)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasMilestone('ra', 106) && player.a.show_penalty_studies},
			canAfford() {return hasUpgrade('a', 31) || hasUpgrade('a', 32)},
			style() {
				if (hasUpgrade(this.layer,this.id)) return {"background-color": "#7F2F1F"}
				if (!canAffordUpgrade(this.layer,this.id)) return {"background-color": "#BF8F8F"}
				return {"background-color": "#CC3314"}
			},
        },
        10004: {
			description: "PENALTY: Divide V point gain by 2 for every owned Space Study",
			cost() { 
				cost = new Decimal(0)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasMilestone('ra', 106) && player.a.show_penalty_studies},
			canAfford() {return hasUpgrade('a', 51) || hasUpgrade('a', 52)},
			effect() {
				return new Decimal(2).pow(player["a"].upgrades.length)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			style() {
				if (hasUpgrade(this.layer,this.id)) return {"background-color": "#7F2F1F"}
				if (!canAffordUpgrade(this.layer,this.id)) return {"background-color": "#BF8F8F"}
				return {"background-color": "#CC3314"}
			},
        },
        10005: {
			description: "PENALTY: V buyable costs scale twice as fast",
			cost() { 
				cost = new Decimal(0)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasMilestone('ra', 106) && player.a.show_penalty_studies},
			canAfford() {return hasUpgrade('a', 61 ) || hasUpgrade('a', 62) || hasUpgrade('a', 63)},
			style() {
				if (hasUpgrade(this.layer,this.id)) return {"background-color": "#7F2F1F"}
				if (!canAffordUpgrade(this.layer,this.id)) return {"background-color": "#BF8F8F"}
				return {"background-color": "#CC3314"}
			},
        },
        10006: {
			description: "PENALTY: Disable passive v point generation",
			cost() { 
				cost = new Decimal(0)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasMilestone('ra', 106) && player.a.show_penalty_studies},
			canAfford() {return hasUpgrade('a', 71) || hasUpgrade('a', 72)},
			style() {
				if (hasUpgrade(this.layer,this.id)) return {"background-color": "#7F2F1F"}
				if (!canAffordUpgrade(this.layer,this.id)) return {"background-color": "#BF8F8F"}
				return {"background-color": "#CC3314"}
			},
        },
        10007: {
			description: "PENALTY: You can't use these Space Theorems",
			cost() { 
				cost = new Decimal(20)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasMilestone('ra', 106) && player.a.show_penalty_studies},
			canAfford() {return hasUpgrade('a', 81)},
			style() {
				if (hasUpgrade(this.layer,this.id)) return {"background-color": "#7F2F1F"}
				if (!canAffordUpgrade(this.layer,this.id)) return {"background-color": "#BF8F8F"}
				return {"background-color": "#CC3314"}
			},
        },
        10008: {
			description: "PENALTY: Square root the V prestige point effect",
			cost() { 
				cost = new Decimal(0)
				cost = cost.sub(ssdiscount()).max(0)
				return cost
			},			
			currencyDisplayName: "Space Theorems",
			currencyInternalName: "theorems",
			currencyLayer: "a",
			unlocked() {return hasMilestone('ra', 106) && player.a.show_penalty_studies},
			canAfford() {return hasUpgrade('a', 91) || hasUpgrade('a', 92) || hasUpgrade('a', 93)},
			style() {
				if (hasUpgrade(this.layer,this.id)) return {"background-color": "#7F2F1F"}
				if (!canAffordUpgrade(this.layer,this.id)) return {"background-color": "#BF8F8F"}
				return {"background-color": "#CC3314"}
			},
        },
		
		
		
		
		
	},	
	
	milestones: {
		0: {
			requirementDescription: "2 V-Achievements",
			effectDescription: "Start with a single celestial cell on v-reset",
			done() { return player.a.points.gte(2) }
		},
		1: {
			requirementDescription: "5 V-Achievements",
			effectDescription() {return `V point multiplier based on total Space Theorems<br>
			Currently: ${format(am1eff())}x`},
			done() { return player.a.points.gte(5) }
		},
		2: {
			requirementDescription: "10 V-Achievements",
			effectDescription() {
				var softcapped = ""
				if (vautopow().gt(0.5)) softcapped = " (softcapped when > 50% of best vp/min)"
				return `Passively generate v points based on best v points per minute<br>
			Currently: +${format(player.v.best_points_min.times(vautopow()))}/min${softcapped}`
			},
			done() { return player.a.points.gte(10) }
		},
		3: {
			requirementDescription: "16 V-Achievements",
			effectDescription: "Unlock more V upgrades",
			done() { return player.a.points.gte(16) }
		},
		4: {
			requirementDescription: "30 V-Achievements",
			effectDescription: "All V upgrades in the first three rows are always visible",
			done() { return player.a.points.gte(30) },
			unlocked() { return hasUpgrade('v', 53) }			
		},
		5: {
			requirementDescription: "36 V-Achievements",
			effectDescription: "Reduce the Space Theorem cost of Space Studies by 2.<br>Unlock Ra, Celestial of the Forgotten.",
			done() { return player.a.points.gte(36) },
			unlocked() { return hasUpgrade('v', 53) }
		},
		6: {
			requirementDescription: "48 V-Achievements",
			effectDescription() {return `V-Achievements boost Recognition Therapy v point gain cap<br>
			Currently: ${format(am6eff())}x`},
			done() { return player.a.points.gte(48) && hasMilestone('ra', 103) },
			unlocked() { return hasMilestone('ra', 103) }
		},
		7: {
			requirementDescription: "66 V-Achievements",
			effectDescription() {return `Divide the memory cost of leveling up V by your V achievement amount`},
			done() { return player.a.points.gte(66) && hasMilestone('ra', 103) },
			unlocked() { return hasMilestone('ra', 103) }
		},
		8: {
			requirementDescription: "96 V-Achievements",
			effectDescription() {return `You can buy the VP therapy upgrades outside of Recognition Therapy,<br>though they are more expensive outside of therapy`},
			done() { return player.a.points.gte(96) && hasMilestone('ra', 106) },
			unlocked() { return hasMilestone('ra', 106) }
		},

	},
	
})
function am6eff() {
	return new Decimal(2).pow(player.a.points.sub(48)).times(10).max(1)
}
function chunkMult() {
	var mult = new Decimal(1)
	if (inChallenge('ra', 11)) mult = mult.times(tmp["vb"].effect[3])
	if (hasMilestone('ra', 200)) mult = mult.times(raMilestoneEff(200))
	if (hasUpgrade('vp', 35)) mult = mult.times(upgradeEffect('vp', 35))
	if (hasUpgrade('a', 102)) mult = mult.times(upgradeEffect('a', 102))
	return mult
}
function memMult() {
	var mult = new Decimal(1)
	if (hasUpgrade('vp', 51)) mult = mult.times(upgradeEffect('vp', 51))
	if (hasUpgrade('vp', 53)) mult = mult.times(upgradeEffect('vp', 53))
	if (hasMilestone('ra', 200)) mult = mult.times(raMilestoneEff(200))
	if (hasMilestone('ra', 102)) mult = mult.times(raMilestoneEff(102))
	if (hasMilestone('ra', 202)) mult = mult.times(raMilestoneEff(202))
	if (hasUpgrade('vp', 15)) mult = mult.times(upgradeEffect('vp', 15))
	if (hasUpgrade('vp', 65)) mult = mult.times(upgradeEffect('vp', 65))
	if (hasUpgrade('vp', 66)) mult = mult.times(upgradeEffect('vp', 66))

	return mult
}
function r11gaincap() {
	var cap = player.points
	if (hasMilestone('ra', 201)) cap = cap.times(player.points)
	if (inChallenge('ra', 11)) cap = cap.times(tmp["vb"].effect[2])
	if (hasMilestone('a',6)) cap = cap.times(am6eff())
	cap = cap.times(buyableEffect("vp",13))
	if (hasUpgrade('a', 1)) cap = cap.pow(2)
	return cap
}
function baseVChunksSec() {
	if (!inChallenge('ra', 11)) return new Decimal(0)
	var power = 2.25
	if (hasMilestone('ra', 205)) power = 3
	return getResetGain('v', useType = "normal").add(1).log(10).div(6).pow(power).mul(4)
}
function baseRaChunksSec() {
	if (!inChallenge('ra', 11)) return new Decimal(0)
	if (player["a"].upgrades.length <= 10) return new Decimal(1.55).pow(player["a"].upgrades.length).pow(0.95).div(199)
	var power = 1.15
	if (hasMilestone('ra', 205)) power = 1.25
	var sc = 4
	if (hasMilestone('ra', 205)) sc = 8
	return new Decimal(player["a"].upgrades.length/10-1).max(0).pow(1.5).mul(4).max(0).mul(new Decimal(Math.PI/2.5).pow(softcap(new Decimal(player["a"].upgrades.length-5).max(0).pow(power), new Decimal(sc))))
}
function vChunksSec() {
	var amt = baseVChunksSec()
	amt = amt.mul(buyableEffect("ra",12))
	amt = amt.mul(chunkMult())
	if (player.ra.remembrance.equals(1)) amt = amt.times(5)
	if (player.ra.remembrance.equals(2)) amt = amt.times(0.5)
	return amt
}
function vMemsSec() {
	var amt = player.ra.v_chunks // base
	amt = amt.mul(buyableEffect("ra",11))
	amt = amt.mul(memMult())
	return amt	
}
function raChunksSec() {
	var amt = baseRaChunksSec()
	amt = amt.mul(buyableEffect("ra",22))
	amt = amt.mul(chunkMult())
	if (player.ra.remembrance.equals(1)) amt = amt.times(0.5)
	if (player.ra.remembrance.equals(2)) amt = amt.times(5)
	return amt	
}
function raMemsSec() {
	var amt = player.ra.ra_chunks // base
	amt = amt.mul(buyableEffect("ra",21))
	amt = amt.mul(memMult())
	return amt
}
function raMilestoneEff(num) {
	if (num == 100) return new Decimal(1+player["vp"].upgrades.length/10).add(hasUpgrade('v', 61) ? 0.4 : 0).pow(getBuyableAmount("ra", 13).add(1))
	if (num == 102) return new Decimal(10).add(vachtst()).mul(0.1).sub(3).max(1).pow(8/9)
	if (num == 200) return getBuyableAmount("ra", 23).add(2)
	if (num == 202) return vChunksSec().mul(raChunksSec()).add(1).pow(0.5).log(10).pow(0.3).add(2)
	if (num == 203) return player.v.points.pow(0.1).add(player["v"].points.add(1).log(5)).pow(2).max(1)
	if (num == 206) return new Decimal(Math.PI/2).pow(getBuyableAmount("ra", 23).add(1))
	console.log("unknown ra milestone number "+num)
	return new Decimal(1)
}
function totalCelLevels() {
	return getBuyableAmount("ra", 13).add(getBuyableAmount("ra", 23)).add(2)
}
function staircase(x) {
	return x.mul(x.add(1)).div(2)
}
addLayer("ghost1", {
    position: 0, 
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown() {
		if(hasMilestone('a', 5)) return "ghost"
		return false
	},
})
addLayer("ra", {
    name: "Ra", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ra", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		remembered_build: {},
		showtherapy: false,
		v_chunks: new Decimal(0),
		v_memories: new Decimal(0),
		ra_chunks: new Decimal(0),
		ra_memories: new Decimal(0),
		remembrance: new Decimal(0),
		bestTherapyVP: new Decimal(0),
    }},
    color: "#9064DE",
    requires: new Decimal(10),
	tooltip() {
		if (!player.ra.showtherapy) return "Ra"
		return `${format(player.ra.v_memories)}<br>V Memories,<br>${format(player.ra.ra_memories)}<br>Ra Memories`
	},
    row: 0, // Row the layer is in on the tree (0 is the first row)

	challenges: {
		11: {
			name: "Recognition Therapy",
			canComplete: false,
			onEnter() {
				player.ra.showtherapy = true
				player.ra.remembered_build["vpupgs"] = player.vp.upgrades 
				player.ra.remembered_build["vpbuys"] = player.vp.buyables 
				player.ra.remembered_build["vppoints"] = player.vp.points 
				basicVReset("ra")
				layerDataReset("vp")
				player.points = new Decimal(0)
				respecSpaceStudies()
				
				//if (player.ra.remembered_build["vpupgs"].includes(23)) player.vp.upgrades.push(23)
				//if (player.ra.remembered_build["vpupgs"].includes(24)) player.vp.upgrades.push(24)
			},
			onExit() {
				player.vp.upgrades = player.ra.remembered_build["vpupgs"]
				player.vp.buyables = player.ra.remembered_build["vpbuys"]
				for (const property in player.vp.buyables) {
					player.vp.buyables[property] = new Decimal(player.vp.buyables[property])
				}
				player.vp.points = new Decimal(player.ra.remembered_build["vppoints"])
				respecSpaceStudies()
			},
			fullDisplay() { return "V tries to help Ra remember why they're even here.<br>Cube celestial cell gain, but reset V and VP content and cap v point gain at current celestial cell amount.<br><br>While in therapy, you generate memory chunks for V and Ra.<br><br>Space studies respec upon entering or exiting therapy.<br>Regain VP content when exiting therapy.<br>" },
			unlocked() {
				return player.vp.points.gte("1e36") || player.ra.showtherapy
			},
			style: {'background-color': '#000000', 'color': '#9064DE', 'border-color': '#9064DE', 'border-width': '6px', 'width': '450px'}
		},
	},

	update(diff) {
		// Do layer resource gains
		player.ra.v_chunks = player.ra.v_chunks.add(vChunksSec().mul(diff))
		player.ra.v_memories = player.ra.v_memories.add(vMemsSec().mul(diff))
		player.ra.ra_chunks = player.ra.ra_chunks.add(raChunksSec().mul(diff))
		player.ra.ra_memories = player.ra.ra_memories.add(raMemsSec().mul(diff))
		if(inChallenge('ra', 11) && player.vp.points.gt(player.ra.bestTherapyVP))
			player.ra.bestTherapyVP = player.vp.points.add(0)
	},

    buyables: {
		11: {
			title: "V's Recollection",
			cost(x) { return new Decimal(5).pow(x).mul(1000) },
			display() { return ` Gain 30% more V Memories <br>
                Cost: ${format(this.cost())} Memories
				Effect: x${format(this.effect())}
				`}, 
			canAfford() { return player[this.layer].v_memories.gte(this.cost()) },
			buy() {
				player[this.layer].v_memories = player[this.layer].v_memories.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				return new Decimal(1.3).pow(getBuyableAmount("ra", 11))
			},
			unlocked() {return player.ra.showtherapy},
		},
		12: {
			title: "V's Fragmentation",
			cost(x) { return new Decimal(25).pow(x).mul(5000) },
			display() { return ` Gain 50% more V Memory Chunks <br>
                Cost: ${format(this.cost())} Memories
				Effect: x${format(this.effect())}
				`}, 
			canAfford() { return player[this.layer].v_memories.gte(this.cost()) },
			buy() {
				player[this.layer].v_memories = player[this.layer].v_memories.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				return new Decimal(1.5).pow(getBuyableAmount("ra", 12))

			},
			unlocked() {return player.ra.showtherapy},
		},
		13: {
			title() {return "V Level "+getBuyableAmount(this.layer, this.id).add(1)},
			cost(x) {
				x = x.add(1);
				var cost_divider = new Decimal(1)
				if(hasMilestone('a', 7)) cost_divider = cost_divider.mul(player.a.points)
				return (x.add(x.pow(2).div(10))).pow(5.52).times(10**6).times(new Decimal(1.5).pow(x.sub(5).max(0))).times(new Decimal(1.1).pow(staircase(x.sub(25).max(0)))).div(cost_divider) 
			},
			display() { return ` Level V to ${format(player[this.layer].buyables[this.id].add(2),precision=0)}<br>
                Cost: ${format(this.cost())} Memories`}, 
			canAfford() { return player[this.layer].v_memories.gte(this.cost()) },
			buy() {
				player[this.layer].v_memories = player[this.layer].v_memories.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				return getBuyableAmount("ra", 13).add(1)
			},
			unlocked() {return player.ra.showtherapy},
		},
		21: {
			title: "Ra's Recollection",
			cost(x) { return new Decimal(5).pow(x).mul(1000) },
			display() { return ` Gain 30% more Ra Memories <br>
                Cost: ${format(this.cost())} Memories
				Effect: x${format(this.effect())}
				`}, 
			canAfford() { return player[this.layer].ra_memories.gte(this.cost()) },
			buy() {
				player[this.layer].ra_memories = player[this.layer].ra_memories.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				return new Decimal(1.3).pow(getBuyableAmount("ra", 21))
			},
			unlocked() {return player.ra.showtherapy},
		},
		22: {
			title: "Ra's Fragmentation",
			cost(x) { return new Decimal(25).pow(x).mul(5000) },
			display() { return ` Gain 50% more Ra Memory Chunks <br>
                Cost: ${format(this.cost())} Memories
				Effect: x${format(this.effect())}
				`}, 
			canAfford() { return player[this.layer].ra_memories.gte(this.cost()) },
			buy() {
				player[this.layer].ra_memories = player[this.layer].ra_memories.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				return new Decimal(1.5).pow(getBuyableAmount("ra", 22))
			},
			unlocked() {return player.ra.showtherapy},
		},
		23: {
			title() {return "Ra Level "+getBuyableAmount(this.layer, this.id).add(1)},
			cost(x) { 
				x = x.add(1);
				return (x.add(x.pow(2).div(10))).pow(5.52).times(10**6).times(new Decimal(1.5).pow(x.sub(5).max(0))).mul(new Decimal(1.1).pow(staircase(x.sub(25).max(0)))) },
			display() { return ` Level Ra to ${format(player[this.layer].buyables[this.id].add(2),precision=0)}<br>
                Cost: ${format(this.cost())} Memories`}, 
			canAfford() { return player[this.layer].ra_memories.gte(this.cost()) },
			buy() {
				player[this.layer].ra_memories = player[this.layer].ra_memories.sub(this.cost())
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
			},
			effect() {
				return getBuyableAmount("ra", 23).add(1)
			},
			unlocked() {return player.ra.showtherapy},
		},        
	},
	
	
	
	infoboxes: {
		lore: {
			title: "Dialoglog",
			body() { return `<br>
			V: "RA?? What are you DOING here? This is MY Reality!"<br><br>
			Ra: "I... I'm... uhh..."<br><br>
			Ra: "You know, I don't remember."<br>
			⠀`
			},
		},
		therapyinfo: {
			title: "Recognition Therapy Info",
			body() { return `<br>
				V is helping Ra recollect their memories.<br><br>
				While in Recognition Therapy, Ra generates V Memory Chunks based on uncapped v point gain amount, and Ra Memory Chunks based on bought Space Study amount.<br><br>
				Memory Chunks will generate Memories over time, even outside of therapy.<br><br>
				Memories can be spent on three things - an increase to Memory Chunk gain, an increase to Memory gain, and leveling up Ra's Memory level for either Celestial.<br>
				⠀`
			},
			unlocked() {return inChallenge('ra', 11)},
		},
	},

	milestones: {
		100: {
			requirementDescription: "V Level 1",
			effectDescription() {return "Each V level multiplies V point gain by "+format(new Decimal(1+player["vp"].upgrades.length/10).add(hasUpgrade('v', 61) ? 0.4 : 0))+" (based on VP upgrade amount)<br>Currently: "+format(raMilestoneEff(100))+"x"},
			done() { return player.ra.showtherapy },
			unlocked() {return player.ra.showtherapy},
		},
		101: {
			requirementDescription: "V Level 2",
			effectDescription: "Unlock V Boosters",
			done() { return getBuyableAmount("ra", 13).add(1).gte(2) },
			unlocked() {return player.ra.showtherapy},
		},
		102: {
			requirementDescription: "V Level 5",
			effectDescription() {return "All Memory Chunks produce more Memories based on total Space Theorems<br>Currently: "+format(raMilestoneEff(102))+"x"},
			done() { return getBuyableAmount("ra", 13).add(1).gte(5) },
			unlocked() {return player.ra.showtherapy},
		},
		103: {
			requirementDescription: "V Level 6",
			effectDescription: "Unlock Hard V-Achievements and unlock a new Space Study every 6 V levels up to V Level 36.",
			done() { return getBuyableAmount("ra", 13).add(1).gte(6) },
			unlocked() {return player.ra.showtherapy},
		},
		104: {
			requirementDescription: "V Level 10",
			effectDescription: "Gain a free level to the first VP buyable for every V Level,<br>and a free level to the second VP buyable for every other V Level.",
			done() { return getBuyableAmount("ra", 13).add(1).gte(10) },
			unlocked() {return player.ra.showtherapy},
		},
		105: {
			requirementDescription: "V Level 15",
			effectDescription: "Unlock two costly Space Studies outside of Recognition Therapy that cheapen V Boosters",
			done() { return getBuyableAmount("ra", 13).add(1).gte(15) },
			unlocked() {return player.ra.showtherapy},
		},
		106: {
			requirementDescription: "V Level 25",
			effectDescription: "Unlock 3 more Hard V-Achievements",
			done() { return getBuyableAmount("ra", 13).add(1).gte(25) },
			unlocked() {return player.ra.showtherapy},
		},
		200: {
			requirementDescription: "Ra Level 1",
			effectDescription() {return "(Ra Level+1) multiplies all memory and memory chunk gain<br>Currently: "+format(raMilestoneEff(200))+"x"},
			done() { return player.ra.showtherapy },
			unlocked() {return player.ra.showtherapy},
		},
		201: {
			requirementDescription: "Ra Level 2",
			effectDescription: "Multiply Recognition Therapy v point gain cap by celestial cells again",
			done() { return getBuyableAmount("ra", 23).add(1).gte(2) },
			unlocked() {return player.ra.showtherapy},
		},
		202: {
			requirementDescription: "Ra Level 5",
			effectDescription() {return "All Memory Chunks produce more Memories based on Memory Chunk gain/s<br>Currently: "+format(raMilestoneEff(202))+"x"},
			done() { return getBuyableAmount("ra", 23).add(1).gte(5) },
			unlocked() {return player.ra.showtherapy},
		},
		203: {
			requirementDescription: "Ra Level 8",
			effectDescription: "Unlock two new columns of V prestige upgrades while in Recognition Therapy",
			done() { return getBuyableAmount("ra", 23).add(1).gte(8) },
			unlocked() {return player.ra.showtherapy},
		},
		204: {
			requirementDescription: "Ra Level 10",
			effectDescription() {return "All Space Studies cost 0.1 less per Ra level in Recognition Therapy<br>Currently: Space Study theorem cost -"+format(getBuyableAmount("ra", 23).add(1).mul(0.1),precision=1)},
			done() { return getBuyableAmount("ra", 23).add(1).gte(10) },
			unlocked() {return player.ra.showtherapy},
		},
		205: {
			requirementDescription: "Ra Level 15",
			effectDescription: "Boost base gain formulas for Memory Chunks",
			done() { return getBuyableAmount("ra", 23).add(1).gte(15) },
			unlocked() {return player.ra.showtherapy},
		},
		206: {
			requirementDescription: "Ra Level 25",
			effectDescription() {return "V point gain is boosted based on Ra Level, unaffected by Recognition Therapy cap<br>Currently: "+format(raMilestoneEff(206))+"x"},
			done() { return getBuyableAmount("ra", 23).add(1).gte(25) },
			unlocked() {return player.ra.showtherapy},
		},
	},
	
	clickables: {
		11: {
			display() { if (player.ra.remembrance.equals(1)) return "<b>Remembrance given to V</b>"
				return "Give Remembrance to V"
			},
			onClick() {
				if (player.ra.remembrance.equals(1)) player.ra.remembrance = new Decimal(0)
				else player.ra.remembrance = new Decimal(1)
			},
			canClick() {return true},
			unlocked() {
				return totalCelLevels().gte(20)
			},
		},
		12: {
			display() { if (player.ra.remembrance.equals(2)) return "<b>Remembrance given to Ra</b>"
				return "Give Remembrance to Ra"
			},			
			onClick() {
				if (player.ra.remembrance.equals(2)) player.ra.remembrance = new Decimal(0)
				else player.ra.remembrance = new Decimal(2)
			},
			canClick() {return true},
			unlocked() {
				return totalCelLevels().gte(20)
			},
		},
	},

	tabFormat: [
		["display-text", function() {return `<span style="font-size:30px"><u><b>Ra, Celestial of the Forgotten</b></u></span>`}],
		"blank",
		["infobox","lore"],
		"blank",
		["display-text", function() {if(player.vp.points.gte("1e36") || player.ra.showtherapy) return ""; return `<br><span style="font-size:24px">Get 1e36 V prestige points to unlock something here!</span>`}],
		"challenges",
		"blank",
		["infobox","therapyinfo"],
		"blank",
		["display-text", function() {if(!player.ra.showtherapy) return ""; return `${format(player.ra.v_chunks)} V Memory Chunks (${format(vChunksSec())}/sec); ${format(player.ra.v_memories)} V Memories (${format(vMemsSec())}/sec)`}],
		["display-text", function() {if(!player.ra.showtherapy) return ""; return `${format(player.ra.ra_chunks)} Ra Memory Chunks (${format(raChunksSec())}/sec); ${format(player.ra.ra_memories)} Ra Memories (${format(raMemsSec())}/sec)`}],
		"blank",
		"buyables",
		"blank",
		["display-text", function() {
			if (!player.ra.showtherapy) return ""
			if (totalCelLevels().lt(20)) return `Reach 20 combined Celestial levels to unlock Remembrance<br>(you need ${new Decimal(20).sub(totalCelLevels())} more)`
			else {
				var remStr = "No Celestial currently has Remembrance."
				if (player.ra.remembrance.equals(1)) remStr = "V currently has Remembrance."
				if (player.ra.remembrance.equals(2)) remStr = "Ra currently has Remembrance."
				return `<span style="font-size:30px"><b>Remembrance</b></span><br><br>Whichever Celestial has Remembrance will get ×5 Memory Chunk gain.<br>The other Celestial will get ×0.5 Memory Chunk gain.<br>${remStr}<br>⠀`
			}
		}],
		"clickables",
		"blank",
		"milestones",
	],	
	
    layerShown(){return hasMilestone('a', 5)},
	branches: ["v"],
	
	doReset(resettingLayer) {
		if(layers[resettingLayer].row <= layers["ra"].row) return
		if(resettingLayer=='vp' || resettingLayer=='vb') return
		keep = []
		layerDataReset("ra",keep)

	},
})

addLayer("vb", {
    name: "V Boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "VB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#E59544",
    requires() {
		req = new Decimal('1e50')
		if (hasUpgrade('vp', 52)) req = req.div(new Decimal('1e10'))
		if (hasUpgrade('a', 82)) req = req.div(new Decimal('1e15'))
		if (hasUpgrade('a', 83)) req = req.div(upgradeEffect('a', 83))
		return req
	},	
    resource: "V boosters", // Name of prestige currency
    baseResource: "v points", // Name of resource prestige is based on
    baseAmount() {return player["v"].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: new Decimal('1e10'),
	exponent: 1.1, // Prestige currency exponent
	infoboxes: {
		lore: {
			title: "V Boosters",
			body() { return `V Boosters have entirely different effects inside and outside of Recognition Therapy! Check them out in both!`
			},
		},
	},
    effect() {
		return [
			new Decimal(10).pow(player["vb"].points), 
			new Decimal(2).pow(player["vb"].points),
			new Decimal(10**0.5).pow(player["vb"].points),
			new Decimal(2**0.5).pow(player["vb"].points),
		]
	},
    effectDescription(){
		if (!inChallenge('ra', 11)) 
			return "boosting V point gain by " + format(tmp[this.layer].effect[0]) + "x and V prestige point gain by " + format(tmp[this.layer].effect[1])+"x"
		return "boosting V point gain cap by " + format(tmp[this.layer].effect[2]) + "x and all memory chunk gain by " + format(tmp[this.layer].effect[3])+"x"    
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "b", description: "B: Reset for V boosters", onPress(){if (canReset(this.layer)) doReset(this.layer)},
		unlocked() {return hasMilestone('ra', 101)},		
		},
    ],
    layerShown(){return hasMilestone('ra', 101)},

	milestones: {

		
	},

	branches: ["v"],
})