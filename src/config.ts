import env from 'env-var'

require('dotenv').config();

const config = {
	migrationsPath: env.get('MIGRATION_PATH').required().asString(),
	databaseConfig: env.get('DATASOURCE').required().asJsonObject()
}

export default config;