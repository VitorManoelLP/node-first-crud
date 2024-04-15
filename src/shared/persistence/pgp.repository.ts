import Repository from "./repository";
import config from "../../config";
import pgp from 'pg-promise';
import Entity from "../model/persistence/entity";
import TableRegistry from "../injection/table-registry";
import Query from "./query";

export default class PgpRepository<T extends Entity> implements Repository<T>, Query {

	private db;

	constructor() {
		const datasource: any = config.databaseConfig;
		const database = pgp();
		this.db = database({
			connectionString: `postgresql://${datasource['host']}:${datasource['port']}/postgres`,
			user: datasource['user'],
			password: datasource['password'],
			database: datasource['database']
		});
	}

	async create(query: string, values?: any): Promise<any> {
		return this.db.query(query, values);
	}

	async close(): Promise<void> {
		await this.db.$pool.end();
	}

	async save(body: T) {
		const persistence = new PersistenceManager(body, this);
		const params = await persistence.createParametersToPersist();
		await this.db.query('INSERT INTO ' + params.tableName + ' VALUES' + `(${params.parametersField});`, params.queryValues).catch(err => console.error(err));
	}

	async get(id: number, instance: T): Promise<Awaited<T>> {
		const tableName = TableRegistry.getInstance().get(instance.constructor.name);
		const data = await this.create(`SELECT * FROM ${tableName} WHERE id = ${id}`);
		return data[0];
	}

	async all(instance: T): Promise<Awaited<T[]>> {
		const tableName = TableRegistry.getInstance().get(instance.constructor.name);
		const data = await this.create(`SELECT * FROM ${tableName}`);
		return data;
	}

	delete(id: number, instance: T): void {
		const tableName = TableRegistry.getInstance().get(instance.constructor.name);
		this.create(`DELETE FROM ${tableName} WHERE id = ${id}`);
	}

}

export class PersistenceManager<T extends Entity> {

	private values: any[];

	constructor(private readonly body: T, private readonly query: Query) {
		this.body = body;
		this.query = query;
		this.values = Object.values(this.body);
	}

	public async createParametersToPersist() {
		const tableName = TableRegistry.getInstance().get(this.body.constructor.name);
		const nextId = await this.query.create('SELECT (max(id) + 1) as next FROM ' + tableName);
		const id = nextId[0]['next'] ?? 1;
		const queryValues = [id].concat(this.values);
		return {
			tableName: tableName,
			queryValues: queryValues,
			parametersField: this.buildParameterField()
		}
	}

	private buildParameterField() {
		return this.values.concat('id').map((_, index) => `$${index + 1}`).join(',');
	}

}