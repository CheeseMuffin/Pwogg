'use strict';

const Room = require('../rooms').Room; // eslint-disable-line no-unused-vars
const User = require('../users').User; // eslint-disable-line no-unused-vars
const Player = require('../games').Player;
const letters = {
    a: 9,
    b: 2,
    c: 2,
    d: 4,
    e: 12,
    f: 2,
    g: 3,
    h: 2,
    i: 9,
    j: 1,
    k: 1,
    l: 4,
    m: 2,
    n: 6,
    o: 8,
    p: 2,
    q: 1,
    r: 6,
    s: 4,
    t: 6,
    u: 4,
    v: 2,
    w: 2,
    x: 1,
    y: 2,
    z: 1,
    " ": 2,
};

const charpoints = {
    a: 1,
    b: 3,
    c: 3,
    d: 2,
    e: 1,
    f: 4,
    g: 2,
    h: 4,
    i: 1,
    j: 8,
    k: 5,
    l: 1,
    m: 3,
    n: 1,
    o: 1,
    p: 3,
    q: 10,
    r: 1,
    s: 1,
    t: 1,
    u: 1,
    v: 4,
    w: 4,
    x: 8,
    y: 4,
    z: 10,
    " ": 0,
};

const colors = {
    DL: "#C0D5D0",
    TL: "#489AAB",
    DW: "#F8B7A2",
    "★": "#F8B7A2",
    TW: "#FF6251",
    "-": "#CCC5A8",
}

/**
 * @param {string} tile
 */
function getColor(tile) {
    if (tile in colors) {
        return colors[tile];
    }
    return "#CCC5A8";
}

const name = "Scrabble";
const id = Tools.toId(name);

// @ts-ignore
class Scrabble extends Games.Game {
	/**
	 * @param {Room} room
	 */
    constructor(room) {
		super(room);
		/** @type {string[]} */
		this.tiles = [];
		/**@type {?NodeJS.Timer} */
		this.timeout = null;
        for (let letter in letters) {
            let num = letters[letter];
            for (let i = 0; i < num; i++) {
                this.tiles.push(letter.toUpperCase());
            }
        }
		this.tiles = Tools.shuffle(this.tiles);
		//this.tiles = [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "];
		//this.tiles = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"];
		/** @type {string[][]} */
        this.board = [["TW", "-", "-", "DL", "-", "-", "-", "TW", "-", "-", "-", "DL", "-", "-", "TW"],
        ["-", "DW", "-", "-", "-", "TL", "-", "-", "-", "TL", "-", "-", "-", "DW", "-"],
        ["-", "-", "DW", "-", "-", "-",  "DL", "-", "DL", "-", "-", "-", "DW", "-", "-"],
        ["DL", "-", "-", "DW", "-", "-", "-", "DL", "-", "-", "-", "DW", "-", "-", "DL"],
        ["-", "-", "-", "-", "DW", "-", "-", "-", "-", "-", "DW", "-", "-", "-", "-"],
        ["-", "TL", "-", "-", "-", "TL", "-", "-", "-", "TL", "-", "-", "-", "TL", "-"],
        ["-", "-", "DL", "-", "-", "-", "DL", "-", "DL",  "-", "-", "-", "DL", "-", "-"],
        ["TW", "-", "-", "DL", "-", "-", "-", "★", "-", "-", "-", "DL", "-", "-", "TW"],
        ["-", "-", "DL", "-", "-", "-", "DL", "-", "DL",  "-", "-", "-", "DL", "-", "-"],
        ["-", "TL", "-", "-", "-", "TL", "-", "-", "-", "TL", "-", "-", "-", "TL", "-"],
        ["-", "-", "-", "-", "DW", "-", "-", "-", "-", "-", "DW", "-", "-", "-", "-"],
        ["DL", "-", "-", "DW", "-", "-", "-", "DL", "-", "-", "-", "DW", "-", "-", "DL"],
        ["-", "-", "DW", "-", "-", "-",  "DL", "-", "DL", "-", "-", "-", "DW", "-", "-"],
        ["-", "DW", "-", "-", "-", "TL", "-", "-", "-", "TL", "-", "-", "-", "DW", "-"],
        ["TW", "-", "-", "DL", "-", "-", "-", "TW", "-", "-", "-", "DL", "-", "-", "TW"]];

		this.colorboard = [["TW", "-", "-", "DL", "-", "-", "-", "TW", "-", "-", "-", "DL", "-", "-", "TW"],
        ["-", "DW", "-", "-", "-", "TL", "-", "-", "-", "TL", "-", "-", "-", "DW", "-"],
        ["-", "-", "DW", "-", "-", "-",  "DL", "-", "DL", "-", "-", "-", "DW", "-", "-"],
        ["DL", "-", "-", "DW", "-", "-", "-", "DL", "-", "-", "-", "DW", "-", "-", "DL"],
        ["-", "-", "-", "-", "DW", "-", "-", "-", "-", "-", "DW", "-", "-", "-", "-"],
        ["-", "TL", "-", "-", "-", "TL", "-", "-", "-", "TL", "-", "-", "-", "TL", "-"],
        ["-", "-", "DL", "-", "-", "-", "DL", "-", "DL",  "-", "-", "-", "DL", "-", "-"],
        ["TW", "-", "-", "DL", "-", "-", "-", "★", "-", "-", "-", "DL", "-", "-", "TW"],
        ["-", "-", "DL", "-", "-", "-", "DL", "-", "DL",  "-", "-", "-", "DL", "-", "-"],
        ["-", "TL", "-", "-", "-", "TL", "-", "-", "-", "TL", "-", "-", "-", "TL", "-"],
        ["-", "-", "-", "-", "DW", "-", "-", "-", "-", "-", "DW", "-", "-", "-", "-"],
        ["DL", "-", "-", "DW", "-", "-", "-", "DL", "-", "-", "-", "DW", "-", "-", "DL"],
        ["-", "-", "DW", "-", "-", "-",  "DL", "-", "DL", "-", "-", "-", "DW", "-", "-"],
        ["-", "DW", "-", "-", "-", "TL", "-", "-", "-", "TL", "-", "-", "-", "DW", "-"],
        ["TW", "-", "-", "DL", "-", "-", "-", "TW", "-", "-", "-", "DL", "-", "-", "TW"]];
		this.roundTimer = 120;
        this.numRows = this.board.length;
        this.numCols = this.board[0].length;
        this.hands = new Map();
		this.points = new Map();
		this.num = -1;
		this.playerOrder = [];
		this.numTurnsWithoutPlay = 0;
	}

