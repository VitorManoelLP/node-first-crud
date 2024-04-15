export default class TableRegistry {

  private static registry: TableRegistry;
  private tables: Map<string, any>;

  constructor() {
    this.tables = new Map();
  }

  register(name: string, table: string) {
    this.tables.set(name, table);
  }

  get(name: string) {
    if (!this.tables.has(name)) throw new Error(`Table not found on entity ${name}`);
    return this.tables.get(name);
  }

  public static getInstance() {
    if (!TableRegistry.registry) {
      TableRegistry.registry = new TableRegistry();
    }
    return TableRegistry.registry;
  }

}

export function table(tableName: string) {
  return function (target: any) {
    TableRegistry.getInstance().register(target.name, tableName);
  }
}