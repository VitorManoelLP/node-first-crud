import DependenciesConfig from "../configuration/dependencies";
import { inject } from "../injection/dependency-registry";
import Query from "../persistence/query";
import path from "path";
import MD5 from "crypto-js/md5";
import ReadFile from "../files/read-directory";
import config from "../../config";

export default class SqlMigration {

  @inject(DependenciesConfig.QUERY)
  private query!: Query;

  @inject(DependenciesConfig.READ_FILE)
  private reader!: ReadFile;

  constructor() {
    this.query.create('CREATE TABLE IF NOT EXISTS MIGRATION (ID VARCHAR(255) PRIMARY KEY, FILE VARCHAR(255), EXECUTED BOOLEAN DEFAULT FALSE, EXECUTED_AT timestamp NOT NULL);');
  }

  async migrate() {

    const migrationPath = `${path.resolve(process.cwd())}${config.migrationsPath}`;

    await this.reader.readDirectory(migrationPath, async (files: any[]) => {

      for (const file of files) {

        const sqlPath = `${migrationPath}/${file}`;
        const content = this.reader.readFile(sqlPath);
        const hash = MD5(content).toString();

        const exists = await this.query.create(`SELECT COUNT(*) > 0 as exist FROM MIGRATION WHERE ID = '${hash}'`);

        if (!exists[0]['exist']) {
          this.query.create(`INSERT INTO MIGRATION(ID, EXECUTED, EXECUTED_AT, FILE) VALUES ($1, $2, $3, $4);`, [hash, true, new Date(), file])
          this.query.create(content);
        }

      }

    })

  }

}