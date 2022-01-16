import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
	dictionaries: [colors, animals],
	separator: '-',
	length: 2,
};

export default class Player {
	public username: string;
	public owner: boolean;
	constructor() {
		this.username = uniqueNamesGenerator(customConfig);
	}
}
