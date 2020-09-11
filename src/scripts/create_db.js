// put this info in config?
const client = 'pg';
const connectionString = 'postgres://foyvmuee:xt6BO6gX_zB7wCqANcxVKCRSejLFUCju@lallah.db.elephantsql.com:5432/foyvmuee';

const db = require('knex')({
    client: client,
    connection: connectionString
})

db.raw(`
    drop table if exists users;

    create table users(
        id serial PRIMARY KEY not null,
        login char(50) not null,
        password char(50) not null,
        age int not null,
        is_deleted boolean default false
     );

     create index ix_login_deleted
     on users (login, is_deleted);

    insert into users (login, password, age, is_deleted)
    values 
        ('user1', 'user1pw', 24, false),
        ('user2', 'user2pw', 25, false),
        ('user3', 'user3pw', 30, true),
        ('user4', 'user4pw', 80, false),
        ('user5', 'user5pw', 42, false)
`)
.then(() => process.exit(0));