	/**
	 * @param {User} user
	 */
	onLeave(user) {
		if (!this.started) return;
		let player = this.players[user.id];
		let index = this.playerOrder.indexOf(player);
		if (index <= this.num) this.num--;
		this.playerOrder.splice(this.playerOrder.indexOf(player), 1);
		this.points.set(player, 0);
		if (this.getRemainingPlayerCount() === 1) return this.end();
		if (player === this.curPlayer) {
			if (this.timeout) clearTimeout(this.timeout);
			this.nextPlayer();
		}
	}

    onStart() {
		this.say("/modchat +");
		this.say("To check some info about the point values of letters, visit http://www.thewordfinder.com/scrabble-point-values.php/");
		let commandNames = ["play", "pass", "showboard", "scores", "tilesleft", "hand", "rearrange"];
		this.say("Command list: " + commandNames.map(command => "``" + Config.commandCharacter + command  + "``").join(", "));
		for (let userID in this.players) {
			let player = this.players[userID];
			/** @type {string[]} */
            let hand = [];
            for (let i = 0; i < 7; i++) {
				// @ts-ignore
                hand += this.tiles.shift();
            }
			this.points.set(player, 0);
			this.hands.set(player, hand);
            this.sayHand(player);
			if (!(Users.get(userID).hasRank(this.room, '+'))) {
				this.say("/roomvoice " + userID);
			}
        }
		this.playerOrder = Tools.shuffle(Object.values(this.players));
		this.say("/wall The player order for this game is: " + this.playerOrder.map(pl => pl.name).join(", "));
		
		this.timeout = setTimeout(() => this.nextPlayer(), 5 * 1000);
	}

