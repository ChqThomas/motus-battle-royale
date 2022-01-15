import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
	dictionaries: [adjectives, colors, animals],
	separator: '-',
	length: 3,
};

export default class Player {
	public username: string;
	constructor() {
		this.username = uniqueNamesGenerator(customConfig);
	}
}
