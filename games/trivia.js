/**
 * Trivia game
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * @license MIT license
 */

'use strict';

const Room = require('./../rooms').Room; // eslint-disable-line no-unused-vars
const User = require('./../users').User; // eslint-disable-line no-unused-vars

const name = "Trivia";

const data = {
	"Pokemon Moves": {},
	"Pokemon Items": {},
	"Pokemon Abilities": {},
	"Pokemon Badges": {},
};

for (let i in Tools.data.moves) {
	let move = Tools.data.moves[i];
	if (!move.name) continue;
	let desc = move.desc || move.shortDesc;
	if (!desc) continue;
	if (!(desc in data["Pokemon Moves"])) data["Pokemon Moves"][desc] = [];
	data["Pokemon Moves"][desc].push(move.name);
}

for (let i in Tools.data.items) {
	let item = Tools.data.items[i];
	if (!item.name) continue;
	let desc = item.desc || item.shortDesc;
	if (!desc) continue;
	if (!(desc in data["Pokemon Items"])) data["Pokemon Items"][desc] = [];
	data["Pokemon Items"][desc].push(item.name);
}

for (let i in Tools.data.abilities) {
	let ability = Tools.data.abilities[i];
	if (!ability.name) continue;
	let desc = ability.desc || ability.shortDesc;
	if (!desc) continue;
	if (!(desc in data["Pokemon Abilities"])) data["Pokemon Abilities"][desc] = [];
	data["Pokemon Abilities"][desc].push(ability.name);
}

for (let i in Tools.data.badges) {
	let badges = Tools.data.badges[i];
	data["Pokemon Badges"]["This is the badge of " + i + "."] = badges;
}

// if inheriting from or inherited by another game, this class would be declared as:
// let Trivia = base => class extends base {
class Trivia extends Games.Game {
	/**
	 * @param {Room} room
	 */
	constructor(room) {
		super(room);
		this.freeJoin = true;
		/**@type {Array<string>} */
		this.answers = [];
		/**@type {?NodeJS.Timer} */
		this.timeout = null;
		this.hint = '';
		this.points = new Map();
		this.maxPoints = 3;
		this.categories = Object.keys(data);
		this.questions = {};
		for (let i = 0, len = this.categories.length; i < len; i++) {
			this.questions[this.categories[i]] = Object.keys(data[this.categories[i]]);
		}
	}

	onSignups() {
		this.timeout = setTimeout(() => this.nextRound(), 10 * 1000);
	}

	setAnswers() {
		let category;
		if (this.variation) {
			category = this.variation;
		} else {
			category = Tools.sample(this.categories);
		}
		let question = Tools.sample(this.questions[category]);
		this.answers = data[category][question];
		this.hint = "**" + category + "**: " + question;
	}

	onNextRound() {
		if (this.answers.length) {
			this.say("Time's up! The answer" + (this.answers.length > 1 ? "s were" : " was") + " __" + this.answers.join(", ") + "__");
		}
		this.setAnswers();
		this.on(this.hint, () => {
			this.timeout = setTimeout(() => this.nextRound(), 10 * 1000);
		});
		this.say(this.hint);
	}
}

exports.name = name;
exports.id = Tools.toId(name);
exports.description = "Players guess answers based on the given descriptions!";
exports.commands = {
	// command: game function
	// alias: command
	"guess": "guess",
	"g": "guess",
};
exports.aliases = ['triv'];
exports.variations = [
	{
		name: "Move Trivia",
		aliases: ['Moves Trivia'],
		variation: "Pokemon Moves",
		variationAliases: ['moves'],
	},
	{
		name: "Item Trivia",
		aliases: ['Items Trivia'],
		variation: "Pokemon Items",
		variationAliases: ['items'],
	},
	{
		name: "Ability Trivia",
		aliases: ['Abilities Trivia'],
		variation: "Pokemon Abilities",
		variationAliases: ['abilities'],
	},
	{
		name: "Badge Trivia",
		aliases: ['Badges Trivia'],
		variation: "Pokemon Badges",
		variationAliases: ['badges'],
	},
];
exports.modes = ["Survival", "Team"];
// if inheriting from or inherited by another game, this game would be exported as:
// exports.install = Trivia;
exports.game = Trivia;

/**
 * @param {Trivia} game
 */
exports.spawnMochaTests = function (game) {
	// you can skip tests for variations or modes by checking "game.variationId" or "game.modeId" here
	if (game.modeId) return;

	const assert = require('assert');

	let tests = {
		/**
		 * @param {Trivia} game
		 */
		'guess': game => {
			game.signups();
			game.nextRound();
			MessageParser.parseCommand(Config.commandCharacter + 'guess ' + game.answers[0], game.room, Users.add("User 1"));
			assert(game.points.get(game.players['user1']) === 1);
		},
	};

	return tests;
};