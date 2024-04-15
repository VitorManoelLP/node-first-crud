export default interface HttpClientAdapter {
	post(path: string, callback: Function): void;
	get(path: string, callback: Function): void;
	all(path: string, callback: Function): void;
	delete(path: string, callback: Function): void;
}
