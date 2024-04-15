import { DeleteRequest } from "../model/http/delete-request";
import GetRequest from "../model/http/get-request";
import PostRequest from "../model/http/post-request";
import HttpClientAdapter from "./http-client.adapter";
import express from 'express'

export default class HttpClientExpress implements HttpClientAdapter {

	private app;

	constructor() {
		const app = express();
		app.use(express.json());
		this.app = app;
	}

	listen(port: number): void {
		this.app.listen(port, () => {
			console.log(`Listening on port by express ${port}`)
		});
	}

	post(path: string, callback: Function): void {
		this.app.post(path, async (req: any, res: any) => {
			const request = new PostRequest(req.body)
			await callback(request);
			res.status(request.response?.status).json(request.response?.body);
		});
	}

	get(path: string, callback: Function): void {
		this.app.get(`${path}/:id`, async (req: any, res: any) => {
			const request = new GetRequest(req.params.id)
			await callback(request);
			res.status(request.response?.status).json(request.response?.body);
		});
	}

	all(path: string, callback: Function): void {
		this.app.get(path, async (req: any, res: any) => {
			const request = new GetRequest();
			await callback(request);
			res.status(request.response?.status).json(request.response?.body);
		});
	}

	delete(path: string, callback: Function): void {
		this.app.delete(`${path}/:id`, async (req: any, res: any) => {
			const request = new DeleteRequest(req.params.id);
			await callback(request);
			res.status(request.response?.status).json(request.response?.body);
		});
	}

}