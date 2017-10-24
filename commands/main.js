var yuno = global.yuno
var emoji = require("node-emoji")

let randStatus = function(){
	let cmds = 0;
	for(c in yuno.cmds){cmds++};
	var slist = [
		"on "+yuno.bot.guilds.size+" servers.",
		yuno.prefix+"help",
		"with "+cmds+" commands.",
		"with "+yuno.bot.users.size+" users."
	]

	let rand = Math.floor(Math.random()*slist.length)
	let s = slist[rand]
	yuno.bot.editStatus("online",{name:s})
}

if(yuno.stimer) clearInterval(yuno.stimer);
yuno.stimer = setInterval(randStatus,60000);
