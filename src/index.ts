import DependenciesConfig from "./shared/configuration/dependencies";
import TodoController from "./controller/todo.controller";
import DependencyRegistry from "./shared/injection/dependency-registry";
import SqlMigration from "./shared/migration/sql-migration";
import FinishTodo from "./service/finish-todo";

DependenciesConfig.registerBeans();

new SqlMigration().migrate();

const port = 3000;

const httpClient = DependencyRegistry.getInstance().inject(DependenciesConfig.HTTP_CLIENT);

const finishTodo = new FinishTodo();
new TodoController(httpClient, finishTodo).registerEndpoint();

httpClient.listen(port);

export default httpClient;

