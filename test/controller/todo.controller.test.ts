import TodoController from "../../src/controller/todo.controller";
import PostRequest from "../../src/shared/model/http/post-request";
import Obligation from "../../src/model/obligation";
import HttpClientAdapter from "../../src/shared/http/http-client.adapter";
import Repository from "../../src/shared/persistence/repository";
import GetRequest from "../../src/shared/model/http/get-request";
import DependencyRegistry from "../../src/shared/injection/dependency-registry";
import DependenciesConfig from "../../src/shared/configuration/dependencies";
import FinishTodo from "../../src/service/finish-todo";
import { DeleteRequest } from "../../src/shared/model/http/delete-request";

let todoController: TodoController;
let httpClientMock: jest.Mocked<HttpClientAdapter>;
let repositoryMock: jest.Mocked<Repository<Obligation>>;
let finishTodoMock: jest.Mocked<FinishTodo>;

const bodyMock = {
	title: 'title',
	description: 'description',
	postedAt: new Date(),
	finished: false
};

beforeEach(() => {

	httpClientMock = {
		post: jest.fn(),
		get: jest.fn(),
		all: jest.fn(),
		delete: jest.fn()
	} as unknown as jest.Mocked<HttpClientAdapter>;

	repositoryMock = {
		save: jest.fn(),
		get: jest.fn(),
		all: jest.fn(),
		delete: jest.fn()
	} as unknown as jest.Mocked<Repository<Obligation>>;

	finishTodoMock = {
		finish: jest.fn()
	} as unknown as jest.Mocked<FinishTodo>;

	DependencyRegistry.getInstance().register(DependenciesConfig.REPOSITORY, repositoryMock);
	DependencyRegistry.getInstance().register(DependenciesConfig.HTTP_CLIENT, httpClientMock);

	todoController = new TodoController(httpClientMock, finishTodoMock);
});

test('should save obligation when post register to be called', () => {
	httpClientMock.post.mockImplementation((path: string, callback: Function) => {
		const request = new PostRequest(bodyMock);
		callback(request);
	});
	todoController.save();
	expect(httpClientMock.post).toHaveBeenCalledTimes(1);
	expect(repositoryMock.save).toHaveBeenCalledTimes(1);
});

test('should get todo when get register to be called', () => {
	httpClientMock.get.mockImplementation((path: string, callback: Function) => {
		callback(new GetRequest('1'));
	});
	repositoryMock.get.mockReturnValue(new Promise((resolve, rejected) => {
		resolve(bodyMock as Obligation);
	}));
	todoController.get();
	expect(httpClientMock.get).toHaveBeenCalledTimes(1);
	expect(repositoryMock.get).toHaveBeenCalledWith(1, {});
});

test('should get todo when get register to be called', () => {
	httpClientMock.all.mockImplementation((path: string, callback: Function) => {
		callback(new GetRequest());
	});
	repositoryMock.all.mockReturnValue(new Promise((resolve, rejected) => {
		resolve([bodyMock as Obligation]);
	}));
	todoController.all();
	expect(httpClientMock.all).toHaveBeenCalledTimes(1);
	expect(repositoryMock.all).toHaveBeenCalled();
});

test('should delete todo when delete register to be called', () => {

	httpClientMock.delete.mockImplementation((path: string, callback: Function) => {
		callback(new DeleteRequest("1"));
	});

	todoController.delete();
	expect(httpClientMock.delete).toHaveBeenCalledTimes(1);
	expect(repositoryMock.delete).toHaveBeenCalledWith(1, {});
});


test('should call finishTodo when onFinish to be called', () => {

	httpClientMock.get.mockImplementation((path: string, callback: Function) => {
		callback(new GetRequest("1"));
	});

	todoController.onFinish();

	expect(httpClientMock.get).toHaveBeenCalledTimes(1);
	expect(finishTodoMock.finish).toHaveBeenCalledWith(1);
});