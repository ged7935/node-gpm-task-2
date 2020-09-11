import knex from 'knex';
import Container from 'typedi';
import Knex from 'knex';

// put this info in config?
const client: string = 'pg';
const connectionString: string = 'postgres://foyvmuee:xt6BO6gX_zB7wCqANcxVKCRSejLFUCju@lallah.db.elephantsql.com:5432/foyvmuee';

function createDatabase(): Knex {
    return knex({
        client: client,
        connection: connectionString
    });
}

export default () => {
    Container.set('db', createDatabase());    
};
