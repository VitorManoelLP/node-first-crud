import Obligation from "../model/obligation";
import DependenciesConfig from "../shared/configuration/dependencies";
import { inject } from "../shared/injection/dependency-registry";
import TableRegistry from "../shared/injection/table-registry";
import Query from "../shared/persistence/query";

export default class FinishTodo {

  @inject(DependenciesConfig.QUERY)
  private query!: Query;

  public finish(id: number): void {
    const tableName = TableRegistry.getInstance().get(Obligation.prototype.constructor.name);
    this.query.create(`UPDATE ${tableName} SET finished = true WHERE id = ${id}`);
  }

}