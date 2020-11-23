import { Container, Service } from 'typedi';
import Knex from 'knex';

@Service()
class Database {
    public instance: Knex;
    constructor() { 
        this.instance = Knex({
            client: process.env.DB_CLIENT,
            connection: process.env.DB_CONNECTION_STRING
        });
    }
}
export default Database;
