import GetRequest from "../shared/model/http/get-request";
import Obligation from "../model/obligation";
import PostRequest from "../shared/model/http/post-request";
import HttpClientAdapter from "../shared/http/http-client.adapter";
import { inject } from "../shared/injection/dependency-registry";
import DependenciesConfig from "../shared/configuration/dependencies";
import Repository from "../shared/persistence/repository";
import { DeleteRequest } from "../shared/model/http/delete-request";
import FinishTodo from "../service/finish-todo";

export default class TodoController {

	private readonly path = '/api/todo';

	@inject(DependenciesConfig.REPOSITORY)
	private repository!: Repository<Obligation>;

	constructor(private readonly httpClient: HttpClientAdapter, private readonly finishTodo: FinishTodo) {
		this.httpClient = httpClient;
		this.finishTodo = finishTodo;
	}

	public registerEndpoint() {
		this.save();
		this.get();
		this.all();
		this.delete();
		this.onFinish();
	}

	public save() {
		this.httpClient.post(this.path, (request: PostRequest<Obligation>) => {
			this.repository.save(new Obligation(request.body.title, request.body.description));
			request.response = {
				body: request.body,
				status: request.response?.status || 201
			}
		});
	}

	public get() {
		this.httpClient.get(this.path, async (request: GetRequest) => {
			const todo = await this.repository.get(Number(request.id), Obligation.prototype);
			request.response = {
				body: todo,
				status: request.response?.status || 200
			}
		});
	}

	public all() {
		this.httpClient.all(this.path, async (request: GetRequest) => {
			const todo = await this.repository.all(Obligation.prototype);
			request.response = {
				body: todo,
				status: request.response?.status || 200
			}
		});
	}

	public delete() {
		this.httpClient.delete(this.path, async (request: DeleteRequest) => {
			const todo = await this.repository.delete(Number(request.id), Obligation.prototype);
			request.response = {
				body: todo,
				status: request.response?.status || 200
			}
		});
	}

	public onFinish() {
		this.httpClient.get(`${this.path}/finish`, async (request: GetRequest) => {
			const finishResponse = await this.finishTodo.finish(Number(request.id));
			request.response = {
				body: finishResponse,
				status: request.response?.status || 200
			}
		});
	}

}