var yuno = global.yuno
var emoji = require("node-emoji")
var request = require('request')
var xml2js = require("xml2js")

yuno.addCommand("ychan","USAGE: $chan loli ass <those are the tags.",function(msg,args){
		let tags = [];
		if(args) tags = JSON.parse(JSON.stringify(args.split(" ")));

		let tagss = "";
		for(t in tags){
			tagss+=tags[t]+"%20"
		}
    var site = "http://safebooru.org/index.php?page=dapi&s=post&q=index&limit=75&tags="
		//request.get("http://konachan.net/post.xml?limit=19&tags="+tagss+"%20rating:safe",{headers:{"User-Agent":"YunoChan/8.0 (Yuno)"}},function(e,res,body){
      request.get("http://safebooru.org/index.php?page=dapi&s=post&q=index&limit=75&tags="+tagss+"%20rating:safe",{headers:{"User-Agent":"YunoChan/8.0 (Yuno)"}},function(e,res,body){
      if(!e && res.statusCode == 200){
				let data;
				xml2js.parseString(body,(err,d)=>{data=d})
				if(data.posts.post){
				let post = data.posts.post[Math.floor(Math.random()*data.posts.post.length)].$
				msg.channel.createMessage({embed:{
					color:3447003,
					author: {
					name: yuno.bot.user.username,
					icon_url: yuno.bot.user.avatarURL
					},
					description:"**Score**: "+post.score+"\n**Rating**: "+post.rating+"\n**Tags**: \n```"+post.tags+"```",
					fields:[
						//{value:"**Score**: "+post.score+" | **Rating**: "+post.rating+" | **Tags**: \n```"+post.tags+"```"},
						{name:"Image",value:"[Full Sized]("+encodeURI(post.file_url)+")"}
					],
					image:{
						url:"http:"+post.sample_url
					}
					//yuno.bot.user.startTyping()
				}})
				}else{
					//yuno.bot.user.stopTyping(),
					msg.channel.createMessage("Nothing found. Try using _ for multi word tags as space seperates tags.")
				}
			}
		})
},["chan"])

let blacklist = ["-comic","-cleavage","-bikini","-naked","-naked_towel","-underwear","-briefs","-blood","-fat","-animatronic"]
yuno.addCommand("kawaii","Gets a random image of a foxgirl",function(msg,args){
	request.get("https://ibsear.ch/api/v1/images.json?q=foxgirl%20"+blacklist.join("%20")+"&limit=75&shuffle=20",function(err,res,body){
		if(!err && res.statusCode == 200){
			let data = JSON.parse(body);
			let img = data[Math.floor(Math.random()*data.length)]

			msg.channel.createMessage({content:"awuuuu~",embed:{
				description:"```"+img.tags+"```",
				image:{
					url:"https://"+img.server+".ibsear.ch/"+img.path
				}
			}})
		}else{
			msg.channel.createMessage("An error occured, try again later.")
		}
	});
},["awuuuu"]);
