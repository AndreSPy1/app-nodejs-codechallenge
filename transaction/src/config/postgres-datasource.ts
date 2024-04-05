import { DataSource } from "typeorm";

const PostgresDataSource = new DataSource({
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "Jennifser970507*",
    "database": "db_transactions",
    "entities": ["src/entities/**/*.entity.ts"],
    "synchronize": false,
    "migrationsTableName": "migrations",
    "migrations": ["src/database/migrations/*.ts"]
});

export default PostgresDataSource;