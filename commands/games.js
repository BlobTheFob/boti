var yuno = global.yuno
var emoji = require("node-emoji")

var semoji = [
	":cherries:",
	":spades:",
	":lemon:",
	":diamonds:",
	":seven:",
	":clubs:",
	":apple:",
	":eyes:",
	":hearts:",
	":money_with_wings:"
]

yuno.addCommand("slots","A slot machine with no reward.",function(msg,args){
	var res = ":regional_indicator_s:\u200b:regional_indicator_l::regional_indicator_o::regional_indicator_t::regional_indicator_s:\n:black_large_square::white_large_square::black_large_square::white_large_square::black_large_square:"

	var s = [
		[],
		[],
		[]
	]
	for(i=0;i<3;i++){
		var rnd = Math.floor(Math.random()*semoji.length)
		s[i] = []
		s[i][0] = rnd==0 ? semoji[semoji.length-1] : semoji[rnd-1]
		s[i][1] = semoji[rnd]
		s[i][2] = rnd==semoji.length-1 ? semoji[0] : semoji[rnd+1]
	}
	res+="\n:white_large_square:"+s[0][0]+s[1][0]+s[2][0]+":white_large_square:"
	res+="\n:arrow_forward:"+s[0][1]+s[1][1]+s[2][1]+":arrow_backward:"
	res+="\n:white_large_square:"+s[0][2]+s[1][2]+s[2][2]+":white_large_square:"
	res+="\n:black_large_square::white_large_square::black_large_square::white_large_square::black_large_square:"
	res=res.replace("\ufe0f","")
	if(s[0][1] == s[1][1] && s[1][1] == s[2][1]){
		res+="\n\nYou won!"
	}else{
		res+="\n\nSorry, you lost."
	}
	msg.channel.createMessage(emoji.emojify(res))
})
