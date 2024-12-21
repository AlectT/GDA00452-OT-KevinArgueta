import dotenv from 'dotenv';
import { Sequelize } from '@sequelize/core';
import { MsSqlDialect } from '@sequelize/mssql';

dotenv.config();

const sequelize = new Sequelize({
	dialect: MsSqlDialect,
	server: process.env.DB_SERVER,
	port: 1433,
	trustServerCertificate: true,
	database: process.env.DB_NAME,
	authentication: {
		type: 'default',
		options: {
			userName: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
		},
	},
});

export default sequelize;
