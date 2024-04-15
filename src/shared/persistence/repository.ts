export default interface Repository<T> {
	save(body: T): void;
	get(id: number, instance: T): Promise<Awaited<T>>;
	all(instance: T): Promise<Awaited<T[]>>;
	delete(id: number, instance: T): void;
	close(): Promise<void>;
}
