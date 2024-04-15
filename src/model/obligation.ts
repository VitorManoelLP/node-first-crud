import { table } from "../shared/injection/table-registry";
import Entity from "../shared/model/persistence/entity";

@table('todo')
export default class Obligation implements Entity {

	id!: number;
	title: string;
	description: string;
	postedAt: Date;
	finished: boolean;

	constructor(title: string, description: string) {
		if (!title?.length) throw new Error('Title must not to be empty');
		if (!description.length) throw new Error('Description must not to be empty');
		this.title = title;
		this.description = description;
		this.postedAt = new Date();
		this.finished = false;
	}

}