	nextPlayer() {
		if (this.numTurnsWithoutPlay === 4 * this.getRemainingPlayerCount()) {
			this.say("Since the game has gone **" + this.numTurnsWithoutPlay + "** turns without anyone scoring, the game ends!");
			this.end();
			return;
		}
		this.num++;
		if (this.num >= this.playerOrder.length) {
			this.num = 0;
		}
		this.curPlayer = this.playerOrder[this.num];
		this.displayBoard();
		this.canPlay = true;
		this.say("/wall " + this.curPlayer.name + ", you're up! Commands: ``" + Config.commandCharacter + "play [location], right/down, word``, or in PMs, ``" + Config.commandCharacter + "pass [letters]``");
		this.timeout = setTimeout(() => this.remindPlayer(), this.roundTimer * 2 / 3 * 1000);
	}

	remindPlayer() {
		this.say("**" + this.curPlayer.name + "**, you have **" + this.roundTimer * 1 / 3 + "** seconds remaining!");
		this.timeout = setTimeout(() => this.skipPlayer(), this.roundTimer * 1 / 3 * 1000);
	}

	skipPlayer() {
		this.numTurnsWithoutPlay++;
		this.say("**" + this.curPlayer.name + "** didn't play anything!");
		this.curPlayer = null;
		this.timeout = setTimeout(() => this.nextPlayer(), 5 * 1000);
	}

	/**
	 * @param {Player} player
	 */
    sayHand(player) {
		let user = Users.get(player.id);
		if (!user.rooms.has(Rooms.get('scrabble'))) {
			return user.say("Your current hand: " + this.hands.get(player).split("").join(",") + " if you would like it to be formatted better, join <<scrabble>>");
		}
		player.say("Your hand: ");
		let tiles = this.hands.get(player);
		let str = "<div class = \"infobox\"><html><body><table align=\"center\" border=\"2\"><tr>";
		for (let i = 0; i < tiles.length; i++) {
			str += "<td style=background-color:#8b5a2b; height=\"15px\"; width=\"15px\"; align=\"center\"><b><font color=\"black\">" + tiles[i] + "</font></b></td>"
		}
		str += "</tr></table></body></html></div>";
		Rooms.get("scrabble").say("/pminfobox " + player.id + ", " + str);
	}

    displayBoard() {
        let str = "<div class = \"infobox\"><html><body><table align=\"center\" border=\"2\">";
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ★abcdefghijklmnopqrstuvwxyz";
		for (let i = 0; i < this.numRows + 1; i++) {
			str += "<tr>";
			if (i === this.numRows) {
				for (let j = 0; j < this.numCols + 1; j++) {
					if (j == 0) {
						str += "<td width=\"20px\" height=\"20px\" style=background-color:#FFFFFF></td>"
					} else {
						str += "<td width=\"20px\" height=\"20px\" style=background-color:#FFFFFF><font color=\"black\">" + letters[j - 1] + "</font></td>";
					}
				}
			} else {
				for (let j = 0; j < this.numCols + 1; j++) {
					if (j === 0) {
						str += "<td width=\"20px\" height=\"20px\" style=background-color:#FFFFFF><font color=\"black\">" + (this.numRows - i) + "</font></td>";
					} else {
						let tile = this.board[i][j - 1];
						str += "<td style=background-color:" + getColor(this.colorboard[i][j - 1]) + "; width=\"20px\" height=\"20px\"; align=\"center\">" + (letters.indexOf(tile) === -1 ? "" : "<font color=\"black\">" + tile + "</font>") + "</td>";
					}
				}
			}
			str += "</tr>";
		}
		str += "</table></body></html></div>";
		this.say("!htmlbox " + str);
    }

	/**
	 * @param {string} oldLetter
	 * @param {string} newLetter
	 */
	getPoints(oldLetter, newLetter) {
		let points = charpoints[newLetter.toLowerCase()];
		if (newLetter === newLetter.toLowerCase()) {
			points = 0;
		}
		if (oldLetter === newLetter) {
			return [points, 1];
		}
		if (oldLetter === "DL") {
			return [points * 2, 1];
		}
		if (oldLetter === "TL") {
			return [points * 3, 1];
		}
		if (oldLetter === "DW" || oldLetter === "★") {
			return [points, 2];
		}
		if (oldLetter === "TW") {
			return [points, 3];
		}
		return [points, 1];
	}

