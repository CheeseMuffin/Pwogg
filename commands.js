/**
 * Commands
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * This file contains the base commands for Cassius.
 *
 * @license MIT license
 */

'use strict';

function getLB(word) {
	word = Tools.toId(word);
	if (word === 'scrabble') {
		return scrabblelb;
	} else if (word === 'scrabmons' || word === 'scrabmon' || word === 'scrabblemons') {
		return scrabmonlb;
	} else {
		return false;
	}
}
/**@type {{[k: string]: Command | string}} */
let commands = {
	// Developer commands
	js: 'eval',
	eval: function (target, room, user) {
		if (!user.isDeveloper()) return;
		try {
			target = eval(target);
			this.say(JSON.stringify(target));
		} catch (e) {
			this.say(e.name + ": " + e.message);
		}
	},

    testroom: function (target, room, user) {
        if (!user.isDeveloper()) return;
        Rooms.get("scrabble").say("/makegroupchat test");
        user.say("Join <<groupchat-scrabblee-test>>!");
    },

	// Informational commands
	about: function (target, room, user) {
		if (room !== user && !user.canUseBasicCommands(room)) return;
		room.say(Config.username + " code by sirDonovan: https://github.com/sirDonovan/Cassius");
	},

	beep: function (target, room, user) {
		if (room !== user && !user.canUseBasicCommands(room)) return;
		room.say("boop");
	},
	
	hug: function (target, room, user) {
		if (room !== user && !user.canUseBasicCommands(room)) return;
		room.say("/me hugs " + target);
	},
	
	intro: function (target, room, user) {
		if (!user.canUseBasicCommands(room)) return
		room.say("/addhtmlbox <div>Welcome to Scrabble!<li> <a href='http://scrabble-ps.weebly.com'>PS Scrabble Website</a></li> <li><a href='https://en.crosswordsarena.com/'>Play Scrabble!</a></li></ul></div>");
	},
	
	roomdesc: function (target, room, user) {
		if (!user.canUseBasicCommands(room)) return;
		room.say("/addhtmlbox <div>Play Scrabble with friends, join Scrabble tournaments, and compete in the exciting new Scrabblemons metagame!</div>");
	},
	
	nt: function (target, room, user) {
		if (!user.canUseBasicCommands(room)) return;
		room.say("this is why I don't play with timer.");
	},

	timer: function (target, room, user) {
		if (!user.canUseBasicCommands(room) || room === user) return;
		target = Tools.toId(target);
		if (room.timer) {
			if (target === 'end' || target === 'stop') {
				clearTimeout(room.timer);
				room.timer = null;
				return room.say("The timer has been ended.");
			} else {
				return room.say("There is already a timer running in this room.");
			}
		}

		let time = parseFloat(target);
		if (!time || time > 600) return room.say("The timer must be between 11 seconds and 10 minutes.");
		if (time < 11) time *= 60;
		let minutes = Math.floor(time / 60);
		let seconds = time % 60;
		room.timer = setTimeout(() => room.sayTimeUp(), time * 1000);
		room.say("Timer set for " + (minutes > 0 ? ((minutes) + " minute" + (minutes > 1 ? "s" : "")) + (seconds > 0 ? " and " : "") : "") + (seconds > 0 ? ((seconds) + " second" + (seconds > 1 ? "s" : "")) : "") + ".");
	},
	
	dab: function (target, room, user) {
		if (room.id !== 'scrabble' && !user.canUseBasicCommands(room)) return;
		room.say("/me dabs");
	},
	
	git: function (target, room, user) {
		if (room !== user && !user.canUseBasicCommands(room)) return;
		room.say("https://github.com/CheeseMuffin/Pwogg");
	},

	scrabmonstour: function (target, room, user) {
		if (room.id !== 'scrabble' || !user.canUseBasicCommands(room)) return;
		room.say('/tour create gen 7 ' + target + ' , elimination');
		room.say('/tour name Scrabblemons ' + target);
	},
   
	tour: function (target, room, user) {
		if (room.id !== 'scrabble' || !user.canUseBasicCommands(room)) return;
		target = target.split(',');
		switch (Tools.toId(target[0])) {
			case 'official':
				if (!target[1]) return room.say('You need specify a tier!');
				room.say('/tour create gen 7 ' + target[1] + ' , elimination');
        			room.say('/tour name Scrabblemons ' + target[1] + ' Official');
				room.say("/wall Hosting a scrabgame of Official Scrabblemons Tour! Click the join button to participate! Check http://scrabble-ps.weebly.com/scrabble-mons-guide.html if you don't know how to play!");
			break;
			case 'start':
				room.say('/tour start');
				room.say('/wall Good luck to everyone!');
			break;
			case 'end':
				room.say('/tour end');
			break;
			default:
				room.say('Usage: .tour official/start/end, [tier]');
			break;
		}
    	},

 	scrabtour: function (target, room, user) {
		if (room.id !== 'scrabble' || !user.canUseBasicCommands(room)) return;
        	room.say('/wall Hosting a scrabgame of Official Scrabble Tour! It will be ran through challonge and the host will post a link after signups are closed! Do /me in to join!')
	},

	scrabword: 'scrabwords',
	scrabwords: function (target, room, user) {
		if (room !== user && !user.canUseBasicCommands(room)) return;
		let num = parseInt(target);
		if (!num || num < 1) num = 1;
		if (num === 1) {
			room.say(Tools.sample(Tools.data.words.sixletter));
		} else if (num === 2) {
			room.say(Tools.sample(Tools.data.words.sixletter, 2).join(", "));
		} else {
			let first = Tools.sample(Tools.data.words.sixletter, num - 1);
			room.say(first.join(", ") + " and " + Tools.sample(Tools.data.words.sixletter));
		}
	},
	
	scrabword1v1: 'scrabwords1v1',
	scrabwords1v1: function (target, room, user) {
		if (room !== user && !user.canUseBasicCommands(room)) return;
		let num = parseInt(target);
		if (!num || num < 1) num = 1;
		if (num === 1) {
			room.say(Tools.sample(Tools.data.words.threeletter));
		} else if (num === 2) {
			room.say(Tools.sample(Tools.data.words.threeletter, 2).join(", "));
		} else {
			let first = Tools.sample(Tools.data.words.threeletter, num - 1);
			room.say(first.join(", ") + " and " + Tools.sample(Tools.data.words.threeletter));
		}
	},

	answer: function (target, room, user) {
		if (room !== user && !user.canUseBasicCommands(room)) return;
		let aa = ["No", "Dont touch me", "Yes!", "Please try again later", "Probably", "/me does a barrel roll", "Pw-ogg has obliterated your question using a potato chip and a pair of dice. try again later", "can you not", "soon™", "Yes ma'am", "/me grinds question into a pulp", "i mean yeah i guess", "chances are that is a no", "no, try a healthy dose of Pw-ogg™ instead!"];
		room.say(Tools.sample(aa));
	},
	
	check: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		if (scrabwords.indexOf(Tools.toId(target).toUpperCase()) !== -1) { 
      this.say("__**" + Tools.toId(target) + "**__ is a valid word!"); 
    }
		else {
			room.say("__**" + Tools.toId(target) + "**__ is NOT a valid word!");
		}
	},
	
	signups: 'creategame',
	creategame: function (target, room, user) {
		if (!user.canUseBasicCommands(room)) return;
		if (!Config.games || !Config.games.includes(room.id)) return this.say("Games are not enabled for this room.");
		if (!Games.createGame(target, room)) return;
		room.game.signups();
	},

	scrabblegame: function (target, room, user) {
		if (!user.hasRank(Rooms.get('scrabble'), '+')) return;
		let i = 1;
		while (Rooms.get("groupchat-scrabblee-scrabble" + i)) {
			i += 1;
		}
		global.awaitingscrab = true;
		global.scrabroom = room;
		global.notimer = !!(["notimer", "nt"].indexOf(Tools.toId(target)) !== -1);
		Rooms.get('scrabble').say("/subroomgroupchat scrabble" + i);
	},

	games: function (target, room, user) {
		if (!user.hasRank(Rooms.get('scrabble'), '%')) return;
		let scrabrooms = [];
		for (let roomid in Rooms.rooms) {
			let room = Rooms.get(roomid);
			if (room.id.startsWith('groupchat')) scrabrooms.push("<<" + room.id + ">>");
		}
		if (scrabrooms.length === 0) {
			return room.say("No games of scrabble are in progress.");
		} else {
			return room.say("Current Scrabble games: " + scrabrooms.join(", "));
		}
	},

	start: 'startgame',
	startgame: function (target, room, user) {
		if (!room.game || !user.canUseBasicCommands(room)) return;
		room.game.start();
	},

	end: 'endgame',
	endgame: function (target, room, user) {
		if (!room.game || !user.canUseBasicCommands(room)) return;
		room.game.forceEnd();
	},

	join: 'joingame',
	joingame: function (target, room, user) {
		if (!room.game) return;
		room.game.join(user);
	},

	leave: 'leavegame',
	leavegame: function (target, room, user) {
		if (!room.game) return;
		room.game.leave(user);
	},

	dq: function (target, room, user) {
		if (!user.hasRank(room, '%') || !room.game) return;
		room.game.dq(target);
	},

	//memes
	topaz: function (target, room, user) {
		if (!user.canUseBasicCommands(room)) return;
		room.say("!dt Excadrill");
	},
	
	pants: 'aphantom',
	aphantom: function (target, room, user) {
		if (room.id !== 'scrabble' || !user.canUseBasicCommands(room)) return;
		room.say("/me puts on pants");
	},
	
	spook: function (target, room, user) {
		if (room.id !== 'scrabble' || !user.canUseBasicCommands(room)) return;
		room.say("!dt Heatmor");
	},
	
	snap: function (target, room, user) {
		if (!user.canUseBasicCommands(room)) return;
		room.say("/me snaps");
	},
	dsg: function (target, room, user) {
		if (!user.canUseBasicCommands(room)) return;
		room.say("!dt Giratina-Origin");
	},
	zyg: 'strat',
	strat: function (target, room, user) {
		if (room.id !== 'scrabble' || !user.canUseBasicCommands(room)) return;
		room.say("!dt Zygarde-10%");
	},
	sty: function (target, room, user) {
		if (room.id !== 'scrabble' || !user.canUseBasicCommands(room)) return;
		room.say("!dt Mawile");
	},
	jen: function (target, room, user) {
		if (room.id !== 'scrabble' || !user.canUseBasicCommands(room)) return;
		room.say("!dt Glameow");
	},
	moo: function (target, room, user) {
		if (room.id !== 'scrabble' || !user.canUseBasicCommands(room)) return;
		room.say("!dt Miltank");
	},
	swag: function (target, room, user) {
		if (!user.canUseBasicCommands(room)) return;
		room.say("!dt Black Glasses");
	},
	crit: function (target, room, user) {
		if (room.id !== 'scrabble' || !user.canUseBasicCommands(room)) return;
		room.say("life could be a meme♪");
	},
	pun: function (target, room, user) {
		if (room !== user && !user.canUseBasicCommands(room)) return;
		let ew = ["What do you call the security outside of a Samsung Store? Guardians of the Galaxy.", "Did you hear about the guy who got hit in the head with a can of soda? He was lucky it was a soft drink.", "Don't spell part backwards. It's a trap.", "I can't believe I got fired from the calendar factory. All I did was take a day off.", "I have a few jokes about unemployed people but it doesn't matter none of them work.", "I'm reading a book about anti-gravity. It's impossible to put down.", "I wasn't originally going to get a brain transplant, but then I changed my mind.", "Why was Cinderella thrown off the basketball team? She ran away from the ball.", "How did I escape Iraq? Iran.", "I'd tell you a chemistry joke but I know I wouldn't get a reaction.", "eBay is so useless. I tried to look up lighters and all they had was 13,749 matches.", "A friend of mine tried to annoy me with bird puns, but I soon realized that toucan play at that game.", "A courtroom artist was arrested today for an unknown reason... details are sketchy.", "I'm glad I know sign language, it's pretty handy.", "What do you have to do to have a party in space? You have to Planet.", "I was addicted to the hokey pokey... but thankfully, I turned myself around.", "Thieves had broken into my house and stolen everything except my soap, shower gel, towels and deodorant. Dirty Bastards.", "I am on a seafood diet. Every time I see food, I eat it.", "I'm emotionally constipated. I haven't given a shit in days.", "I wear two pairs of pants when I go golfing. People always ask me why I do. I say, I wear two pants when's I golf just in case I get a hole-in-one.", "I wear two pairs of pants when I go golfing. People always ask me why I do. I say, 'I wear two pants when's I golf just in case I get a hole-in-one.'", "Why did the scientist install a knocker on his door? He wanted to win the No-bell prize!", "What do you call an academically successful slice of bread? An honor roll.", "What do you call a cow with no legs? Ground beef.", "My first job was working in an orange juice factory, but I got canned because I couldn't concentrate.", "Claustrophobic people are more productive thinking out of the box.", "A book just fell on my head. I've only got myshelf to blame.", "My mate broke his left arm and left leg, but he was alright.", "What was Forrest Gump's email password? '1forrest1'", "I wanna make a joke about sodium, but Na..", "I hate insects puns, they really bug me.", "I used to be a banker, but then I lost interest.", "What do you call Watson when Sherlock isn't around? Holmeless.", "Did you hear about the Italian chef with a terminal illness? He pastaway.", "I relish the fact that you have mustard the strength to ketchup to me.", "What do prisoners use to call each other? Cell phones.", "If my puns are cheesy, then they would go well with crackers.", "I am so poor I cannot even pay attention.", "I found a rock yesterday which measured 1760 yards in length. Must be some kind of milestone.", "My math teacher called me average. How mean!", "What did one ocean say to the other ocean? Nothing, they just waved.", "I saw an ad for burial plots, and thought to myself this is the last thing I need.", "I've just written a song about tortillas - actually, it's more of a rap.", "Why is Peter Pan always flying? He neverlands.", "Why didn't the skeleton go to prom? Cause he had no body to dance with.", "What do you call people who are afraid of Santa Claus? Claustrophobic", "Atheism is a non-prophet organization.", "Why don't cannibals eat clowns? They taste funny.", "Why did the bee get married? Because he found his honey.", "Why couldn't the bike stand up on it's own? It was two tired.", "A bus station is where a bus stops. A train station is where a train stops. On my desk, I have a work station..", "Get stoned. Drink wet cement.", "If there was someone selling drugs in this place, weed know.", "Which day do chickens hate the most? Friday.", "Last time I got caught stealing a calendar I got 12 months.", "Did you hear about these new reversible jackets? I am excited to see how they turn out.", "A hole was found in the wall of a nudist camp. The police are looking into it.", "My computer has got Miley Virus. It has stopped twerking.", "What do you call a dictionary on drugs? HIGH-Definition.", "What do sea monsters eat for lunch? Fish and ships.", "The future, the present and the past walked into a bar. Things got a little tense.", "I put the 'fun' in dysfunctional.", "Do you know why I make puns? Because it's my respunsibility.", "Fishermen are reel men.", "If anything is possible, is it possible for something to be impossible?", "For Sale: Parachute. Only used once, never opened.", "Did you hear about the guy who choked on a pretzel? He was very salty.", "What did the tree say to autumn? Leaf me alone.", "A Roman fighter consumed his wife. He said he was glad 'e ate 'er", "What do you call a owl that does magic tricks? Hoodini.", "It's hard to explain puns to kleptomaniacs because they always take things literally.", "A garage sale is actually a Garbage sale but the 'b' is silent.", "What is the difference between a poorly dressed man on a bicycle and a nicely dressed man on a tricycle? A tire.", "Your gene pool could use a little chlorine.", "What do ghosts serve for dessert? I Scream.", "What tea do hockey players drink? Penaltea!", "I wanted to make a joke about criminals, but I was scared it would get stolen.", "Why does the bike not stand by itself? Because it is two tired.", "Do skunks celebrate Valentines Day? Sure, they're very scent-imental!", "On the other hand, you have different fingers.", "No matter how much you push the envelope, it'll still be stationery.", "This morning some clown opened the door for me. I thought to myself that's a nice Jester.", "Why did the chicken cross the road? Because KFC was on the other side.", "STRESSED is just DESSERTS spelled backward.", "What if there were no hypothetical questions?", "Television is a medium because anything well done is rare.", "What do you get when you cross a joke with a rhetorical question?", "You know those people using bibles on their phones? They are using phony bibles.", "Where do you find a birthday present for a cat? In a cat-alogue!", "In democracy, it is your vote that counts. In feudalism, it is your count that votes.", "A donkey fell into a bowl of sugar. Now that's a sweet ass.", "What's the difference between a guitar and a fish? You can't tuna fish!", "I asked my friend for a sharpened pencil, but he didn't have one. I always knew he was a little dull", "How do you get Pikachu onto the bus? You Pokemon.", "What nationality is Santa Claus? North Polish" , "I would tell a swimming joke, but I think it's too watered-down to be funny.", "Lately I've been trying to touch my toes, which I don't find so complicated, but my knees just can't get it straight.", "What did Zelda tell Link when he couldn't open the door? TRIFORCE!", ];
		room.say(Tools.sample(ew));
	},
	
	randtier: function (target, room, user) {
		if (room !== user && !user.canUseBasicCommands(room)) return;
		let waaw = ["Ubers", "OU", "UU", "RU", "NU", "AG", "MnM", "CAP"];
		room.say(Tools.sample(waaw));
	},

	//leaderboard commands 
	firsts: 'first',
	first: function (target, room, user) {
		if (!target) return;
		if (!user.hasRank(Rooms.get('scrabble'), '+')) return;
		let split = target.split(",");
		if (split.length < 2) {
			return room.say("You must specify the leaderboard you are adding to");
		}
		let dd = getLB(split[0]);
		if (!dd) {
			return room.say("The valid leaderboards are Scrabble and Scrabblemons");
		}
		target = split.slice().splice(1).join(",");
		dd.addFirst(target);
		room.say("First place points awarded to **" + target.trim() + "** on the " + dd.name + " leaderboard.");
	},

	seconds: 'second',
	second: function (target, room, user) {
		if (!target) return;
		if (!user.hasRank(Rooms.get('scrabble'), '+')) return;
		let split = target.split(",");
		if (split.length < 2) {
			return room.say("You must specify the leaderboard you are adding to");
		}
		let dd = getLB(split[0]);
		if (!dd) {
			return room.say("The valid leaderboards are Scrabble and Scrabblemons");
		}
		target = split.slice().splice(1).join(",");
		dd.addSecond(target);
		room.say("Second place points awarded to **" + target.trim() + "** on the " + dd.name + " leaderboard.");	
	},

	part: 'participation',
	parts: 'participation',
	participation: function (target, room, user) {
		if (!target) return;
		if (!user.hasRank(Rooms.get('scrabble'), '+')) return;
		let split = target.split(",");
		if (split.length < 2) {
			return room.say("You must specify the leaderboard you are adding to");
		}
		let dd = getLB(split[0]);
		if (!dd) {
			return room.say("The valid leaderboards are Scrabble and Scrabblemons");
		}
		split = split.splice(1);
		for (let i = 0; i < split.length; i++) {
			split[i] = split[i].trim();
		}
		for (let i = 0; i < split.length; i++) {
			dd.addPart(split[i]);
		}
		let msg = "Participation points awarded to: **" + split.join(", ") + "** on the " + dd.name + " leaderboard.";
		room.say(msg);
	},

	rmfirst: 'removefirst',
	removefirst: function (target, room, user) {
		if (!target) return;
		if (!user.hasRank(Rooms.get('scrabble'), '+')) return;
		let split = target.split(",");
		if (split.length < 2) {
			return room.say("You must specify the leaderboard you are removing from");
		}
		let dd = getLB(split[0]);
		if (!dd) {
			return room.say("The valid leaderboards are Scrabble and Scrabblemons");
		}
		target = split.slice().splice(1).join(",");
		if (dd.removeFirst(target)) {
			room.say("First place removed from: **" + target + "** on the " + dd.name + " leaderboard.");
		} else {
			room.say("**" + target + "** has never won a game on the " + dd.name + " leaderboard.!");
		}
	},
	
	rmsecond: 'removesecond',
	removesecond: function (target, room, user) {
		if (!target) return;
		if (!user.hasRank(Rooms.get('scrabble'), '+')) return;
		let split = target.split(",");
		if (split.length < 2) {
			return room.say("You must specify the leaderboard you are removing from");
		}
		let dd = getLB(split[0]);
		if (!dd) {
			return room.say("The valid leaderboards are Scrabble and Scrabblemons");
		}
		target = split.slice().splice(1).join(",");
		if (dd.removeSecond(target)) {
			room.say("Second place removed from: **" + target + "** on the " + dd.name + " leaderboard.");
		} else {
			room.say("**" + target + "** has never placed second on the " + dd.name + " leaderboard.!");
		}
	},

	rmthird: 'removethird',
	removethird: function (target, room, user) {
		if (!target) return;
		if (!user.hasRank(Rooms.get('scrabble'), '+')) return;
		let split = target.split(",");
		if (split.length < 2) {
			return room.say("You must specify the leaderboard you are removing from");
		}
		let dd = getLB(split[0]);
		if (!dd) {
			return room.say("The valid leaderboards are Scrabble and Scrabblemons");
		}
		if (dd.name !== "Scrabble") {
			return room.say("You can only remove third places from the Scrabble leaderboard.");
		}
		target = split.slice().splice(1).join(",");
		if (dd.removeThird(target)) {
			room.say("Third place removed from: **" + target + "** on the " + dd.name + " leaderboard.");
		} else {
			room.say("**" + target + "** has never placed third on the " + dd.name + " leaderboard.!");
		}
	},

	rmtop: 'removetop',
	removetop: function (target, room, user) {
		if (!target) return;
		if (!user.hasRank(Rooms.get('scrabble'), '+')) return;
		let split = target.split(",");
		if (split.length < 2) {
			return room.say("You must specify the leaderboard you are removing from");
		}
		let dd = getLB(split[0]);
		if (!dd) {
			return room.say("The valid leaderboards are Scrabble and Scrabblemons");
		}
		if (dd.name !== "Scrabble") {
			return room.say("You can only remove top points from the Scrabble leaderboard.");
		}
		target = split.slice().splice(1).join(",");
		if (dd.removeTop(target)) {
			room.say("Top points removed from: **" + target + "** on the " + dd.name + " leaderboard.");
		} else {
			room.say("**" + target + "** has never placed third on the " + dd.name + " leaderboard.!");
		}
	},

	removeparts: 'removepart',
	removeparticipation: 'removepart',
	rmpart: 'removepart',
	rmparts: 'removepart',
	removepart: function (target, room, user) {
		if (!target) return;
		if (!user.hasRank(Rooms.get('scrabble'), '+')) return;
		let split = target.split(",");
		if (split.length < 2) {
			return room.say("You must specify the leaderboard you are removing from");
		}
		let dd = getLB(split[0]);
		if (!dd) {
			return room.say("The valid leaderboards are Scrabble and Scrabblemons");
		}
		split = split.splice(1);
		let good = [];
		let bad = [];
		for (let i = 0; i < split.length; i++) {
			let name = split[i];
			if (dd.removePart(name)) {
				good.push(name);
			} else {
				bad.push(name);
			}
		}
		if (good.length > 0 && bad.length > 0) {
			room.say("Participations removed from: **" + good.join(", ") + "**. I was unable to remove participation from **" + bad.join(", ") + "** on the " + dd.name + " leaderboard.");
		} else if (good.length > 0) {
			room.say("Participations removed from: **" + good.join(", ") + "** on the " + dd.name + " leaderboard.");
		} else {
			room.say("I was unable to remove participations from **" + bad.join(", ") + "** on the " + dd.name + " leaderboard.");
		}
	},

	top: function (target, room, user) {
		if (!user.canUseBasicCommands(room) && room !== user) return;
		let split = target.split(",");
		if (split.length < 1) {
			return user.say("You must specify the lb you are looking at.");
		}
		let lb = getLB(split[0]);
		if (!lb) {
			return user.say("Invalid leaderboard specified.");
		}
		let num = parseInt(split[1]);
		if (!num) num = 5;
		let sorted = lb.getSorted();
		if (num > sorted.length) num = sorted.length;
		if (room === user) {
			let str = "<div class = \"infobox\"><html><body><table align=\"center\" border=\"2\"><tr>";
			let indices = ["Rank", "Name", "Points"];
			for (let i = 0; i < indices.length; i++) {
				str +=  "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + indices[i] + "</font></b></td>";
			}
			str += "</tr>"
			let strs = [];
			for (let i = Math.max(0, num - 5); i < num; i++) {
				let strx = "<tr>";
				for (let j = 0; j < 3; j++) {
					let stuff;
					if (j === 0) stuff = i + 1;
					else if (j === 1) stuff = sorted[i][lb.getNameIndex()];
					else stuff = lb.getPoints(sorted[i]);
					strx += "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + stuff + "</font></b></td>";
				}
				strs.push(strx + "</tr>");
			}
			str += strs.join("");
			str += "</table></body></html></div>";	
			Rooms.get('scrabble').say('/pminfobox ' + user.id + ", " + str);
		} else {
			let str = lb.getStr(num);
			if (room.id === 'scrabble') {
				room.say("/addhtmlbox " + str);
			} else {
				room.say("!htmlbox " + str);
			}
		}
	},

	points: function (target, room, user) {
		if (room !== user) return;
		let targetName = target || user.name;
		let targetID = Tools.toId(targetName);
		let scrabbleLB = scrabblelb.getSorted();
		let scrabmonslb = scrabmonlb.getSorted();
		let str = "", i;
		for (i = 0; i < scrabbleLB.length; i++) {
			if (Tools.toId(scrabbleLB[i][3]) === targetID) break;
		}
		if (i !== scrabbleLB.length) {
			user.say("**" + scrabbleLB[i][3] + "** is #" + (i + 1) + " on the Scrabble leaderboard with " + scrabbleLB[i][0] + " first place finishes, " + scrabbleLB[i][1] + " second place finishes, and " + scrabbleLB[i][2] + " participations.");
		} else {
			user.say("**" + targetName + "** does not have any points on the Scrabble leaderboard.");
		}
		for (i = 0; i < scrabmonslb.length; i++) {
			if (Tools.toId(scrabmonslb[i][3]) === targetID) break;
		}
		if (i !== scrabmonslb.length) {
			user.say("**" + scrabmonslb[i][3] + "** is #" + (i + 1) + " on the Scrabblemons leaderboard with " + scrabmonslb[i][0] + " first place finishes, " + scrabmonslb[i][1] + " second place finishes, and " + scrabmonslb[i][2] + " participations.");
		} else {
			user.say("**" + targetName + "** does not have any points on the Scrabblemons leaderboard.");
		}
	},

	resetlb: function (target, room, user) {
		if (room !== user || !user.hasRank(Rooms.get('scrabble'), '#')) return;
		scrabblelb.lb = {};
		scrabmonlb.lb = {};
		scrabblelb.exportData();
		scrabmonlb.exportData();
		return user.say("Scrabble and Scrabblemons leaderboards have been reset.");
	},

	// ratings
    toprating: 'topratings',
	topratings: function (target, room, user) {
		if (!user.canUseBasicCommands(room) && room !== user) return;
		let str = "<div style=\"overflow-y: scroll; max-height: 250px;\"><div class = \"infobox\"><html><body><table align=\"center\" border=\"2\"><tr>";
		let indices = ["Name", "Rating"];
		for (let i = 0; i < indices.length; i++) {
			str +=  "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + indices[i] + "</font></b></td>";
		}
		str += "</tr>"
		let sorted = Ratings.getSorted();
		let strs = [];
		for (let info of sorted) {
			let strx = "<tr>";
			for (let data of info) {
				strx += "<td style=background-color:#FFFFFF; height=\"30px\"; align=\"center\"><b><font color=\"black\">" + data + "</font></b></td>";
			}
			strs.push(strx + "</tr>");
		}
		str += strs.join("");
		str += "</table></body></html></div></div>";
		if (room === user) {
			Rooms.get('scrabble').say('/pminfobox ' + user.id + ", " + str);
		} else {
			this.say("/addhtmlbox " + str);
		}
	},

	rating: 'myrating',
	myrating: function (target, room, user) {
		if (room !== user) return;
		let targetID = target ? Tools.toId(target) : Tools.toId(user.id);
		if (!(targetID in Ratings.ratings)) return user.say("**" + targetID + "** does not have a rating.");
		user.say("**" + targetID + "** currently has a Scrabble rating of **" + Ratings.ratings[targetID][0] + "**!");
	}
};

module.exports = commands;
