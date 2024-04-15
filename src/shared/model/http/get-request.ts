import Request from "./request";

export default class GetRequest extends Request {
	constructor(readonly id?: string) {
		super();
		this.id = id;
	}
}