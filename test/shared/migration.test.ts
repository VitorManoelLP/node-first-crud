import DependenciesConfig from "../../src/shared/configuration/dependencies";
import ReadDirectory from "../../src/shared/files/read-directory";
import DependencyRegistry from "../../src/shared/injection/dependency-registry";
import SqlMigration from "../../src/shared/migration/sql-migration";
import Query from "../../src/shared/persistence/query";
import { MD5 } from "crypto-js";

test('should create table migration when object was created', () => {

  const queryMock = {
    create: jest.fn()
  } as unknown as jest.Mocked<Query>;

  const readDirectory = {
    readDirectory: jest.fn()
  } as unknown as jest.Mocked<ReadDirectory>;

  DependencyRegistry.getInstance().register(DependenciesConfig.QUERY, queryMock);
  DependencyRegistry.getInstance().register(DependenciesConfig.READ_FILE, readDirectory);

  new SqlMigration();

  expect(queryMock.create).toHaveBeenCalledWith('CREATE TABLE IF NOT EXISTS MIGRATION (ID VARCHAR(255) PRIMARY KEY, FILE VARCHAR(255), EXECUTED BOOLEAN DEFAULT FALSE, EXECUTED_AT timestamp NOT NULL);');

});

test('should call count of migration when sql migration to have been executed', () => {

  const queryMock = {
    create: jest.fn()
  } as unknown as jest.Mocked<Query>;

  const readDirectory = {
    readDirectory: jest.fn(),
    readFile: jest.fn()
  } as unknown as jest.Mocked<ReadDirectory>;

  const content = 'file content';

  readDirectory.readFile.mockReturnValue(content);
  readDirectory.readDirectory.mockImplementation((path: string, callback: Function) => {
    callback(['file.sql']);
  });
  queryMock.create.mockReturnValue(Promise.all([{ exist: true }]));

  DependencyRegistry.getInstance().register(DependenciesConfig.QUERY, queryMock);
  DependencyRegistry.getInstance().register(DependenciesConfig.READ_FILE, readDirectory);

  const md5 = MD5(content);

  const migration = new SqlMigration();

  migration.migrate();

  expect(queryMock.create).toHaveBeenCalledTimes(2);
  expect(queryMock.create).toHaveBeenLastCalledWith(`SELECT COUNT(*) > 0 as exist FROM MIGRATION WHERE ID = '${md5}'`);
});

test('should call query of file and insert migration when exists return false', async () => {

  const queryMock = {
    create: jest.fn()
  } as unknown as jest.Mocked<Query>;

  queryMock.create.mockReset();

  const readDirectory = {
    readDirectory: jest.fn(),
    readFile: jest.fn()
  } as unknown as jest.Mocked<ReadDirectory>;

  const content = 'file content';

  readDirectory.readFile.mockReturnValue(content);
  readDirectory.readDirectory.mockImplementation((path: string, callback: Function) => {
    callback(['file.sql']);
  });

  queryMock.create.mockReturnValue(Promise.all([{ exist: false }]));

  DependencyRegistry.getInstance().register(DependenciesConfig.QUERY, queryMock);
  DependencyRegistry.getInstance().register(DependenciesConfig.READ_FILE, readDirectory);

  const migration = new SqlMigration();

  await migration.migrate();

  expect(queryMock.create).toHaveBeenCalledTimes(4);
  expect(queryMock.create).toHaveBeenCalledWith(content);
});