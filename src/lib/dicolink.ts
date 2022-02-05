import axios from 'axios';
import 'dotenv/config';

export type Definition = {
	id: string;
	nature: string;
	source: string;
	attributionText: string;
	attributionUrl: string;
	mot: string;
	definition: string;
	dicolinkUrl: string;
};

export async function getDefinition(word: string): Promise<Definition> {
	if (typeof process.env.DICOLINK_API_KEY === 'undefined') {
		return null;
	}
	try {
		const response = await axios.get<Definition[]>(`https://api.dicolink.com/v1/mot/${word}/definitions`, {
			params: {
				api_key: process.env.DICOLINK_API_KEY,
				limite: 1,
			},
		});
		if (response.data.length) {
			return response.data[0];
		}
		return null;
	} catch (error) {
		console.log(error);
	}
	return null;
}