	copyboard() {
		let board = [];
		for (let i = 0; i < this.board.length; i++) {
			board.push(this.board[i].slice());
		}
		return board;
	}

	/**
	 * 
	 * @param {string} loc 
	 */
	getLoc(loc) {
		/** @type {string | number} */
		let col = loc[0].toUpperCase();
		col = "ABCDEFGHIJKLMNO".indexOf(col);
		let row = parseInt(loc.substr(1))
		row = this.numRows - row;
		return [row, col];
	}

	/**
	 * @param {string[][]} copyboard
	 * @param {Player} player
	 */
	isLegalMove(copyboard, player) {
		if (this.board[7][7] === "★" && copyboard[7][7] === "★") {
			return "Your turn must use the center ★ square.";
		}
		let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		let copyhand = this.hands.get(player).slice();
		for (let i = 0; i < this.numRows; i++) {
			for (let j = 0; j < this.numCols; j++) {
				if (copyboard[i][j] !== this.board[i][j]) {
					if (copyboard[i][j] == this.board[i][j].toUpperCase() && copyboard[i][j] !== this.board[i][j]) {
						copyboard[i][j] = this.board[i][j];
						continue;
					}
					if (letters.indexOf(this.board[i][j]) !== -1) return "You cannot replace one of the tiles on the board.";
					let letter = copyboard[i][j];
					let index = copyhand.indexOf(letter);
					let actindex = index === -1 ? copyhand.indexOf(" ") : index;
					if (actindex === -1) {
						return "That uses a letter at " + letters[j] + (this.numRows - i) + " that you don't have!";
					}
					if (actindex === copyhand.indexOf(" ")) copyboard[i][j] = copyboard[i][j].toLowerCase();
					copyhand = copyhand.slice(0, actindex) + copyhand.slice(actindex + 1);
				}
			}
		}
		let totpoints = 0;
		for (let i = 0; i < this.numRows; i++) {
			for (let j = 0; j < this.numCols; j++) {
				if (letters.indexOf(copyboard[i][j]) !== -1 && copyboard[i][j].length === 1) {
					let isNew = false;
					if (copyboard[i][j] !== this.board[i][j]) isNew = true;
					let word = copyboard[i][j];
					let mult = 1;
					let points = 0;
					let orig = this.board[i][j];
					let stuff = this.getPoints(orig, copyboard[i][j]);
					mult *= stuff[1];
					points += stuff[0];
					j += 1;
					while (j < this.numCols && letters.indexOf(copyboard[i][j]) !== -1 && copyboard[i][j].length === 1) {
						word += copyboard[i][j];
						orig = this.board[i][j]
						let stuff = this.getPoints(orig, copyboard[i][j]);
						mult *= stuff[1];
						points += stuff[0];
						if (copyboard[i][j] !== this.board[i][j]) isNew = true;
						j += 1;
					}
					
					// @ts-ignore
					if (scrabwords.indexOf(Tools.toId(word).toUpperCase()) === -1 && word.length > 1) return "I don't recognize the word **" + word + "**.";
					if (isNew && word.length > 1) {
						totpoints += (points * mult);
					}
				}
			}
		}
		for (let j = 0; j < this.numCols; j++) {
			for (let i = 0; i < this.numRows; i++) {
				if (letters.indexOf(copyboard[i][j]) !== -1 && copyboard[i][j].length === 1) {
					let word = copyboard[i][j];
					let isNew = false;
					if (copyboard[i][j] !== this.board[i][j]) isNew = true;
					let mult = 1;
					let points = 0;
					let orig = this.board[i][j];
					let stuff = this.getPoints(orig, copyboard[i][j]);
					mult *= stuff[1];
					points += stuff[0];
					i += 1;
					while (i < this.numRows && letters.indexOf(copyboard[i][j]) !== -1 && copyboard[i][j].length === 1) {
						word += copyboard[i][j];
						orig = this.board[i][j]
						stuff = this.getPoints(orig, copyboard[i][j]);
						mult *= stuff[1];
						points += stuff[0];
						if (copyboard[i][j] !== this.board[i][j]) isNew = true;
						i += 1;
					}
					// @ts-ignore
					if (scrabwords.indexOf(Tools.toId(word).toUpperCase()) === -1 && word.length > 1) return "I don't recognize the word **" + word + "**.";
					
					if (isNew && word.length > 1) {
						totpoints += (points * mult);
					}
				}
			}
		}
		if (copyhand.length === this.hands.get(player).length) return "You have to use at least one tile...";
		if (copyhand.length === 0 && this.hands.get(player).length === 7) totpoints += 50;
		this.hands.set(player, copyhand);
		this.board = copyboard;
		return totpoints;
	}

