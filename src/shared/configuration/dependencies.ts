import ReadDirectory from "../files/read-directory";
import HttpClientExpress from "../http/http-client.express";
import DependencyRegistry from "../injection/dependency-registry";
import PgpRepository from "../persistence/pgp.repository";

export default class DependenciesConfig {

  static readonly REPOSITORY = 'repository';
  static readonly QUERY = 'query';
  static readonly HTTP_CLIENT = 'httpClient';
  static readonly READ_FILE = 'read_file';

  static registerBeans() {
    this.repository();
    this.httpClient();
    this.readDirectory();
  }

  private static repository(): void {
    const repository = new PgpRepository();
    DependencyRegistry.getInstance().register(DependenciesConfig.REPOSITORY, repository);
    DependencyRegistry.getInstance().register(DependenciesConfig.QUERY, repository);
  }

  private static httpClient(): void {
    DependencyRegistry.getInstance().register(DependenciesConfig.HTTP_CLIENT, new HttpClientExpress());
  }

  private static readDirectory(): void {
    DependencyRegistry.getInstance().register(DependenciesConfig.READ_FILE, new ReadDirectory());
  }

}