var Eris = require("eris");
var config = require("./config.json");
var whitelist = require("./whitelist.json");
global.yuno = {};
const yuno = global.yuno
yuno.bot = new Eris(process.env.BOT_TOKEN);
yuno.prefix = "$";
yuno.oid = config.ownerid;


Object.defineProperty(Eris.Message.prototype, "guild", {
    get: function() { return this.channel.guild; }
});

var request = require('request')
var util = require("util");
var fs = require("fs");
var path = require("path");
var emoji = require("node-emoji");
var reload = require("require-reload")(require);
utils = reload('./utils/utils.js');
var bot = yuno.bot
bot.on("ready", () => {
	console.log("Loaded YunoChan");
/*
	bot.getDMChannel(config.ownerid)
		.then((c)=>{
			bot.createMessage(c.id,emoji.get(":white_check_mark:")+" Loaded YunoChan")
		})
	bot.createMessage(logid,emoji.get(":white_check_mark:")+" Loaded Yuno")*/
});
function isOwner(msg){
	return msg.author.id == config.ownerid || whitelist[msg.author.id] == true
}

yuno.isOwner = isOwner;

var cmds = {
	help:{
		name:"help",
		desc:"Lists commands.",
		args:"",
		func: function(msg,args){
			var sorted = {}
			Object.keys(cmds).sort().forEach(k => { sorted[k] = cmds[k] })

			let co = 0
			let res = []
			for(item in sorted){
				var c = cmds[item]
				co++
				res.push("\t\u2022 "+c.name+" - "+c.desc)
			}

			if(msg.channel.guild) msg.channel.createMessage(emoji.get("envelope_with_arrow")+" Sending help via DM.");
			bot.getDMChannel(msg.author.id)
			.then((c)=>{
				bot.createMessage(c.id,"__**YunoChan's Commands**__\n"+((res.join("\n")).length > 1998-24 ? (res.join("\n")).substring(0,1998-24) : (res.join("\n"))));

				if(res.join("\n").length > 1998-24){
					bot.createMessage(c.id,res.join("\n").substring(1998-24,res.join("\n").length));
				}
			});
		},
		aliases:[]
	},
	ping:{
		name:"ping",
		desc:"Pong.",
		args:"",
		func: function(msg,args){
			bot.createMessage(msg.channel.id,"Pong.").then((m)=>{
				bot.editMessage(msg.channel.id,m.id,"Pong, took "+Math.floor(m.timestamp-msg.timestamp)+"ms.")
			})
		},
		aliases:[]
	},
	restart:{
		name:"restart",
		desc:"Restarts the bot, duh",
		args:"",
		func: function(msg,args){
			if(isOwner(msg)){
				bot.createMessage(msg.channel.id,emoji.get(":arrows_counterclockwise:")+" Restarting yuno.")
				bot.createMessage(logid,emoji.get(":arrows_counterclockwise:")+" Restarting yuno.")

				if(yuno.userdata){
					fs.writeFileSync("./data/udata.json",JSON.stringify(yuno.userdata));
				}
				setTimeout(process.exit,1500)
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		},
		aliases:[]
	},
	eval:{
		name:"eval",
		desc:"Do I need to say?",
		args:"[string]",
		func: function(msg,args){
			if(isOwner(msg)){
				let output;
				let col = 0x00C000;
				let errored = false;
				try{
					output = eval(args);
				}catch(e){
					output = e.stack;
					errored = true;
					col = 0xC00000;
				}

				msg.channel.createMessage({embed:{
					title:"JS Eval",
					fields:[
						{name:emoji.get("arrow_right")+" Input:",value:"```js\n"+args+"```"},
						{name:emoji.get(errored ? "warning" : "arrow_down")+" Output:"+(errored ? " (errored)" : ""),value:"```js\n"+output+"```"}
					],
					color:col
				}})
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		},
		aliases:["js"]
	},
	unload:{
		name:"unload",
		desc:"Unloads commands",
		args:"[name]",
		func: function(msg,args){
			if(isOwner(msg)){
				delete cmds[args]
					bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		},
		aliases:[]
	},
	load:{
		name:"load",
		desc:"Loads a command/module file.",
		args:"[name]",
		func: function(msg,args){
			if(isOwner(msg)){
				if(fs.existsSync(path.join(__dirname,"commands",args))){
	try{				reload(path.join(__dirname,"commands",args))
						bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
	}catch(e){
		bot.createMessage(msg.channel.id,emoji.get(":warning:")+" Error:\n```js\n"+e+"```")
	}
}else if(fs.existsSync(path.join(__dirname,"commands",args+".js"))){
					reload(path.join(__dirname,"commands",args+".js"))
						bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
				}else{
					bot.createMessage(msg.channel.id,"Not found.")
				}
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		},
		aliases:[]
	},
	whitelist:{
		name:"whitelist",
		desc:"[Bot Owner] Manage whitelist.",
		args:"[add/del] [user]",
		func: function(msg,args){
			if(msg.author.id == config.ownerid){
				let a = args.split(" ");
				if(a[0] == "add"){
					if(!a[1]){
						msg.channel.createMessage("Specify a user!");
						return
					}
					if(!/[0-9]{17,21}/.test(a[1])){
						msg.channel.createMessage("Must use mention!");
						return
					}

					whitelist[a[1].match(/[0-9]{17,21}/)[0]] = true;
					fs.writeFileSync("./whitelist.json",JSON.stringify(whitelist));
					msg.channel.createMessage("Added!");
				}else if(a[0] == "del"){
					if(!a[1]){
						msg.channel.createMessage("Specify a user!");
						return
					}
					if(!/[0-9]{17,21}/.test(a[1])){
						msg.channel.createMessage("Must use mention!");
						return
					}

					delete whitelist[a[1].match(/[0-9]{17,21}/)[0]]
					fs.writeFileSync("./whitelist.json",JSON.stringify(whitelist));
					msg.channel.createMessage("Removed!");
				}else{
					msg.channel.createMessage("Usage: `add/del user`");
				}
			}else{
				bot.createMessage(msg.channel.id,emoji.get(":no_entry_sign:")+" No permission.")
			}
		},
		aliases:[]
	}
};
yuno.cmds = cmds;

function addCommand(name,desc,func,aliases=[],args=""){
	yuno.cmds[name] = {name:name,desc:desc,func:func,aliases:aliases,args:args}
}
yuno.addCommand = addCommand;
yuno.hooks = {};
function addHook(evt,name,func){
	yuno.hooks[evt] = yuno.hooks[evt] || {};
	yuno.hooks[evt][name] = func
	bot.on(evt,func)
}
yuno.addHook = addHook;
yuno.awaitMsgs = {};

yuno.awaitForMessage = function(msg,display,callback,timeout) {
	let dispMsg = msg.channel.createMessage(display);
	timeout = timeout ? timeout : 30000;
	if (!yuno.awaitMsgs.hasOwnProperty(msg.channel.id)){
		yuno.awaitMsgs[msg.channel.id] = {}
	}
	if (yuno.awaitMsgs[msg.channel.id][msg.id]) {
		clearTimeout(yuno.awaitMsgs[msg.channel.id][msg.id].timer);
	}
	yuno.awaitMsgs[msg.channel.id][msg.id] = {
		time:msg.timestamp,
		botmsg:dispMsg
	}

	let func;

	function regEvent() {
		return new Promise((resolve,reject)=>{
			func = function(msg2){
				if (msg2.author.id == msg.author.id){
				let response;
					if(callback){
						response = callback(msg2);
					}else
						response = true;
					if(response){
						bot.removeListener("messageCreate",func);
						clearTimeout(yuno.awaitMsgs[msg.channel.id][msg.id].timer);
						resolve(msg2);
					}
				}
			}
			bot.on("messageCreate",func);
			yuno.awaitMsgs[msg.channel.id][msg.id].func = func;
			yuno.awaitMsgs[msg.channel.id][msg.id].timer = setTimeout(()=>{
				bot.removeListener("messageCreate",func)
				msg.channel.createMessage("Query canceled.");
				reject("Request timed out.");
			},timeout);
		});
	}

	return regEvent();
}

var files = fs.readdirSync(path.join(__dirname,"commands"))
for(f of files){
	require(path.join(__dirname,"commands",f))
	console.log("Loaded Module: "+f)
};

bot.on("messageCreate",(msg) => {
	if(!msg.author.bot){
		let prefix = yuno.prefix;

		if(msg.channel.guild && msg.channel.guild.id == "242110559212929045"){
			const START = /^\/\/ ?|^[{[~-] ?/g;
			const END = / ?[\]}~-]$/g;

			const x = [];
			for (let c of [msg.content, msg.cleanContent]) {
				if (START.test(c)) {
					c = c.replace(START, '');
					if (END.test(c)) {
						c = c.replace(END, '');
					}
				}
				x.push(c.trim());
			}
			[msg.content, msg.cleanContent] = x;
		}

		var prefix2 = yuno.bot.user.mention;
    var prefix3 = yuno.bot.user.username
		var c = msg.content.split(" ")
		var args = c.splice((msg.content.substring(0,prefix2.length) == prefix2 ? 2 : 1 || (0,prefix3.length) == prefix3 ? 2 : 1),c.length).join(" ")
		var cmd = c[0]
		if(msg.content.substring(0,prefix2.length) == prefix2  || (0,prefix2.length) == prefix3) cmd=c.splice(0,2).join(" ");

		let hasRan = false;

		for(item in cmds){
			if(cmds[item].aliases.length > 0){
				for(n in cmds[item].aliases){
					if(cmd == prefix+cmds[item].aliases[n] || cmd == prefix2+" "+cmds[item].aliases[n] || cmd == prefix3+" "+cmds[item].aliases[n] || cmd == prefix+cmds[item].name || cmd == prefix3+" "+cmds[item].name || cmd == prefix2+" "+cmds[item].name){
						if(hasRan == true) return;
						try{
							cmds[item].func(msg,args)
						}catch(e){
							msg.channel.createMessage(emoji.get("warning")+" An error occured:\n```\n"+e+"\n```")
						}
						hasRan = true
					}
				}
			}else if(cmd == prefix+cmds[item].name || cmd == prefix3+" "+cmds[item].name || cmd == prefix2+" "+cmds[item].name){
					if(hasRan == true) return;
					try{
						cmds[item].func(msg,args)
					}catch(e){
						msg.channel.createMessage(emoji.get("warning")+" An error occured:\n```\n"+e+"\n```")
					}
					hasRan = true
				}
		}

		if(isOwner(msg) && msg.content == prefix+"incaseofemergency"){
			bot.createMessage(msg.channel.id,emoji.get(":ok_hand:"))
			setTimeout(process.exit,1000)
		}
	}
});

setInterval(() => {
    //Reads avatar directory and randomly picks an avatar to switch to
    fs.readdir(`${__dirname}/avatars`, (err, files) => {
        if (err) utils.fileLog(err)
        else {
            var avatar = files[~~(Math.random() * (files.length))];
            //Reads the avatar image file and changes the bots avatar to it
            fs.readFile(`${__dirname}/avatars/${avatar}`, (err, image) => {
                if (err) utils.fileLog(err)
                else {
                    bot.editSelf({
                        avatar: `data:image/jpg;base64,${image.toString('base64')}`
                    }).then(() => console.log('Changed avatar to ' + avatar)).catch(err => utils.fileLog(err));
                }
            })
        }
    });
}, 7.2e+6);

bot.connect();