	/**
	 * @param {string[][]} board
	 */
	printBoard(board) {
		console.log(board.map(row => row.join(", ")).join("\n"));
	}

	/**
	 * 
	 * @param {number[]} loc
	 * @param {string} direction
	 * @param {string} word
	 */
	doesConnect(loc, direction, word) {
		if (this.board[7][7] === "★") return true;
		let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		let realloc = loc.slice();
		let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
		for (let i = 0; i < word.length; i++) {
			if (direction === 'right') {
				realloc[1] = loc[1] + i;
			} else {
				realloc[0] = loc[0] + i;
			}
			for (let k = 0; k < directions.length; k++) {
				let copyloc = realloc.slice();
				copyloc[0] += directions[k][0];
				copyloc[1] += directions[k][1];
				if (copyloc[0] >= 0 && copyloc[1] >= 0 && copyloc[0] < this.numRows && copyloc[1] < this.numCols && letters.indexOf(this.board[copyloc[0]][copyloc[1]]) !== -1) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * @param {string} target
	 * @param {Room} room
	 * @param {User} user
	 */
	playword(target, room, user) {
		let player = this.players[user.id]
		if (player !== this.curPlayer || !this.canPlay) return;
		let split = target.split(",");
		if (split.length !== 3) {
			return this.say("You must specify your location, direction, and word you are playing");
		}
		let letters = "abcdefghijklmno";
		/** @type {string | number[]} */
		let loc = Tools.toId(split[0]);
		if (loc.length > 3) return this.say("Your location must be in the format [column-letter][row-number] (e.g. a6");
		if (letters.indexOf(loc[0]) === -1) return this.say("Your column name must be between ``A`` and ``Z``, inclusive.");
		let row = parseInt(loc.substr(1));
		if (!row || row < 1 || row > 15) return this.say("Your row number must be between ``1`` and ``15``");
		let direction = Tools.toId(split[1]);
		if (['down', 'right'].indexOf(direction) === -1) return this.say("The direction you specify must be ``Right`` or ``Down``");
		let word = Tools.toId(split[2]);
		word = word.toUpperCase();
		let copyboard = this.copyboard();
		loc = this.getLoc(loc);
		let connects = this.doesConnect(loc, direction, word);
		if (!connects) {
			return this.say("That doesn't connect to the rest of the tiles played!");
		}
		if (direction === 'right') {
			for (let i = 0; i < word.length; i++) {
				if (loc[1] >= this.numRows) {
					return this.say("Playing that word at that location would go off the edge of the board!");
				}
				copyboard[loc[0]][loc[1]] = word[i];
				loc[1]++;
			}
		} else {
			for (let i = 0; i < word.length; i++) {
				if (loc[0] >= this.numRows) {
					return this.say("Playing that word at that location would go off the edge of the board!");
				}
				copyboard[loc[0]][loc[1]] = word[i];
				loc[0]++;
			}
		}
		
		let legalMove = this.isLegalMove(copyboard, player);
		if (typeof legalMove === "string") {
			return this.say(legalMove);
		} else {
			if (this.timeout) clearTimeout(this.timeout);
			this.say("/wall " + this.curPlayer.name + " earned **" + legalMove + "** points!");
			this.points.set(this.curPlayer, this.points.get(this.curPlayer) + legalMove);
			this.board = copyboard;
			let hand = this.hands.get(player);
			while (hand.length < 7 && this.tiles.length > 0) {
				hand += this.tiles.shift();
			}
			if (hand.length === 0) {
				this.end();
				return;
			}
			this.numTurnsWithoutPlay = 0;
			this.hands.set(player, hand);
			this.sayHand(player);
			this.nextPlayer();
		}
	}

	onEnd() {
		for (let userID in this.players) {
			let player = this.players[userID];
			let hand = this.hands.get(player);
			let pointsLost = hand.split("").map((/** @type {string} */ letter) => letter === " " ? 0 : charpoints[letter.toLowerCase()]).reduce((/** @type {number} */ a, /** @type {number} */ b) => a + b, 0);
			this.points.set(player, this.points.get(player) - pointsLost);
		}
		for (let userID in this.players) {
			let player = this.players[userID];
			player.points = this.points.get(player);
		}
		this.say("/wall Final scores: " + Object.values(this.players)
			.sort(function (a, b) {
				return b.points - a.points;
			})
			.map(pl => pl.name + " (" + this.points.get(pl) + ")")
			.join(", "));
		let stuff = {};
		for (let userID in this.players) {
			stuff[userID] = this.players[userID].points;
		}
		// @ts-ignore
		Ratings.onMatchEnd(stuff);
		this.say("/deleteroom " + this.room.id);
	}

	/**
	 * @param {string} target
	 * @param {User} user
	 */
	pass(target, user) {
		let player = this.players[user.id];
		if (player !== this.curPlayer || !this.canPlay) return;
		let hand = this.hands.get(player).slice();
		target = Tools.toId(target).toUpperCase();
		let copytiles = this.tiles.slice();
		if (copytiles.length == 0) {
			return user.say("There are no tiles left to pass.");
		}
		for (let i = 0; i < target.length; i++) {
			let index = hand.indexOf(target[i]);
			if (index === -1) return player.say("You don't have **" + target[i] + "** to switch out!");
			hand = hand.slice(0, index) + hand.slice(index + 1);
			copytiles.push(target[i]);
		}
		copytiles = Tools.shuffle(copytiles);
		while (hand.length < 7 && copytiles.length > 0) {
			hand += copytiles.shift();
		}
		this.tiles = copytiles;
		this.hands.set(player, hand);
		this.sayHand(player);
		this.say("**" + player.name + "** has decided to pass " + target.length + " tiles!");
		if (this.timeout) clearTimeout(this.timeout);
		this.numTurnsWithoutPlay++;
		this.nextPlayer();
	}

	/**
	 * @param {String} target
	 * @param {User} user
	 */
	scores(target, user) {
		if (!this.started) return;
		for (let userID in this.players) {
			let player = this.players[userID];
			player.points = this.points.get(player);
		}
		this.say("/wall Current scores: " + Object.values(this.players)
			.sort(function (a, b) {
				return b.points - a.points;
			})
			.map(pl => pl.name + " (" + this.points.get(pl) + ")")
			.join(", "));
	}

	/**
	 * @param {String} target
	 * @param {User} user
	 */
	tilesleft(target, user) {
		if (!this.started) return;
		return this.say("There are **" + this.tiles.length + "** tiles remaining.");
	}

	/**
	 * @param {String} target
	 * @param {Room} room
	 * @param {User} user
	 */
	showboard(target, room, user) {
		if (!this.started) return;
		let player = this.players[user.id];
		if (player !== this.curPlayer || !this.canPlay) return;
		this.displayBoard();
	}

	/**
	 * @param {String} target
	 * @param {User} user
	 */
	hand(target, user) {
		if (!this.started) return;
		let player = this.players[user.id];
		if (!player || player.eliminated) return;
		this.sayHand(player);
	}

	/**
	 * @param {string} target
	 * @param {User} user
	 */
	rearrange(target, user) {
		let player = this.players[user.id];
		if (!player || player.eliminated || !this.started) return;
		target = Tools.toId(target);
		let hand = this.hands.get(player);
		hand = Tools.shuffle(hand.split("")).join("");
		this.hands.set(player, hand);
		this.sayHand(player);
	}
}

exports.game = Scrabble;
exports.name = name;
exports.id = id;
exports.commands = {
	playword: "playword",
	play: "playword",
	pass: "pass",
	showboard: "showboard",
	scores: "scores",
	tilesleft: "tilesleft",
	hand: "hand",
	showhand: "hand",
	tiles: "hand",
	rearrange: "rearrange",
};
exports.pmCommands = {
	pass: true,
	hand: true,
	rearrange: true,
};