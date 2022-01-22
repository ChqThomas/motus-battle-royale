import { uniqueNamesGenerator, Config, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
	dictionaries: [colors, animals],
	separator: '-',
	length: 2,
};

export default class Player {
	public id: string;
	public username: string;
	public owner: boolean;
	constructor(id: string, username?: string) {
		this.id = id;
		this.username = username || uniqueNamesGenerator(customConfig);
	}
}
