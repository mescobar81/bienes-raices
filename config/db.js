import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({path: '.env'});

const db = new Sequelize(process.env.DBNAME, process.env.USER,process.env.PASSWORD, {
    host: process.env.HOST,
    port: process.env.DBPORT,
    dialect: 'postgres',
    define:{
        timestamps: true
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export default db;