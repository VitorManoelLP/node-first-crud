import Request from "./request";

export default class PostRequest<T> extends Request {
	constructor(readonly body: T) {
		super();
		this.body = body;
	}
}