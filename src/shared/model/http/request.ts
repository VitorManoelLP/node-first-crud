export default abstract class Request {

	protected _response: Response | undefined;

	get response(): Response | undefined {
		return this._response;
	}

	set response(response: Response) {
		this._response = response;
	}

}

export interface Response {
	status: number;
	body: any;
}